const PROXY_CONFIG = [
  {
    context: ['/api/login'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    selfHandleResponse: true,
    onProxyRes: (proxyRes, req, res) => {
      let body = Buffer.from([]);
      proxyRes.on('data', (chunk) => {
        body = Buffer.concat([body, chunk]);
      });
      proxyRes.on('end', () => {
        try {
          const bodyStr = body.toString();
          const json = JSON.parse(bodyStr);
          if (json.token) {
            res.setHeader('Set-Cookie', `token=${json.token}; HttpOnly; Path=/; SameSite=Strict;`);
          }
          res.status(proxyRes.statusCode);
          Object.keys(proxyRes.headers).forEach(key => {
             res.setHeader(key, proxyRes.headers[key]);
          });
          res.end(body);
        } catch (e) {
          res.status(proxyRes.statusCode);
          Object.keys(proxyRes.headers).forEach(key => {
             res.setHeader(key, proxyRes.headers[key]);
          });
          res.end(body);
        }
      });
    }
  },
  {
    context: ['/api/logout'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    onProxyRes: (proxyRes, req, res) => {
        res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
    }
  },
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers.cookie) {
        const token = req.headers.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (token) {
          proxyReq.setHeader('Authorization', `Bearer ${token}`);
        }
      }
    }
  }
];

module.exports = PROXY_CONFIG;
