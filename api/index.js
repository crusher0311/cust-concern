// Simple root handler so Vercel doesn't return 404 for the site root
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send('<!doctype html><html><body><h1>OpenAI proxy (Vercel)</h1><p>Proxy available at <code>/api/openai</code></p></body></html>');
};
