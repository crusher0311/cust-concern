Minimal OpenAI proxy for the extension

How it works:
- The proxy exposes POST /api/openai and forwards the body to OpenAI using the server-side `OPENAI_API_KEY` env var.
- Deploy to Vercel/Netlify/Azure Functions or any Node host.

Local usage:
1. cd server
2. npm install
3. set OPENAI_API_KEY=sk-... (PowerShell: $env:OPENAI_API_KEY = 'sk-...')
4. npm start

Vercel deployment:
- Add `OPENAI_API_KEY` as an environment variable in the Vercel project settings.
- Deploy using `vercel` or the Vercel dashboard.

Security notes:
- Keep API keys only on the server. Do not commit them to source control.
- Add rate-limiting and authentication for production use.