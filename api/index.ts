// Vercel serverless function handler for SaintBroker AI
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { registerRoutes } from '../server/routes';
import { verifySession } from '../server/lib/session';

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', true);

// --- CORS: allow all origins (while supporting credentials) ---
// Use origin: true to echo the requesting origin in Access-Control-Allow-Origin.
// Note: this effectively allows any origin, and also allows cookies when credentials: true.
const corsOptions = {
  origin: true, // reflect the requesting origin
  credentials: true, // allow cookies/auth to be sent
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
};

app.use(cors(corsOptions));
// Ensure preflight requests get a proper response
app.options('*', cors(corsOptions));
// -------------------------------------------------------------

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom session middleware for Vercel
app.use((req: any, res, next) => {
  const token = req.cookies?.session;
  if (token) {
    const session = verifySession(token);
    if (session) {
      req.user = session;
    }
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'SaintBroker AI API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Register all application routes
registerRoutes(app);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Export for Vercel serverless
export default app;
