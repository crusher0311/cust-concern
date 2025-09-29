OpenAI Proxy (minimal)
=======================

This folder contains a minimal OpenAI proxy used by the Customer Concern Assistant extension. It keeps your OpenAI API key server-side and exposes a single /api/openai endpoint that mirrors the OpenAI Chat Completions API.

Environment variables
- OPENAI_API_KEY (required) — your server-side OpenAI API key
- PROXY_SECRET (optional) — a shared secret that clients must send in the x-proxy-key header

Quick start (local)
-------------------
Install deps and run locally:

```powershell
Set-Location server
npm install
$env:OPENAI_API_KEY = 'sk-REPLACE_ME'
$env:PROXY_SECRET = 'a-very-long-secret'
node index.js
```

Vercel deployment (recommended for quick HTTPS)
-----------------------------------------------
1. Create a new project on Vercel and connect this repository (or select the `server` folder as the root if needed).
2. Set environment variables in Vercel project settings: `OPENAI_API_KEY` and optionally `PROXY_SECRET`.
3. Set the build command to empty and the start command to `node index.js` (Vercel will detect Node automatically).
4. Deploy — Vercel will provide an HTTPS URL like `https://your-proxy.vercel.app`.

Usage from the extension
------------------------
In extension options, set `OpenAI Proxy URL` to your deployed URL (for example `https://your-proxy.vercel.app`) and `Proxy Secret` to match `PROXY_SECRET` if you configured one.

Security notes
--------------
- Use HTTPS (Vercel provides this). Never embed `OPENAI_API_KEY` in the client.
- Consider adding stricter rate limiting or token issuance for production to avoid abuse.
Minimal OpenAI proxy for the extension

How it works:
- The proxy exposes POST /api/openai and forwards the body to OpenAI using the server-side `OPENAI_API_KEY` env var.
- Deploy to Vercel/Netlify/Azure Functions or any Node host.

Local usage:
1. cd server
2. npm install
3. set OPENAI_API_KEY=sk-... (PowerShell: $env:OPENAI_API_KEY = 'sk-...')
4. (Optional but recommended) set a proxy secret to require clients to present a token:
	set PROXY_SECRET=some-long-random-string (PowerShell: $env:PROXY_SECRET = 'your-secret')
4. npm start

Vercel deployment:
- Add `OPENAI_API_KEY` as an environment variable in the Vercel project settings.
- Deploy using `vercel` or the Vercel dashboard.

Security notes:
- Keep API keys only on the server. Do not commit them to source control.
- Add rate-limiting and authentication for production use.