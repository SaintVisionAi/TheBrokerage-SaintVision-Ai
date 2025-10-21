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

    // Insert directly with raw SQL using the correct columns from db-init.ts
    const result = await db.execute(sql`
      INSERT INTO users (username, email, password, plan)
      VALUES (${username}, ${email}, ${hashedPassword}, 'admin')
      ON CONFLICT (username) DO NOTHING
      RETURNING id, email, username
    `);

    if (result.rows && result.rows.length > 0) {
      console.log('✅ User created successfully!');
      console.log('   Email:', email);
      console.log('   Username:', username);
      console.log('   Password:', password);
      console.log('');
      console.log('🔓 You can now log in at: /login');
    } else {
      console.log('✅ User already exists:', email);
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createTestUser();
