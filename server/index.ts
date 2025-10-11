// SmartFlow Systems — SFSDataQueryEngine
import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import type { AddressInfo } from 'node:net'

// Optional app modules (keep these if present in your repo)
import { registerRoutes } from './routes'
import { setupVite, serveStatic, log } from './vite'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Health
app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }))

// Attach routes if available
try { registerRoutes?.(app) } catch { /* routes not present */ }

// Central error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = Number(err?.status || err?.statusCode || 500)
  const message = String(err?.message || 'Internal Server Error')
  try { log?.(`ERROR ${status}: ${message}`) } catch {}
  if (!res.headersSent) res.status(status).json({ message })
})

// Respect PORT env; treat 0 as "pick any free port"
const envPort = process.env.PORT
const port = envPort !== undefined ? Number(envPort) : 5000

const server = app.listen(port, '0.0.0.0', () => {
  if (log) {
    log(`serving on port ${port}`);
  } else {
    console.log(`serving on port ${port}`);
  }
})

// Report actual bound port (useful when PORT=0)
app.get('/_port', (_req: Request, res: Response) => {
  const addr = server.address() as AddressInfo | null
  res.json({ port: typeof addr === 'object' && addr ? addr.port : null })
})

// Dev = Vite middleware; Prod = static
;(async () => {
  try {
    if (app.get('env') === 'development') {
      await setupVite?.(app, server)
    } else {
      serveStatic?.(app)
    }
  } catch (e) {
    try { log?.('vite/static setup failed: ' + (e as Error).message) } catch {}
  }
})().catch(() => void 0)

// Graceful shutdown
for (const sig of ['SIGINT','SIGTERM'] as const) {
  process.on(sig, () => {
    try { console.log(`received ${sig}, shutting down…`) } catch {}
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 3000).unref()
  })
}

export default app
