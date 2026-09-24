module.exports = async function handler(req, res) {
  try {
    const targetUrl = 'https://www.parlaytrade.online' + req.url;
    
    const options = {
      method: req.method,
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': req.headers['accept'] || '*/*',
        'Origin': 'https://www.parlaytrade.online',
        'Referer': 'https://www.parlaytrade.online/'
      }
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      let body = Buffer.from('');
      for await (const chunk of req) {
        body = Buffer.concat([body, chunk]);
      }
      options.body = body;
      if (req.headers['content-type']) {
        options.headers['Content-Type'] = req.headers['content-type'];
      }
    }

    const fetchRes = await fetch(targetUrl, options);
    const data = await fetchRes.arrayBuffer();
    
    res.status(fetchRes.status);
    
    const contentType = fetchRes.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.send(Buffer.from(data));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', message: String(err) });
  }
}
