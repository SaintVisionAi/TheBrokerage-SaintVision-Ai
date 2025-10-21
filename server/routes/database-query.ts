import { Router } from 'express';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

const verifyApiKey = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.DATABASE_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.post('/database/query', verifyApiKey, async (req, res) => {
  try {
    const { action, contact_id, email, phone } = req.body;

    if (action === 'get_client_data') {
      let user;
      
      if (contact_id) {
        user = await db.query.users.findFirst({
          where: eq(users.id, parseInt(contact_id))
        });
      } else if (email) {
        user = await db.query.users.findFirst({
          where: eq(users.email, email)
        });
      } else if (phone) {
        user = await db.query.users.findFirst({
          where: eq(users.phone, phone)
        });
      }

      if (!user) {
        return res.json({
          success: false,
          message: 'Client not found',
          data: null
        });
      }

      return res.json({
        success: true,
        data: {
          client: {
            id: user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email,
            phone: user.phone
          }
        }
      });
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
