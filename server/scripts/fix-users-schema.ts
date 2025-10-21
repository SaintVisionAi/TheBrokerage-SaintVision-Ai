import 'dotenv/config';
import { db } from '../db';
import { sql } from 'drizzle-orm';

async function fixSchema() {
  try {
    console.log('🔧 Adding password column to users table...');
    
    // Add password column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password TEXT
    `);

    console.log('✅ Password column added');

    // Also add username column (for compatibility with login logic)
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS username TEXT UNIQUE
    `);

    console.log('✅ Username column added');
    
    // Verify schema
    const result = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('');
    console.log('📋 Updated users table columns:');
    if (result.rows) {
      for (const row of result.rows) {
        console.log(`   ✓ ${row.column_name}: ${row.data_type}`);
      }
    }

    console.log('');
    console.log('✅ Schema fix complete!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixSchema();
