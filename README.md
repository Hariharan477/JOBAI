# JOBAI

**Turn your skills into your next opportunity.**

Explainable job–skill matching, gap analytics, career path guidance, and what-if simulation. Deterministic scoring where accuracy matters; AI only where explanation and strategy help.

---

## Why JOBAI

Most "AI job tools" either:

- hallucinate skill matches, or  
- dump keyword overlap with no reasoning.

JOBAI does neither.

| Capability | Approach |
|---|---|
| **Match score** | Deterministic skill–requirement overlap + level weighting |
| **Evidence** | Verified / supported / claimed status per skill |
| **Explainability** | AI-generated breakdown of *why* a role fits (or doesn't) |
| **Gap analysis** | Ranked missing skills with impact on score |
| **What-if** | Simulate learning a skill and see score deltas |
| **Career path** | Suggested next roles from current profile |

No black-box ranking. No generic "you're a great fit!" copy.

---

## Features

- **Overview dashboard** — profile strength, top matches, priority gaps
- **Profile** — skills with evidence, verification status, timeline
- **Opportunities** — ranked roles with match score and skill coverage
- **Career Path** — progression suggestions and upskill priorities
- **What-If Simulator** — add a skill hypothetically and re-score jobs
- **AI Strategist** — conversational career advice grounded in *your* data
- **Light / dark theme** — system-aware, persisted preference

---

## Design

Color system follows a simple rule set:

- **Surfaces** — cool slate neutrals (low chroma) so content stays primary  
- **Accent** — single high-chroma blue for actions and focus  
- **Semantic** — teal for positive / success, amber for caution, red for error  
- **Contrast** — WCAG AA targets for text and interactive states  

Typography: Plus Jakarta Sans (UI) + JetBrains Mono (scores, code). Spacing and radius are consistent; shadows are soft and intentional. No decorative noise.

---

## Stack

- **Frontend** — React 19, TypeScript, Tailwind CSS 4, Lucide, Motion  
- **Backend** — Express + Vite middleware  
- **AI** — Google Gemini (with multi-model fallback) for explanations & strategist  
- **Matching** — pure TypeScript deterministic engine (`src/utils/matcher.ts`)

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/Hariharan477/JOBAI.git
cd JOBAI

# 2. Install
npm install
# or: bun install

# 3. Environment
cp .env.example .env
# Add GEMINI_API_KEY=... if you want AI explanations / strategist

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without a Gemini key the app still runs: matching, gaps, and what-if are fully client-side and deterministic. AI endpoints return structured fallbacks.

---

## Environment

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | No | Enables match explanations and AI Strategist |

See `.env.example`.

---

## Project structure

```
src/
  App.tsx                 # Shell, routing, theme, profile state
  components/             # Screens + modals
  data/seedData.ts        # Demo candidate + job catalog
  utils/matcher.ts        # Deterministic match + gap engine
  types.ts                # Shared domain types
server.ts                 # Express + Gemini API routes
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server (Vite + Express) |
| `npm run build` | Production client + server bundle |
| `npm start` | Run production server |
| `npm run lint` | Typecheck |

---

## Demo profile

Ships with a seeded candidate (Alex Morgan) and a curated set of roles so you can explore matching, evidence, and simulation immediately. Use **Reset demo** in the nav to restore the original state. Profile edits persist in `localStorage`.

---

## License

MIT

---

Built for clarity. No AI slop.
