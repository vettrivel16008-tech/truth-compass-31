export type Verdict =
  | "Likely Reliable"
  | "Needs Verification"
  | "Likely Misleading / Fake";

export type Stance = "supports" | "contradicts" | "context";

export interface SourceRef {
  name: string;
  title: string;
  date: string | null;
  url: string;
  stance: Stance;
  note: string;
}

export interface ScoreFactor {
  label: string;
  value: string;
  note: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  score: number;
  summary: string;
  claims: string[];
  warningSignals: string[];
  evidence: string[];
  sources: SourceRef[];
  recommendation: string;
  factors: ScoreFactor[];
  verificationStatus: "verified_sources" | "no_evidence_found" | "unavailable";
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  input: string;
  result: AnalysisResult;
}

export function verdictFromScore(score: number): Verdict {
  if (score >= 80) return "Likely Reliable";
  if (score >= 50) return "Needs Verification";
  return "Likely Misleading / Fake";
}

export const DISCLAIMER =
  "Veracity Sight provides AI-assisted credibility analysis. It does not guarantee that a claim is true or false. Always verify important information using reliable primary and independent sources.";
