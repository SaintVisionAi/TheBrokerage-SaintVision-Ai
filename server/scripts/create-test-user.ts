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

    // Insert directly with raw SQL to avoid schema issues
    const result = await db.execute(sql`
      INSERT INTO users (email, username, password, role, email_verified)
      VALUES (${email}, ${username}, ${hashedPassword}, 'admin', true)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, username, role
    `);

    if (result.rows && result.rows.length > 0) {
      console.log('✅ User created successfully:');
      console.log('   Email:', email);
      console.log('   Username:', username);
      console.log('   Role: admin');
      console.log('✅ You can now log in at: /login');
    } else {
      console.log('✅ User already exists:', email);
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

createTestUser();
