import 'dotenv/config';  // Load environment variables from .env file
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./db-init";
import rateLimit from 'express-rate-limit';
import { initializeProductionSystems } from "./lib/production/index";

const app = express();

// Enable trust proxy for Replit's infrastructure (required for rate limiting)
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' }
});

app.use('/api/', limiter);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // CRITICAL: Validate required environment variables before starting
  if (!process.env.INTERNAL_API_KEY) {
    console.error('❌ CRITICAL ERROR: INTERNAL_API_KEY environment variable is not set!');
    console.error('   This is required for securing internal API endpoints.');
    console.error('   Please set INTERNAL_API_KEY in your environment variables.');
    process.exit(1); // Exit with error code
  }
  
  // Initialize database tables on startup
  initializeDatabase().catch(err => {
    console.error('⚠️  Database init failed (continuing anyway):', err.message);
  });
  
  // Initialize production systems (AI, automation, monitoring)
  try {
    initializeProductionSystems();
    console.log('🚀 Production systems initialized!');
  } catch (err: any) {
    console.error('⚠️  Production systems initialization failed:', err.message);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // This is the only port that is not firewalled on Replit
  // Frontend and backend are served on the same port
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
