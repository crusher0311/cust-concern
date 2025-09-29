OpenAI Proxy Setup (for Customer Concern Assistant)

This repository includes a minimal Node Express proxy under `server/` that forwards requests to OpenAI using a server-side API key. Using a server-side proxy keeps the OpenAI API key secret and is the recommended practice.

Quick start (local):
1. Open a terminal and change directory to `server`:
   cd server
2. Install dependencies:
   npm install
3. Set your OpenAI API key as an environment variable:
   # PowerShell
   $env:OPENAI_API_KEY = 'sk-...'
4. Start the server:
   npm start
5. The proxy will run at http://localhost:3000 by default. Example endpoint:
   POST http://localhost:3000/api/openai
   Body: { model: 'gpt-3.5-turbo', messages: [...], max_tokens: 1000 }

Deploying:
- Vercel: Create a new project that points to the `server` folder and add `OPENAI_API_KEY` as an environment variable.
- Netlify / Azure Functions: Use your platform's method to deploy Node functions and supply the env var.

Extension configuration:
- Open the extension Options page (`options.html`).
- Under "OpenAI Proxy URL", set your deployed proxy base URL (for example: https://my-proxy.example.com). The extension will append `/api/openai` when calling.

Security notes:
- Do not commit your OpenAI API key to source control.
- Consider adding authentication (API key or OAuth) and rate-limiting to the proxy for production.

Icon generation:
- If you want to generate properly sized extension icons from `images/logo.png`, run the Node script:
   1. npm install sharp
   2. node tools/generate-icons.js
   This will produce `images/icon16.png`, `images/icon48.png`, and `images/icon128.png`.
