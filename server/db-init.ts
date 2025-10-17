import { db } from './db';
import { sql } from 'drizzle-orm';

export async function initializeDatabase() {
  console.log('🔄 Initializing database tables...');
  
  try {
    // Create users table FIRST (no dependencies)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        email TEXT,
        password TEXT NOT NULL,
        plan TEXT DEFAULT 'free',
        crm_contact_id TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create contacts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        ghl_contact_id VARCHAR UNIQUE,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(50),
        source VARCHAR(255),
        tags TEXT[],
        custom_fields JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create opportunities table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS opportunities (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        ghl_opportunity_id VARCHAR UNIQUE,
        contact_id VARCHAR REFERENCES contacts(id),
        ghl_contact_id VARCHAR REFERENCES contacts(ghl_contact_id),
        pipeline_id VARCHAR(255),
        stage_id VARCHAR(255),
        stage_name VARCHAR(255),
        name VARCHAR(500),
        monetary_value INTEGER,
        division VARCHAR(50),
        priority VARCHAR(50),
        status VARCHAR(50),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create ai_classifications table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS ai_classifications (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        contact_id VARCHAR REFERENCES contacts(id),
        opportunity_id VARCHAR REFERENCES opportunities(id),
        division VARCHAR(50),
        priority VARCHAR(50),
        estimated_value INTEGER,
        reasoning TEXT,
        next_steps TEXT[],
        confidence_score INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create upload_tokens table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS upload_tokens (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR(255) UNIQUE NOT NULL,
        contact_id VARCHAR REFERENCES contacts(id),
        opportunity_id VARCHAR REFERENCES opportunities(id),
        division VARCHAR(50),
        required_documents TEXT[],
        uploaded_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
        expires_at TIMESTAMP,
        used BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create automation_logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS automation_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        contact_id VARCHAR REFERENCES contacts(id),
        opportunity_id VARCHAR REFERENCES opportunities(id),
        action_type VARCHAR(255),
        action_details JSONB,
        success BOOLEAN,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create sms_messages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sms_messages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        contact_id VARCHAR REFERENCES contacts(id),
        direction VARCHAR(50),
        from_number VARCHAR(50),
        to_number VARCHAR(50),
        message TEXT,
        status VARCHAR(50),
        ghl_message_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create chat_messages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        contact_id VARCHAR REFERENCES contacts(id),
        message TEXT,
        role VARCHAR(50),
        intent VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create documents table (references users, contacts, opportunities, upload_tokens)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id),
        contact_id VARCHAR REFERENCES contacts(id),
        opportunity_id VARCHAR REFERENCES opportunities(id),
        upload_token_id VARCHAR REFERENCES upload_tokens(id),
        conversation_id VARCHAR,
        filename TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_url TEXT NOT NULL,
        division VARCHAR(50),
        document_type VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        verification_details JSONB,
        processed_content TEXT,
        summary TEXT,
        uploaded_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}
