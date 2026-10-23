import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const urlPath = req.url.split('?')[0];
        const relPath = urlPath.replace(/^\//, '');
        const directFile = path.resolve(import.meta.dirname, `${relPath}.ts`);
        const indexFile = path.resolve(import.meta.dirname, relPath, 'index.ts');
        const targetFile = fs.existsSync(directFile) ? directFile : fs.existsSync(indexFile) ? indexFile : null;

        if (!targetFile) return next();

        try {
          let body: any = {};
          if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const raw = Buffer.concat(chunks).toString('utf-8');
            if (raw.trim()) {
              try {
                body = JSON.parse(raw);
              } catch {
                body = raw;
              }
            }
          }

          const mod = await server.ssrLoadModule(targetFile);
          const handler = mod.default || mod.handler;

          if (typeof handler !== 'function') {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Handler not found in API module' }));
            return;
          }

          const mockRes = {
            setHeader: (name: string, value: string) => res.setHeader(name, value),
            status: (code: number) => {
              res.statusCode = code;
              return {
                json: (data: unknown) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                },
                send: (data: unknown) => {
                  res.end(typeof data === 'string' ? data : JSON.stringify(data));
                },
              };
            },
            writeHead: (code: number, headers: Record<string, string>) => {
              res.writeHead(code, headers);
            },
            end: () => res.end(),
          };

          const mockReq = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            body,
          };

          await handler(mockReq, mockRes);
        } catch (err) {
          console.error('[apiDevPlugin] Error executing API route:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      historyApiFallback: true,
    },
  };
});
