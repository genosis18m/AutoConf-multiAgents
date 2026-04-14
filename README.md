# ConferenceAI — AI-Powered Conference Organizer

An AI-driven platform that automates the full lifecycle of organizing multi-day conferences and events. Seven autonomous agents coordinate to handle sponsor outreach, speaker curation, venue selection, ticketing, pricing, GTM, and live operations.

## Architecture

- **Backend** — FastAPI + 7 autonomous agents (orchestrator + 6 specialists), WebSocket streaming, Supabase persistence, ChromaDB vector store
- **Frontend** — React 18 + Vite + TypeScript + TailwindCSS, Zustand state, Recharts analytics, real-time updates via WebSocket

### The 7 Agents

| Agent | Responsibility |
|---|---|
| Orchestrator | Coordinates the other six, routes tasks, aggregates results |
| Sponsor | Identifies and drafts outreach to prospective sponsors |
| Speaker | Curates speaker shortlists by topic, industry, and audience fit |
| Venue | Searches venues via Google Places, ranks by capacity/location |
| Ticketing | Configures tiers, holds, allocations |
| Pricing | Dynamic pricing strategy, discount windows, ROI modeling |
| GTM | Go-to-market plan, channels, content calendar |
| Ops | Live run-of-show, on-site logistics, vendor coordination |

## Prerequisites

- **Python** 3.10+
- **Node.js** 18+ and npm
- **Git**
- API keys (see [API_KEYS.md](API_KEYS.md) for how to acquire each)

## Required API Keys

Before running the project, you will need:

| Service | Used for | Free tier? |
|---|---|---|
| **Groq** | Fast LLM inference for agents | Yes |
| **Google Gemini** | Secondary LLM + reasoning | Yes |
| **Tavily** | Web search for research tasks | Yes (1000 calls/mo) |
| **Google Places** | Venue discovery and ranking | Yes (with billing enabled) |
| **Supabase** | Database + auth | Yes |

Full step-by-step instructions for obtaining every key live in [API_KEYS.md](API_KEYS.md).

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/genosis18m/AutoConf-MultiAgent.git
cd AutoConf-MultiAgent
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Activate venv
# Windows (PowerShell):
venv\Scripts\Activate.ps1
# Windows (Git Bash):
source venv/Scripts/activate
# macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env` with your API keys:

```env
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
TAVILY_API_KEY=your_tavily_key_here
GOOGLE_PLACES_API_KEY=your_google_places_key_here

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

# Optional
REDIS_URL=
DEMO_MODE=false
DEBUG=true
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`. Health check at `http://localhost:8000/health`.

### 3. Frontend setup

In a **separate terminal**:

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be live at `http://localhost:5173`.

## Project Structure

```
AutoConf-MultiAgent/
├── backend/
│   ├── agents/              # 7 autonomous agents
│   │   ├── orchestrator.py
│   │   ├── sponsor_agent.py
│   │   ├── speaker_agent.py
│   │   ├── venue_agent.py
│   │   ├── ticketing_agent.py
│   │   ├── pricing_agent.py
│   │   ├── gtm_agent.py
│   │   └── ops_agent.py
│   ├── models/              # Pydantic schemas
│   ├── routes/              # FastAPI routes + WebSocket handlers
│   ├── services/            # Supabase, ChromaDB, cache, ws manager
│   ├── tools/               # External tool integrations
│   │   ├── google_places.py
│   │   ├── tavily_search.py
│   │   └── web_scraper.py
│   ├── config.py            # Settings loader (reads .env)
│   ├── main.py              # FastAPI app entry point
│   └── requirements.txt
├── frontend/
│   ├── src/                 # React components + Zustand stores
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── .gitignore
├── API_KEYS.md              # How to acquire every API key
└── README.md
```

## Running in Development

You need **two terminals**:

1. **Terminal A** — backend: `cd backend && uvicorn main:app --reload --port 8000`
2. **Terminal B** — frontend: `cd frontend && npm run dev`

Open `http://localhost:5173` in your browser.

## Common Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/docs` | Interactive Swagger UI |
| POST | `/api/conference/...` | Conference orchestration endpoints |
| WS | `/ws/{session_id}` | Real-time agent progress stream |

## Contributing

Contributions are welcome. Please follow the workflow below.

### Workflow

1. **Fork** the repo on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/AutoConf-MultiAgent.git
   cd AutoConf-MultiAgent
   ```
3. **Create a feature branch** off `base_version`
   ```bash
   git checkout base_version
   git pull origin base_version
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**, following the conventions below
5. **Test locally** — run both backend and frontend, verify the feature works end-to-end
6. **Commit** with a descriptive message
   ```bash
   git add .
   git commit -m "feat: add sponsor tier auto-ranking"
   ```
7. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** against `base_version` on the upstream repo

### Commit Message Conventions

Use conventional commit prefixes:

- `feat:` — new feature
- `fix:` — bug fix
- `refactor:` — internal change, no behavior difference
- `docs:` — documentation only
- `chore:` — tooling, deps, config
- `test:` — adding or updating tests

### Code Style

- **Python** — follow PEP 8, use type hints, prefer Pydantic models for data contracts
- **TypeScript** — strict mode enabled, no `any` unless justified
- **React** — functional components + hooks, keep components focused
- **Commits** — one logical change per commit; keep them small and reviewable

### Adding a New Agent

1. Create `backend/agents/your_agent.py` following the pattern in existing agents
2. Register it in `backend/agents/orchestrator.py`
3. Add any new tools under `backend/tools/`
4. Update the agent count in `backend/main.py` health check and the table in this README
5. Add a corresponding UI panel in `frontend/src/` if user-facing

### Reporting Issues

Open an issue on GitHub with:
- Clear reproduction steps
- Expected vs actual behavior
- Environment (OS, Python version, Node version)
- Relevant logs (redact API keys!)

### Pull Request Checklist

- [ ] Code runs locally (both backend and frontend)
- [ ] No API keys or secrets committed
- [ ] Changes are scoped (no unrelated edits)
- [ ] Commit messages follow conventions
- [ ] PR description explains the "why", not just the "what"

## Security

- **Never commit `.env` files.** They are gitignored — keep it that way.
- If you accidentally push a key, rotate it immediately on the provider's dashboard.
- Use `DEMO_MODE=true` in `.env` for safe testing without consuming paid API credits.

## License

See repository for license details.

## Contact

Open an issue on GitHub for questions, bug reports, or feature requests.
