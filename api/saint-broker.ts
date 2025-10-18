// SaintBroker AI API endpoint with production features
import { Request, Response } from 'express';
import { SaintBrokerAI } from '../server/lib/production/ai-orchestrator';

// Initialize production AI
const saintBrokerAI = new SaintBrokerAI();

export default async function handler(req: Request, res: Response) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use production AI with retry logic, circuit breaker, and fallback
    const response = await saintBrokerAI.chat({
      message,
      conversationHistory,
      context
    });

    return res.status(200).json({
      success: true,
      ...response
    });

  } catch (error: any) {
    console.error('[SAINT-BROKER API] Error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'AI service temporarily unavailable',
      message: 'Please try again or call us at (949) 755-0720',
      fallbackPhone: '+19497550720'
    });
  }
}