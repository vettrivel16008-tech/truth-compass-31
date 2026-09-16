# Truth Compass

I have an existing website called Veracity Sight for my AI Immersion project on AI-Based Fake News Detection.

The current website looks good visually, but the actual fake-news detection functionality is not working properly. I want you to inspect the entire existing project, identify what is currently fake/demo/placeholder functionality, and rebuild the application so the main detection workflow actually works.

Do NOT simply redesign the landing page. The priority is a working fake-news detection application.

1. MAIN GOAL

Build a working web application where a user can enter:

A news headline

A complete news article

A short news claim

and click:

"Check News"

The application must analyze the submitted content and return a clear result.

Possible results:

Likely Reliable

Needs Verification

Likely Misleading / Fake

Do not claim that the system can know with 100% certainty that something is fake.

The result should always explain that this is an AI-assisted credibility assessment and that users should verify important information with trusted sources.

2. IMPORTANT: REMOVE FAKE DEMO RESULTS

The current application appears to contain hard-coded/demo analysis.

Remove all hard-coded fake results such as:

fixed 93% credibility

fixed "Verified"

fixed "High Source"

fixed "Neutral"

fixed "Matched"

fake analysis results that are unrelated to the submitted text

The result must depend on the user's actual input.

If the backend/API cannot verify something, say:

"Unable to verify this claim with the available sources."

Do NOT invent evidence, sources, article names, URLs, journalists, organizations, or verification results.

3. INPUT PAGE

Create a clean detection interface.

Heading:

Check a News Story

Subheading:

Paste a headline, claim, or article text to evaluate its credibility.

Large textarea:

Placeholder:

Paste news headline or article here...

Buttons:

Check News

Clear

Add character counter.

Validate empty input.

If input is too short, display:

"Please enter a meaningful headline or article."

While analysis is running, show:

Analyzing claim...

with a loading animation.

Do not make the user wait indefinitely.

Add proper error handling and timeout handling.

4. REAL ANALYSIS PIPELINE

Create a proper backend/API architecture.

The frontend must NOT contain secret API keys.

Use environment variables for all API keys.

Use a server-side function/API endpoint for analysis.

Create a clear pipeline:

INPUT
↓
Text cleaning
↓
Claim extraction
↓
AI language analysis
↓
Source/evidence verification
↓
Credibility scoring
↓
Human-readable explanation
↓
Final result

5. AI ANALYSIS

Use an appropriate LLM/API through a secure server-side endpoint if an API key is configured.

The AI should analyze:

Claim

Factual assertions

Emotional/manipulative language

Sensational wording

Unsupported certainty

Missing context

Contradictory statements

Possible misleading framing

Named people, organizations, places, dates and events

Whether the claim requires external verification

Return structured JSON rather than uncontrolled text.

Use a schema similar to:

{
"verdict": "Likely Reliable | Needs Verification | Likely Misleading/Fake",
"confidence": 0,
"summary": "",
"claims": [],
"warningSignals": [],
"evidence": [],
"sources": [],
"recommendation": ""
}

Validate the JSON before displaying it.

6. SOURCE VERIFICATION

This is extremely important.

Do NOT pretend that AI language analysis alone proves that a news story is true or false.

If web/source verification is available, search for supporting or contradicting evidence from credible sources.

Prefer:

Government websites

Official organizations

Universities

Established news organizations

Official statements

Primary sources

Scientific organizations

For each source display:

Source name

Article/title

Date if available

URL

Whether it supports, contradicts, or provides context

Do not fabricate sources.

If no reliable evidence is found, clearly show:

"No reliable supporting evidence was found in the available sources."

7. CREDIBILITY SCORE

Generate a transparent score from 0–100.

Do NOT make the score look scientifically exact.

Use it as an AI-assisted credibility indicator.

Display:

Credibility Score

XX/100

Also show:

Source evidence

Language signals

Claim consistency

Context

Verification status

Use this general interpretation:

80–100:
Likely Reliable

50–79:
Needs Verification

0–49:
Likely Misleading / Fake

Important:

The score must NOT be randomly generated.

It must be calculated from the actual analysis signals.

8. RESULT CARD

After analysis, show a professional result card.

Example:

Verdict

Needs Verification

Credibility Score

64/100

Why?

The article contains a strong factual claim, but the available evidence is insufficient to independently confirm it.

Warning Signals

No primary source provided

Strong emotional wording

Important context is missing

Evidence

Show actual evidence returned by the verification process.

Sources Checked

Show real sources only.

Recommendation

Check the original source and compare the claim with at least two reliable sources before sharing.

9. DO NOT CALL SOMETHING FAKE JUST BECAUSE OF WRITING STYLE

This is very important.

Do not classify news as fake merely because it contains:

capital letters

emotional words

unusual grammar

short sentences

clickbait-style wording

These can be warning signals but are NOT proof of misinformation.

The system should distinguish between:

Language signals

and

Factual evidence

Evidence should have more importance than writing style.

10. TEST MODE

Add a section called:

Try a Sample

Provide several clearly labeled test examples.

Example categories:

Reliable claim

Misleading claim

Unverified claim

Make it obvious that these are demonstration examples.

When a sample is selected, put it into the input box so the user can click Check News.

Do not hard-code the final analysis result.

The sample must go through the same analysis pipeline as normal user input.

11. ANALYSIS HISTORY

Add a simple local history section.

Store recent analyses in browser localStorage.

Each history item should show:

Short headline

Verdict

Score

Date/time

Allow:

View

and

Delete History

Do not store sensitive personal information.

12. RESPONSIVE DESIGN

Make the complete website responsive.

It must work properly on:

Desktop

Laptop

Tablet

Mobile

Use a clean modern AI dashboard style.

Keep the existing visual identity where appropriate, but prioritize usability.

13. LANDING PAGE

Keep the landing page but correct misleading content.

Current placeholder statistics such as:

0% Model accuracy
0M+ Articles analyzed
0+ Languages supported
0s Average analysis

must NOT be displayed.

Replace them with honest project information.

For example:

AI-Assisted Analysis
Evidence-Based Verification
Transparent Results
Human Review Recommended

Do not invent performance statistics.

14. HOW IT WORKS

Change the current generic section into:

01 — Submit

Paste a headline, claim, or article.

02 — Analyze

AI identifies claims, language signals and important entities.

03 — Verify

The system checks available credible sources.

04 — Compare

Supporting and contradicting evidence is compared.

05 — Explain

The application provides a transparent credibility assessment.

15. TECHNOLOGY SECTION

Create a realistic project architecture section.

Show:

Frontend
→ React / existing frontend

Backend
→ Secure server/API functions

AI
→ LLM-based claim and language analysis

Verification
→ Trusted-source/web verification

Storage
→ Browser localStorage for analysis history

Do NOT claim that BERT, LSTM, Random Forest, SVM, social network analysis, or deepfake detection is being used unless these technologies actually exist and are implemented in the project.

The current website claims several technologies that may not actually be implemented. Remove misleading technology claims.

16. ERROR HANDLING

Handle:

Empty input

Very short input

API failure

Invalid API response

Network failure

Timeout

No sources found

Rate limits

Missing API key

Display user-friendly messages.

Never show raw backend errors to normal users.

17. SECURITY

Never expose:

API keys

Secret tokens

Backend credentials

in frontend JavaScript.

Use environment variables and server-side functions.

Validate and sanitize user input.

Do not allow arbitrary user input to execute code.

18. IMPORTANT DISCLAIMER

Add a visible but professional disclaimer:

"Veracity Sight provides AI-assisted credibility analysis. It does not guarantee that a claim is true or false. Always verify important information using reliable primary and independent sources."

This should appear near the result.

19. NAVIGATION

Make sure all navigation buttons actually work.

Required pages/sections:

Home

Check News

How It Works

Features

History

About

No dead buttons.

No buttons that only look clickable but do nothing.

20. ABOUT PAGE

Explain the project as an AI Immersion / educational project.

Include:

Problem

False and misleading information spreads rapidly online.

Solution

Veracity Sight provides AI-assisted analysis of news claims and helps users identify credibility signals and supporting evidence.

Objective

Help users pause, verify and understand information before sharing it.

Do not make unrealistic claims such as "eliminates fake news."

21. FINAL TESTING

After implementing everything, test the complete workflow.

Test:

Empty input

Short input

Normal headline

Full article

Clearly unverified claim

API failure

No evidence found

Mobile layout

Desktop layout

History save/delete

Clear button

Loading state

Error state

Source links

Navigation

Fix all console errors and broken buttons.

Make sure there are no placeholder values, fake statistics, fake sources, fake verification results, or unfinished sections.

22. MOST IMPORTANT REQUIREMENT

Do not just make the website LOOK like an AI fake-news detector.

Make the actual user journey work:

USER ENTERS NEWS
↓
CLICK CHECK NEWS
↓
BACKEND RECEIVES NEWS
↓
AI ANALYZES CLAIM
↓
AVAILABLE SOURCES ARE CHECKED
↓
EVIDENCE IS COMPARED
↓
CREDIBILITY SCORE IS CALCULATED
↓
VERDICT IS DISPLAYED
↓
REASONS + EVIDENCE + SOURCES ARE SHOWN

If a real external verification API or AI API is required and no API key is currently configured, build the integration properly and clearly indicate which environment variable must be added. Do not replace missing functionality with fake results.

Finally, inspect the existing codebase before making changes and preserve working components where possible. Refactor broken components instead of unnecessarily rebuilding everything.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://truth-compass-31.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8bd1a457-1643-4e77-ac55-8c1b2c7f19f3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
