// Vercel serverless function handler for SaintBroker AI
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { registerRoutes } from '../server/routes';
import { verifySession } from '../server/lib/session';

const app = express();

// Trust proxy for Vercel
app.set('trust proxy', true);

// CORS configuration for production
const allowedOrigins = [
  'https://saintvisiongroup.com',
  'https://www.saintvisiongroup.com',
  'https://the-brokerage-by-saintsal-saintvisionai.vercel.app',
  process.env.VITE_API_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true
}));

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