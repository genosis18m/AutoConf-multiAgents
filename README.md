# 🎯 AutoConf — AI-Powered Conference Planner

<div align="center">

**A multi-agent autonomous platform that plans an entire conference in minutes.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://auto-conf-multi-agents.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)

</div>

---

## ✨ What is AutoConf?

AutoConf is a fully autonomous conference planning system powered by **7 specialized AI agents** running in parallel. You input your event details — city, audience size, category, budget — and the agents simultaneously research, analyze, and produce a complete, production-ready conference plan.

> **⚡ Live Demo Available** — No API keys needed. Click the Delhi or New York demo buttons on the homepage to see a full agent simulation with real pre-researched data.

---

## 🤖 The 7 Agents

| Agent | Role | Tools Used |
|---|---|---|
| **💰 Sponsor Research** | Finds and scores 15+ potential sponsors with outreach emails | Tavily, Groq |
| **🎤 Speaker Curation** | Discovers top speakers, maps them to agenda slots | Tavily, Groq |
| **🎫 Ticketing Strategy** | Designs pricing tiers, selects best platform, estimates conversion | Groq |
| **🏛️ Venue Selection** | Finds and compares venues with capacity, cost, and ratings | Google Places API, Groq |
| **📊 Pricing & Footfall** | Forecasts attendance, models revenue scenarios (low/expected/high) | Groq, Gemini |
| **📣 GTM & Comms** | Builds go-to-market strategy, channel playbooks, message templates | Tavily, Groq |
| **⚙️ Ops & Logistics** | Creates run-of-show, vendor checklist, contingency plans | Groq |

All agents run **concurrently** via an async orchestrator, with real-time progress streaming over **WebSockets**.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        FRONTEND                            │
│   React + Vite · TypeScript · Tailwind · Zustand           │
│                                                            │
│  InputPage → DashboardPage (WS stream) → ResultsPage       │
│     ↓ (demo mode: local bundle, no backend needed)         │
└────────────────────┬───────────────────────────────────────┘
                     │ REST + WebSocket
┌────────────────────▼───────────────────────────────────────┐
│                        BACKEND                             │
│   FastAPI · Python · AsyncIO                               │
│                                                            │
│  /api/generate  →  Orchestrator  →  7 Agents (parallel)    │
│  /ws/{id}       →  WebSocket Manager (live updates)        │
│  /api/results   →  Supabase / in-memory                    │
│  /api/export    →  ReportLab PDF generator                 │
│  /api/demo      →  Pre-cached JSON (no API keys)           │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│                      EXTERNAL SERVICES                     │
│  Groq (LLM) · Gemini (fallback) · Tavily (search)          │
│  Google Places API · Supabase (DB) · ChromaDB (cache)      │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- API keys (see [Environment Setup](#environment-setup))

### 1. Clone the repo

```bash
git clone https://github.com/genosis18m/AutoConf-multiAgents.git
cd AutoConf-multiAgents
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Fill in your API keys
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
# Create .env.local and set:
# VITE_BACKEND_URL=http://localhost:8000
npm run dev                       # Starts on http://localhost:5173
```

---

## 🔑 Environment Setup

Copy `backend/.env.example` to `backend/.env` and fill in your keys:

```env
# LLM Providers
GROQ_API_KEY=gsk_xxxx              # console.groq.com — FREE
GEMINI_API_KEY=AIzaxxxx            # aistudio.google.com — FREE (fallback LLM)

# Search & Data
TAVILY_API_KEY=tvly-xxxx           # app.tavily.com — FREE (1000 req/month)
GOOGLE_PLACES_API_KEY=AIzaxxxx     # console.cloud.google.com — $200 free credit

# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGxxxx

# Optional
REDIS_URL=redis://...              # upstash.com — FREE tier
```

**Frontend** (`frontend/.env.local`):

```env
VITE_BACKEND_URL=http://localhost:8000
```

> All API services listed above have **free tiers** sufficient for personal projects and demos.

---

## 🎭 Demo Mode

AutoConf includes a built-in demo mode — **no API keys needed to see it work.**

Click **🇮🇳 AI Summit Delhi** or **🇺🇸 SaaS Growth NY** on the homepage.

- The 7 agents animate one-by-one over ~7 seconds in the Dashboard
- Real pre-researched data for both cities loads into the Results view
- Export to PDF works in demo mode
- **All demo data is bundled in the frontend** — zero backend calls required

This makes the live Vercel deployment fully showcaseable even without a live backend.

---

## 📁 Project Structure

```
AutoConf-multiAgents/
├── backend/
│   ├── agents/
│   │   ├── orchestrator.py        # Runs all 7 agents concurrently
│   │   ├── sponsor_agent.py       # Sponsor research & outreach emails
│   │   ├── speaker_agent.py       # Speaker discovery & agenda mapping
│   │   ├── ticketing_agent.py     # Pricing tiers & platform selection
│   │   ├── venue_agent.py         # Google Places venue comparison
│   │   ├── pricing_agent.py       # Revenue forecasting & attendance
│   │   ├── gtm_agent.py           # Go-to-market strategy
│   │   ├── ops_agent.py           # Run-of-show & vendor checklist
│   │   └── base_llm.py            # Shared LLM client (Groq + Gemini)
│   ├── data/
│   │   └── demo_data.py           # Pre-cached demo results (Delhi + NY)
│   ├── routes/
│   │   └── conference.py          # FastAPI routes + PDF export
│   ├── services/
│   │   ├── websocket_manager.py   # Real-time streaming to frontend
│   │   ├── supabase_client.py     # Persistent result storage
│   │   ├── cache_service.py       # Response caching layer
│   │   └── chromadb_client.py     # Vector search (optional)
│   ├── main.py                    # FastAPI app + WebSocket endpoint
│   ├── config.py                  # Settings via pydantic-settings
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # Header, Sidebar, MobileNav (responsive)
│   │   │   ├── dashboard/         # AgentStatusGrid, ProgressTimeline, LiveLogs
│   │   │   ├── results/           # Result tabs, ExportButton (PDF)
│   │   │   ├── input/             # ConferenceForm
│   │   │   └── shared/            # GlowButton, SparkleButton, CreditCardWidget
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts    # Real-time agent updates
│   │   │   ├── useAgentStatus.ts  # Polling fallback
│   │   │   └── useDemoSimulation.ts  # Simulates agents for demo mode
│   │   ├── lib/
│   │   │   ├── api.ts             # All API calls
│   │   │   ├── demoData.ts        # Bundled demo data (frontend-only)
│   │   │   └── constants.ts
│   │   ├── pages/
│   │   │   ├── InputPage.tsx      # Event input form + demo buttons
│   │   │   ├── DashboardPage.tsx  # Live agent monitoring
│   │   │   └── ResultsPage.tsx    # Tabbed results + PDF export
│   │   └── store/
│   │       └── useConferenceStore.ts  # Zustand global state
│   └── package.json
│
├── vercel.json                    # Vercel frontend deployment config
└── HUGGINGFACE_DEPLOYMENT_GUIDE.md
```

---

## 🖥️ Features

### Real-Time Agent Dashboard
- Live progress bars per agent (queued → running → completed)
- WebSocket streaming with polling fallback
- Phase timeline (Research → Analysis → Strategy → Operations)
- Live log console showing agent thoughts

### Tabbed Results View
- **Sponsors** — ranked sponsor cards with relevance scores, budgets, outreach emails
- **Speakers** — bio cards with influence scores, suggested agenda slots
- **Ticketing** — pricing tiers, platform recommendation, conversion estimates
- **Venues** — venue comparison cards with ratings, pros/cons
- **Pricing** — attendance forecast chart, revenue scenario (low/expected/high)
- **GTM** — channel strategies, message templates, target communities
- **Ops** — run-of-show timeline, vendor checklist, contingency plans

### PDF Export
- Downloads as `ai_conference_plan.pdf`
- Colour-coded sections per agent (indigo, purple, teal, etc.)
- Tables for structured data (sponsors, venues, run-of-show)
- A4 format with cover header, footer, alternating row styles

### Mobile Responsive
- Sidebar hidden on mobile → replaced with glassmorphism bottom tab bar
- Dashboard stat cards scroll horizontally
- Results header stacks vertically
- Safe-area padding for iPhone notch support

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Zustand, Styled Components |
| **Backend** | FastAPI, Python 3.11, AsyncIO, WebSockets, Pydantic |
| **AI / LLM** | Groq (LLaMA 3), Google Gemini (fallback) |
| **Search** | Tavily AI Search API, Google Places API |
| **Database** | Supabase (PostgreSQL), ChromaDB (vector cache) |
| **PDF** | ReportLab |
| **Deployment** | Vercel (frontend), Hugging Face Spaces (backend) |

---

## 🌐 Deployment

### Frontend — Vercel (Free)

1. Push to `main` branch
2. Import repo in [vercel.com](https://vercel.com)
3. Set **Root Directory** → `frontend`
4. Add env var: `VITE_BACKEND_URL=<your-backend-url>`
5. Deploy ✅

### Backend — Hugging Face Spaces (Free)

See [`HUGGINGFACE_DEPLOYMENT_GUIDE.md`](./HUGGINGFACE_DEPLOYMENT_GUIDE.md) for the full guide including:
- `Dockerfile` setup for the FastAPI backend
- GitHub Actions workflow to auto-sync on push
- Environment secrets configuration

---

## 📸 Screenshots

> Demo the live version at [auto-conf-multi-agents.vercel.app](https://auto-conf-multi-agents.vercel.app)

| Page | Description |
|---|---|
| **Input Page** | Clean dark form with demo mode buttons for instant preview |
| **Dashboard** | Live agent grid — watch 7 agents complete in real-time |
| **Results** | Tabbed output with sponsor cards, venue comparisons, revenue charts |
| **PDF Export** | Downloadable as `ai_conference_plan.pdf` with colour-coded sections |

---

## 🧑‍💻 About

Built by **Mohit Adoni** as a portfolio project demonstrating:

- Multi-agent AI orchestration with real LLM API calls
- Full-stack TypeScript + Python development
- Real-time streaming with WebSockets
- Professional UI/UX design with premium aesthetics
- Production deployment on Vercel + Hugging Face

---

## 📄 License

MIT — free to use, fork, and build upon.

---

<div align="center">
Made with ☕ and 7 AI agents.
</div>
