const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Basic request logging
app.use(morgan('combined'));

// Basic rate limiter to avoid accidental abuse. Adjust as needed.
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const PORT = process.env.PORT || 3000;

app.post('/api/openai', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

    // Proxy secret validation removed: this server trusts incoming requests.
    // Server-side OpenAI key (OPENAI_API_KEY) should still be set in environment for API use.

  if (!apiKey) {
    console.error('OPENAI_API_KEY not configured');
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured on the server' });
  }

  const body = req.body;

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    // mirror status from OpenAI
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy error' });
  }
});

app.get('/', (req, res) => res.send('OpenAI proxy running'));

app.listen(PORT, () => {
  console.log(`OpenAI proxy listening on port ${PORT}`);
});