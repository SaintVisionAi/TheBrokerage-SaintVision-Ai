import 'dotenv/config';
import { db } from '../db';
import { hashPassword } from '../lib/password';
import { sql } from 'drizzle-orm';

async function createTestUser() {
  try {
    const email = 'ryan@cookinknowledge.com';
    const password = 'Ayden0428$$';
    const username = 'ryan';

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert with correct columns that exist
    const result = await db.execute(sql`
      INSERT INTO users (username, email, password, role, email_verified)
      VALUES (${username}, ${email}, ${hashedPassword}, 'admin', true)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, email, username, role
    `);

    if (result.rows && result.rows.length > 0) {
      console.log('✅ User created successfully!');
      console.log('');
      console.log('📧 Email:', email);
      console.log('👤 Username:', username);
      console.log('🔑 Password:', password);
      console.log('👑 Role: admin');
      console.log('');
      console.log('🔓 Ready to log in!');
    } else {
      console.log('ℹ️ User already exists:', email);
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createTestUser();
