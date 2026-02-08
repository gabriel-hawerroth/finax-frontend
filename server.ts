import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './src/main.server';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import { environment } from './src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use(cookieParser());
  server.use(express.json());

  // Proxy for Login
  server.post('/api/login', proxy(environment.backendApiUrl, {
    proxyReqPathResolver: (req) => '/login',
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      try {
        const data = JSON.parse(proxyResData.toString('utf8'));
        if (data.token) {
          userRes.cookie('token', data.token, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
        }
        return JSON.stringify(data);
      } catch (e) {
        return proxyResData;
      }
    }
  }));

  // Logout
  server.post('/api/logout', (req, res) => {
      res.clearCookie('token', { path: '/' });
      res.status(200).send({});
  });

  // Proxy for other API requests
  server.use('/api', proxy(environment.backendApiUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.cookies['token']) {
        if (!proxyReqOpts.headers) proxyReqOpts.headers = {};
        proxyReqOpts.headers['Authorization'] = `Bearer ${srcReq.cookies['token']}`;
      }
      return proxyReqOpts;
    }
  }));

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Angular engine
  server.get('/{*splat}', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
