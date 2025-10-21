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

    // Create sessions table (for session management)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire)
    `);

    // Create conversations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id) NOT NULL,
        title TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create messages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id VARCHAR REFERENCES conversations(id) NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create knowledge_base table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id) NOT NULL,
        filename TEXT NOT NULL,
        content TEXT NOT NULL,
        embeddings JSONB,
        processed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create system_logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS system_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id),
        action TEXT NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create client_notes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS client_notes (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id) NOT NULL,
        conversation_id VARCHAR REFERENCES conversations(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[],
        is_pinned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create signatures table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS signatures (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR REFERENCES users(id) NOT NULL,
        document_id VARCHAR REFERENCES documents(id),
        document_title TEXT NOT NULL,
        signature_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        signed_url TEXT,
        signed_at TIMESTAMP,
        requested_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create loan_products table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS loan_products (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        min_amount INTEGER NOT NULL,
        max_amount INTEGER NOT NULL,
        min_rate VARCHAR(20),
        max_rate VARCHAR(20),
        terms VARCHAR(100),
        min_credit INTEGER,
        speed_days INTEGER,
        requirements JSONB,
        features JSONB,
        disclosures TEXT,
        description TEXT,
        priority INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_loan_products_active ON loan_products(active)
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_loan_products_category ON loan_products(category)
    `);

    // Create application_signatures table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS application_signatures (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id VARCHAR NOT NULL,
        signature_data TEXT NOT NULL,
        signature_type VARCHAR(50) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        title VARCHAR(100),
        ip_address VARCHAR(45),
        user_agent TEXT,
        consent_text TEXT NOT NULL,
        consent_given BOOLEAN DEFAULT TRUE,
        document_url TEXT,
        signed_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create application_documents table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS application_documents (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id VARCHAR NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        uploaded_by VARCHAR REFERENCES users(id),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}
