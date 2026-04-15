# EventAIL — 7-Agent Autonomous Platform

An AI-driven platform that automates the full lifecycle of organizing multi-day conferences and events. Seven autonomous agents coordinate to handle sponsor outreach, speaker curation, venue selection, ticketing, pricing, GTM, and live operations.

---

## System Overview

### Backend

* FastAPI with 7 autonomous agents (1 orchestrator + 6 specialists)
* WebSocket streaming for real-time updates
* Supabase for persistence
* ChromaDB as vector store

### Frontend

* React 18 + Vite + TypeScript + TailwindCSS
* Zustand for state management
* Recharts for analytics
* WebSocket-based real-time updates

---

## Agent Architecture

| Agent        | Responsibility                                       |
| ------------ | ---------------------------------------------------- |
| Orchestrator | Coordinates agents, routes tasks, aggregates outputs |
| Sponsor      | Identifies and drafts sponsor outreach               |
| Speaker      | Curates speakers based on topic and audience         |
| Venue        | Searches and ranks venues using Google Places        |
| Ticketing    | Manages ticket tiers and allocations                 |
| Pricing      | Handles dynamic pricing and ROI modeling             |
| GTM          | Builds go-to-market strategy and campaigns           |
| Ops          | Manages live event execution and logistics           |

---

## Prerequisites

* Python 3.10+
* Node.js 18+ with npm
* Git
* API keys (refer to API_KEYS.md)

---

## Required API Keys

| Service       | Purpose                     | Free Tier              |
| ------------- | --------------------------- | ---------------------- |
| Groq          | Fast LLM inference          | Yes                    |
| Google Gemini | Secondary reasoning         | Yes                    |
| Tavily        | Web search                  | Yes (1000 calls/month) |
| Google Places | Venue discovery             | Yes (billing required) |
| Supabase      | Database and authentication | Yes                    |

Detailed setup steps are available in API_KEYS.md.

---

## Setup Guide

### 1. Clone Repository

```bash
git clone https://github.com/genosis18m/AutoConf-MultiAgent.git
cd AutoConf-MultiAgent
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

```bash
# Windows (PowerShell)
venv\Scripts\Activate.ps1

# Windows (Git Bash)
source venv/Scripts/activate

# macOS / Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```env
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
TAVILY_API_KEY=your_tavily_key_here
GOOGLE_PLACES_API_KEY=your_google_places_key_here

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here

REDIS_URL=
DEMO_MODE=false
DEBUG=true
```

Run backend server:

```bash
uvicorn main:app --reload --port 8000
```

Endpoints:

* API: [http://localhost:8000](http://localhost:8000)
* Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
* Health: [http://localhost:8000/health](http://localhost:8000/health)

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Access dashboard at: [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
AutoConf-MultiAgent/
├── backend/
│   ├── agents/
│   │   ├── orchestrator.py
│   │   ├── sponsor_agent.py
│   │   ├── speaker_agent.py
│   │   ├── venue_agent.py
│   │   ├── ticketing_agent.py
│   │   ├── pricing_agent.py
│   │   ├── gtm_agent.py
│   │   └── ops_agent.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tools/
│   │   ├── google_places.py
│   │   ├── tavily_search.py
│   │   └── web_scraper.py
│   ├── config.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── .gitignore
├── API_KEYS.md
└── README.md
```

---

## Development Workflow

Run in two terminals:

Terminal A (Backend):

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Terminal B (Frontend):

```bash
cd frontend
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## API Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | /health             | Service health check     |
| GET    | /docs               | Swagger documentation    |
| POST   | /api/conference/... | Conference orchestration |
| WS     | /ws/{session_id}    | Real-time updates        |

---

## Contribution Guide

### Workflow

1. Fork the repository
2. Clone your fork

```bash
git clone https://github.com/YOUR_USERNAME/AutoConf-MultiAgent.git
cd AutoConf-MultiAgent
```

3. Create branch from base_version

```bash
git checkout base_version
git pull origin base_version
git checkout -b feature/your-feature-name
```

4. Implement changes
5. Test end-to-end
6. Commit changes

```bash
git add .
git commit -m "feat: your feature"
```

7. Push branch

```bash
git push origin feature/your-feature-name
```

8. Open Pull Request to base_version

---

## Commit Conventions

* feat: new feature
* fix: bug fix
* refactor: internal improvement
* docs: documentation changes
* chore: tooling/config updates
* test: test-related changes

---

## Code Guidelines

* Python: PEP 8, type hints, Pydantic models
* TypeScript: strict mode, avoid any
* React: functional components and hooks
* Keep commits small and focused

---

## Adding a New Agent

1. Create agent file in backend/agents/
2. Register in orchestrator
3. Add tools if required
4. Update backend health check
5. Add frontend UI if needed

---

## Reporting Issues

Include:

* Steps to reproduce
* Expected vs actual behavior
* Environment details
* Logs (without secrets)

---

## Pull Request Checklist

* Code runs locally
* No secrets committed
* Changes are scoped
* Proper commit messages
* Clear PR description

---

## Security Notes

* Do not commit .env files
* Rotate keys if exposed
* Use DEMO_MODE=true for safe testing

---

## License

Refer to repository for details.

---

## Contact

Use GitHub issues for queries, bugs, or feature requests.
