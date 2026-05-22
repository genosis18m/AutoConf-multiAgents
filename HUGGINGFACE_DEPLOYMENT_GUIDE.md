# Hugging Face Spaces Deployment Guide — AutoConf FastAPI Backend

This guide outlines how to host your FastAPI Python backend completely free on Hugging Face Spaces using the existing `Dockerfile` configurations, and how to automate continuous integration/deployment (CI/CD) via GitHub Actions.

---

## 1. Why Hugging Face Spaces?
* **100% Free**: No credit card or active payment plans required.
* **Runs 24/7**: Unlike Render's free tier, Hugging Face Spaces do not go to sleep after inactivity.
* **WebSockets Support**: Fully compatible with FastAPI's live streaming WebSocket connections (`/ws/{session_id}`).
* **High System Resources**: The free tier provides a micro-VM container with **16GB RAM and 2 vCPUs**, which is extremely fast and handles ChromaDB vector calculations easily.

---

## 2. Docker & Port Configuration (Pre-configured)
Hugging Face Spaces requires your container to bind to port **`7860`**. 

Your root [Dockerfile](file:///home/mohit-adoni/MultiConf-eventorganiser/AutoConf-MultiAgent/Dockerfile) contains:
```dockerfile
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```
Because Hugging Face automatically injects `PORT=7860` into the environment, your container **automatically binds to port 7860** without needing any code edits.

---

## 3. Step-by-Step Space Setup

1. **Create an Account**:
   * Go to [huggingface.co](https://huggingface.co/) and sign up.
2. **Create a New Space**:
   * Click your profile avatar (top-right) → **New Space**.
   * **Space Name**: `autoconf-backend` (or a name of your choice).
   * **License**: Choose `apache-2.0` (or leave empty).
   * **SDK**: Select **Docker** 🐳.
   * **Template**: Choose **Blank** (do not select Gradio/Streamlit).
   * **Space Hardware**: Choose **CPU Basic (Free, 16GB RAM, 2 vCPUs)**.
   * **Visibility**: **Public** (required so your Vercel frontend can call the API). *Note: Your codebase will be visible, but your API keys and database credentials will remain completely secure and hidden.*
3. **Configure Environment Secrets**:
   * In your new Space, go to the **Settings** tab.
   * Scroll down to **Variables and Secrets**.
   * Under **Secrets** (do not use Variables), click **New Secret** and add the keys from your `.env` file:
     * `GROQ_API_KEY`
     * `GEMINI_API_KEY`
     * `TAVILY_API_KEY`
     * `SUPABASE_URL`
     * `DATABASE_URL`
     * `DEMO_MODE` = `false`
     * `DEBUG` = `false`

---

## 4. Automated CI/CD Deployment via GitHub Actions (Recommended)

To avoid manually pushing code to both GitHub and Hugging Face, you can set up a GitHub Action to automatically sync your GitHub `main` branch to Hugging Face on every git push.

### Step 1: Get your Hugging Face Access Token
1. Go to your Hugging Face **Settings** → **Access Tokens**.
2. Click **Create new token**.
3. **Name**: `github-sync-token`.
4. **Role**: Select **Write**.
5. Copy the generated token.

### Step 2: Add Token to GitHub Secrets
1. Open your repository on GitHub.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. **Name**: `HF_TOKEN`.
5. **Value**: Paste the Hugging Face Write Token you just copied.

### Step 3: Create GitHub Action Workflow
Create a new file at `.github/workflows/huggingface-sync.yml` in your project with the following content:

```yaml
name: Sync to Hugging Face Spaces

on:
  push:
    branches: [main]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          lfs: true

      - name: Push to Hugging Face
        env:
          HF_TOKEN: ${{ secrets.HF_TOKEN }}
        run: |
          git remote add hf https://mohit-adoni:$HF_TOKEN@huggingface.co/spaces/YOUR_HF_USERNAME/YOUR_SPACE_NAME
          git push --force hf main
```
*(Make sure to replace `YOUR_HF_USERNAME` and `YOUR_SPACE_NAME` with your actual Hugging Face profile username and Space name.)*

Now, every time you push code to GitHub `main`, it will auto-deploy your backend to Hugging Face!

---

## 5. Manual CLI Deployment Alternative

If you do not want to use GitHub Actions, you can push the code manually using Git:

```bash
# Add Hugging Face remote
git remote add hf https://huggingface.co/spaces/YOUR_HF_USERNAME/YOUR_SPACE_NAME

# Push main branch to Hugging Face Space
git push -f hf main
```

---

## 6. Verification & Health Check
1. Once the build finishes and shows **Running**, click the triple dots in the top-right corner of your Space.
2. Select **Embed this Space**.
3. Copy the **Direct URL** displayed (e.g., `https://mohit-adoni-autoconf-backend.hf.space`).
4. Paste the URL into your browser with `/health` appended to the end:
   * `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/health`
5. Expected response:
   ```json
   {
     "status": "healthy",
     "version": "1.0.0"
   }
   ```

---

## 7. Connecting Frontend (Vercel) to Hugging Face
1. Go to your **Vercel Dashboard** → Your Frontend Project.
2. Navigate to **Settings** → **Environment Variables**.
3. Edit the `VITE_BACKEND_URL` variable to point to your new public URL:
   * Value: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space` (do not add a trailing slash).
4. Save the changes.
5. Redeploy your Vercel frontend.
