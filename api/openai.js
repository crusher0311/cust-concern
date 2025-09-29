const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
  const apiKey = process.env.OPENAI_API_KEY;
  const proxySecret = process.env.PROXY_SECRET;

  if (proxySecret) {
    const provided = req.headers['x-proxy-key'] || '';
    if (!provided || provided !== proxySecret) {
      return res.status(401).json({ error: 'Unauthorized: invalid proxy key' });
    }
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured on the server' });
  }

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Proxy error' });
  }
};
