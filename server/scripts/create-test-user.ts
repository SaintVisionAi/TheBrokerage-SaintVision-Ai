import 'dotenv/config';
import { db } from '../db';
import { users } from '@shared/schema';
import { hashPassword } from '../lib/password';
import { eq } from 'drizzle-orm';

async function createTestUser() {
  try {
    const email = 'ryan@cookinknowledge.com';
    const password = 'Ayden0428$$';
    const username = 'ryan';

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('✅ User already exists:', email);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role: 'admin',
        emailVerified: true
      })
      .returning();

    console.log('✅ User created successfully:');
    console.log('   Email:', email);
    console.log('   Username:', username);
    console.log('   Role: admin');
    console.log('✅ You can now log in at: https://57ffd1b0bf8c4a4c8c44568cb9d5ff66-818c12fb898e43ae8154931a0.fly.dev/login');
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

createTestUser();
