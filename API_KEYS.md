# How to Acquire API Keys

This guide walks through obtaining every API key needed to run ConferenceAI. All services listed have a free tier sufficient for development and demos.

Once you have your keys, paste them into `backend/.env` using the variable names shown in each section.

---

## 1. Groq API Key

**Used for:** Fast LLM inference (primary LLM for most agents).
**Free tier:** Yes — generous rate limits for development.
**Env variable:** `GROQ_API_KEY`

### Steps

1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up with Google, GitHub, or email
3. Verify your email if prompted
4. Once logged in, click **API Keys** in the left sidebar
5. Click **Create API Key**
6. Give it a name (e.g., `conferenceai-dev`) and click **Submit**
7. **Copy the key immediately** — you won't be able to see it again
8. Paste it into `backend/.env`:
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
   ```

---

## 2. Google Gemini API Key

**Used for:** Secondary LLM for reasoning and long-context tasks.
**Free tier:** Yes — free with generous quotas for Gemini 1.5 Flash.
**Env variable:** `GEMINI_API_KEY`

### Steps

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Accept the terms of service
4. Click **Create API key**
5. Select **Create API key in new project** (or pick an existing Google Cloud project)
6. **Copy the generated key**
7. Paste it into `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxx
   ```

---

## 3. Tavily Search API Key

**Used for:** Web search tool for research tasks (sponsor research, speaker vetting, venue discovery).
**Free tier:** Yes — 1,000 API calls per month.
**Env variable:** `TAVILY_API_KEY`

### Steps

1. Go to [https://tavily.com/](https://tavily.com/)
2. Click **Sign Up** (top right)
3. Register with Google or email
4. After login, you'll land on the dashboard
5. Your API key is displayed under **API Keys** — click **Copy**
6. Paste it into `backend/.env`:
   ```env
   TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxxxxxx
   ```

---

## 4. Google Places API Key

**Used for:** Venue discovery, location ranking, geo-search.
**Free tier:** Yes — $200 monthly credit (requires a billing account, but charges are waived under the credit).
**Env variable:** `GOOGLE_PLACES_API_KEY`

### Steps

1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project (top bar → **New Project**) or select an existing one
4. In the left sidebar, navigate to **APIs & Services → Library**
5. Search for **Places API (New)** and click it
6. Click **Enable**
7. You may be prompted to set up billing — complete this step (a credit card is required, but the $200/month free credit covers normal development use)
8. In the left sidebar, go to **APIs & Services → Credentials**
9. Click **Create Credentials → API key**
10. **Copy the key**
11. (Recommended) Click **Restrict key** and limit it to the **Places API** to avoid accidental misuse
12. Paste it into `backend/.env`:
    ```env
    GOOGLE_PLACES_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxx
    ```

> **Tip:** Google sometimes takes a few minutes to propagate a new key. If you get a "key not valid" error immediately after creation, wait 5 minutes and retry.

---

## 5. Supabase URL + Key

**Used for:** Primary database for conferences, agents runs, users, and session state.
**Free tier:** Yes — includes 500 MB database and 50,000 monthly active users.
**Env variables:** `SUPABASE_URL`, `SUPABASE_KEY`

### Steps

1. Go to [https://supabase.com/](https://supabase.com/)
2. Click **Start your project** and sign in with GitHub (or email)
3. Click **New Project**
4. Fill in:
   - **Name:** `conferenceai` (or your choice)
   - **Database password:** generate a strong one and save it in a password manager
   - **Region:** pick the one closest to you
   - **Pricing plan:** Free
5. Click **Create new project** and wait ~2 minutes for provisioning
6. Once ready, go to **Project Settings** (gear icon, bottom left) → **API**
7. Copy the following two values:
   - **Project URL** → goes into `SUPABASE_URL`
   - **anon public** key → goes into `SUPABASE_KEY`
8. Paste into `backend/.env`:
   ```env
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxx
   ```

> **Note:** Use the **anon public** key for client-side-safe access. Do not use the `service_role` key unless you understand its implications — it bypasses Row Level Security.

### (Optional) Database schema

If the project ships with a SQL schema file, run it in **Supabase Dashboard → SQL Editor**. Otherwise the tables will be created on first run.

---

## Final `.env` Example

After collecting all keys, your `backend/.env` should look like this:

```env
# LLM
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxx

# Search & Data
TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxxxxxx
GOOGLE_PLACES_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxx

# Database
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxx

# Optional
REDIS_URL=
DEMO_MODE=false
DEBUG=true
```

---

## Security Checklist

- [ ] `backend/.env` is listed in `.gitignore` (it already is — verify)
- [ ] You have **never** committed a real key to git history
- [ ] Each key is stored only in `.env` and a password manager — not in chat logs, screenshots, or shared docs
- [ ] If a key is exposed, **rotate it immediately** on the provider's dashboard
- [ ] Restrict keys where possible (Google Places → restrict by API; Supabase → use anon key, not service_role)

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `401 Unauthorized` from Groq | Wrong or expired key | Regenerate key in Groq console |
| `API key not valid` from Google | Key not propagated yet, or billing not enabled | Wait 5 min, confirm billing enabled |
| `PGRST301` from Supabase | Wrong project URL or key | Re-copy from Project Settings → API |
| Tavily `403` | Free tier exhausted | Check dashboard usage, upgrade or wait for reset |
| Gemini `429` | Rate limit hit | Switch to a less aggressive model or add delay |

## Cost Management

All services listed have **free tiers** that are sufficient for development. To avoid surprise charges:

1. **Set usage alerts** in Google Cloud Console (for Places API)
2. **Monitor Groq usage** in the Groq dashboard
3. **Enable `DEMO_MODE=true`** in `.env` to stub expensive calls during frontend work
4. **Rotate keys** if you suspect a leak — never hesitate
