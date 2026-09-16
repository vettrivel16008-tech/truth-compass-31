import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  verdictFromScore,
  type AnalysisResult,
  type ScoreFactor,
  type SourceRef,
  type Stance,
} from "./analysis-types";

const InputSchema = z.object({
  text: z.string().min(1).max(20000),
});

/* ---------------------------- pipeline steps ---------------------------- */

function cleanText(raw: string): string {
  return raw
    .replace(/\u0000/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 12000);
}

const LANGUAGE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "mainClaim",
    "claims",
    "entities",
    "warningSignals",
    "languageRisk",
    "requiresExternalVerification",
    "missingContext",
    "searchQuery",
    "summary",
  ],
  properties: {
    mainClaim: { type: "string" },
    claims: { type: "array", items: { type: "string" } },
    entities: { type: "array", items: { type: "string" } },
    warningSignals: { type: "array", items: { type: "string" } },
    languageRisk: { type: "string", enum: ["low", "medium", "high"] },
    requiresExternalVerification: { type: "boolean" },
    missingContext: { type: "array", items: { type: "string" } },
    searchQuery: { type: "string" },
    summary: { type: "string" },
  },
} as const;

interface LanguagePass {
  mainClaim: string;
  claims: string[];
  entities: string[];
  warningSignals: string[];
  languageRisk: "low" | "medium" | "high";
  requiresExternalVerification: boolean;
  missingContext: string[];
  searchQuery: string;
  summary: string;
}

const EVIDENCE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["assessments", "evidence", "evidenceVerdict"],
  properties: {
    assessments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["index", "stance", "note"],
        properties: {
          index: { type: "integer" },
          stance: { type: "string", enum: ["supports", "contradicts", "context"] },
          note: { type: "string" },
        },
      },
    },
    evidence: { type: "array", items: { type: "string" } },
    evidenceVerdict: {
      type: "string",
      enum: ["supported", "contradicted", "mixed", "insufficient"],
    },
  },
} as const;

interface EvidencePass {
  assessments: Array<{ index: number; stance: Stance; note: string }>;
  evidence: string[];
  evidenceVerdict: "supported" | "contradicted" | "mixed" | "insufficient";
}

/* ------------------------------- scoring -------------------------------- */

function scoreAnalysis(args: {
  lang: LanguagePass;
  evidenceVerdict: EvidencePass["evidenceVerdict"] | null;
  supporting: number;
  contradicting: number;
  searchAvailable: boolean;
}): { score: number; factors: ScoreFactor[] } {
  const { lang, evidenceVerdict, supporting, contradicting, searchAvailable } = args;
  let score = 60; // neutral starting point: unknown, not guilty
  const factors: ScoreFactor[] = [];

  // Evidence weighs most.
  if (!searchAvailable) {
    factors.push({
      label: "Source evidence",
      value: "Not available",
      note: "External source verification is not configured, so this assessment is based on language and claim analysis only.",
    });
    // No penalty: an unchecked claim is unverified, not false.
  } else if (evidenceVerdict === "supported") {
    score += 26;
    factors.push({
      label: "Source evidence",
      value: `${supporting} supporting source${supporting === 1 ? "" : "s"}`,
      note: "Credible sources were found that support the main claim.",
    });
  } else if (evidenceVerdict === "contradicted") {
    score -= 34;
    factors.push({
      label: "Source evidence",
      value: `${contradicting} contradicting source${contradicting === 1 ? "" : "s"}`,
      note: "Credible sources were found that contradict the main claim.",
    });
  } else if (evidenceVerdict === "mixed") {
    score -= 4;
    factors.push({
      label: "Source evidence",
      value: "Mixed",
      note: "Sources both support and contradict parts of the claim.",
    });
  } else {
    score -= 5;
    factors.push({
      label: "Source evidence",
      value: "None found",
      note: "No reliable supporting evidence was found in the available sources.",
    });
  }

  // Language signals: a modest influence only. Style is not proof.
  const langAdj = lang.languageRisk === "high" ? -10 : lang.languageRisk === "medium" ? -5 : 3;
  score += langAdj;
  factors.push({
    label: "Language signals",
    value:
      lang.languageRisk === "high"
        ? "Strong manipulative wording"
        : lang.languageRisk === "medium"
          ? "Some emotive wording"
          : "Neutral wording",
    note: "Writing style is a warning signal only — it is never treated as proof of misinformation.",
  });

  // Claim consistency
  const consistency = lang.warningSignals.length;
  const consAdj = consistency >= 4 ? -8 : consistency >= 2 ? -4 : 2;
  score += consAdj;
  factors.push({
    label: "Claim consistency",
    value: consistency === 0 ? "No internal issues detected" : `${consistency} signal(s) noted`,
    note: "Based on internal contradictions, unsupported certainty and sourcing inside the text.",
  });

  // Context
  const ctxAdj = lang.missingContext.length >= 2 ? -6 : lang.missingContext.length === 1 ? -3 : 2;
  score += ctxAdj;
  factors.push({
    label: "Context",
    value: lang.missingContext.length ? "Important context missing" : "Context appears adequate",
    note: lang.missingContext.join("; ") || "No major missing context identified.",
  });

  factors.push({
    label: "Verification status",
    value: !searchAvailable
      ? "Not performed"
      : evidenceVerdict === "insufficient"
        ? "Inconclusive"
        : "Sources checked",
    note: lang.requiresExternalVerification
      ? "This claim requires independent verification before it is shared."
      : "Independent verification is still recommended.",
  });

  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, factors };
}

/* ----------------------------- server function --------------------------- */

export const analyzeNews = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const { generateStructured, AiError } = await import("./ai.server");
    const { searchSources, isSearchConfigured, isPreferred } = await import("./search.server");

    const text = cleanText(data.text);
    if (text.length < 15) {
      throw new Error("Please enter a meaningful headline or article.");
    }

    try {
      // 1-3. Text cleaning -> claim extraction -> AI language analysis
      const lang = await generateStructured<LanguagePass>({
        schemaName: "claim_analysis",
        schema: LANGUAGE_SCHEMA,
        instructions: [
          "You are a careful misinformation analyst. Analyse the submitted news text.",
          "Extract the central factual claim and other checkable claims, named entities (people, organisations, places, dates, events),",
          "language warning signals (emotive or sensational wording, unsupported certainty, missing sourcing, internal contradictions, misleading framing),",
          "and what important context is missing.",
          "NEVER conclude something is false purely from writing style. Never invent sources, URLs, or evidence.",
          "searchQuery must be a concise neutral query (max 20 words) that a fact-checker would use to verify the main claim.",
          "summary: 1-2 neutral sentences describing what the text asserts.",
        ].join(" "),
        input: text,
      });

      // 4. Source / evidence verification
      let sources: SourceRef[] = [];
      let evidence: string[] = [];
      let evidenceVerdict: EvidencePass["evidenceVerdict"] | null = null;
      let supporting = 0;
      let contradicting = 0;
      const searchAvailable = isSearchConfigured();

      if (searchAvailable) {
        let hits: Awaited<ReturnType<typeof searchSources>> = null;
        try {
          hits = await searchSources(lang.searchQuery || lang.mainClaim || text.slice(0, 200));
        } catch {
          hits = null;
        }

        if (hits && hits.length > 0) {
          const listed = hits
            .map(
              (h, i) =>
                `[${i}] ${h.domain} | ${h.title} | ${h.date ?? "no date"}\n${h.snippet}`,
            )
            .join("\n\n");

          const ev = await generateStructured<EvidencePass>({
            schemaName: "evidence_assessment",
            schema: EVIDENCE_SCHEMA,
            instructions: [
              "You compare a claim against real search results. Use ONLY the provided results.",
              "For each result index decide whether it supports, contradicts, or only provides context for the claim.",
              "evidence: short factual statements drawn strictly from the provided snippets, each citing the domain.",
              "Do not invent sources, titles, URLs, or facts not present in the snippets.",
              "evidenceVerdict is 'insufficient' when the results do not actually address the claim.",
            ].join(" "),
            input: `CLAIM: ${lang.mainClaim}\n\nSEARCH RESULTS:\n${listed}`,
          });

          evidence = ev.evidence ?? [];
          evidenceVerdict = ev.evidenceVerdict;
          sources = (ev.assessments ?? [])
            .filter((a) => hits![a.index])
            .map((a) => {
              const h = hits![a.index]!;
              return {
                name: h.domain,
                title: h.title,
                date: h.date,
                url: h.url,
                stance: a.stance,
                note: a.note,
              };
            })
            .sort(
              (a, b) =>
                Number(isPreferred(b.name)) - Number(isPreferred(a.name)),
            );
          supporting = sources.filter((s) => s.stance === "supports").length;
          contradicting = sources.filter((s) => s.stance === "contradicts").length;
        } else {
          evidenceVerdict = "insufficient";
        }
      }

      // 5-6. Credibility scoring + human readable explanation
      const raw = scoreAnalysis({
        lang,
        evidenceVerdict,
        supporting,
        contradicting,
        searchAvailable,
      });
      const factors = raw.factors;

      // Evidence decides the verdict. Style and uncertainty never do.
      const contradictedByEvidence = evidenceVerdict === "contradicted" && contradicting > 0;
      const supportedByEvidence = evidenceVerdict === "supported" && supporting > 0;

      let score = raw.score;
      let verdict: AnalysisResult["verdict"];
      if (contradictedByEvidence) {
        verdict = "Likely Misleading / Fake";
        score = Math.min(score, 49);
      } else if (supportedByEvidence) {
        score = Math.max(score, 80);
        verdict = "Likely Reliable";
      } else {
        // No evidence found, mixed evidence, or verification unavailable:
        // that is "unverified", never "false".
        score = Math.min(Math.max(score, 50), 79);
        verdict = "Needs Verification";
      }
      void verdictFromScore;

      const explanation = [
        lang.summary,
        searchAvailable
          ? evidenceVerdict === "insufficient"
            ? "No reliable supporting evidence was found in the available sources, so the claim could not be independently confirmed."
            : evidenceVerdict === "contradicted"
              ? "Credible sources were found that contradict the central claim."
              : evidenceVerdict === "supported"
                ? "Credible sources were found that support the central claim."
                : "The available sources both support and contradict parts of the claim."
          : "External source verification is not configured for this deployment, so this assessment reflects language and claim analysis only.",
      ]
        .filter(Boolean)
        .join(" ");

      return {
        verdict,
        score,
        summary: explanation,
        claims: lang.claims?.length ? lang.claims : lang.mainClaim ? [lang.mainClaim] : [],
        warningSignals: lang.warningSignals ?? [],
        evidence,
        sources,
        recommendation:
          verdict === "Likely Reliable"
            ? "Even where evidence aligns, check the original source and one independent outlet before sharing."
            : "Check the original source and compare the claim with at least two reliable, independent sources before sharing.",
        factors,
        verificationStatus: !searchAvailable
          ? "unavailable"
          : sources.length > 0
            ? "verified_sources"
            : "no_evidence_found",
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      if (err instanceof AiError) throw new Error(err.userMessage);
      if (err instanceof Error && err.message.startsWith("Please enter")) throw err;
      console.error("Analysis failed", err);
      throw new Error("Unable to verify this claim with the available sources. Please try again.");
    }
  });
