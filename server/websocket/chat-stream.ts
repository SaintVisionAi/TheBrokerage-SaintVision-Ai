import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    console.log('WebSocket client connected');
    
    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat') {
          // Stream response from OpenAI
          const stream = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `You are SaintBroker AI, the master orchestrator for Saint Vision Group's AI brokerage platform. 
                You provide expert guidance on commercial lending ($50K-$5M), real estate financing, and investment opportunities.
                Be direct, professional, and helpful. Focus on getting clients funded quickly.`
              },
              {
                role: 'user',
                content: message.content
              }
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 500
          });
          
          // Send chunks as they arrive
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              ws.send(JSON.stringify({
                type: 'chunk',
                content: content
              }));
            }
          }
          
          // Send completion signal
          ws.send(JSON.stringify({
            type: 'complete'
          }));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // Send initial connection success
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to SaintBroker streaming service'
    }));
  });
}