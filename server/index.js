const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const PORT = process.env.PORT || 3000;

app.post('/api/openai', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
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