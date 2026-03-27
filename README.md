# joke-app

A personalised joke generator using JokeAPI (frontend + backend in one Node/Express app).

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run locally:
   ```bash
   npm start
   ```
3. Open in browser:
   - http://localhost:3000

## Azure/Render deploy (recommended)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - joke-app"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

### 2. Create Render web service
- In Render dashboard, choose **New +** → **Web Service**
- Connect repo and select branch `main`
- Set:
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment: `Node`
- Automatic deploys from git pushes

### 3. Check service
- Open generated URL: `https://<your-service>.onrender.com`
- Validate UI and `/joke/json?name=YourName`

## Startup command
- Render uses `npm start` (from `package.json`): `node server.js`.
- app listens on `process.env.PORT`.

## Health endpoint
- `/health` returns 200 ok

## Notes
- `express`, `ejs`, `axios` are backend dependencies.
- No DB or secret config is needed.
