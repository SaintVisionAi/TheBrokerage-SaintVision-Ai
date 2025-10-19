import { db } from '../db';
import { knowledgeBase } from '@shared/schema';
import { eq, isNull } from 'drizzle-orm';
import OpenAI from 'openai';

// Script to generate embeddings for knowledge base chunks that don't have them

async function generateEmbeddings() {
  console.log('🧠 Starting embedding generation for knowledge base...\n');
  
  // Initialize OpenAI client
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment');
    process.exit(1);
  }
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  try {
    // Get all chunks without embeddings
    const chunksWithoutEmbeddings = await db
      .select()
      .from(knowledgeBase)
      .where(isNull(knowledgeBase.embeddings));
    
    console.log(`📊 Found ${chunksWithoutEmbeddings.length} chunks without embeddings\n`);
    
    if (chunksWithoutEmbeddings.length === 0) {
      console.log('✅ All chunks already have embeddings!');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each chunk
    for (let i = 0; i < chunksWithoutEmbeddings.length; i++) {
      const chunk = chunksWithoutEmbeddings[i];
      
      try {
        console.log(`[${i + 1}/${chunksWithoutEmbeddings.length}] Processing: ${chunk.filename}`);
        
        // Generate embedding
        const response = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: chunk.content,
        });
        
        const embedding = response.data[0].embedding;
        
        // Update database with embedding
        await db
          .update(knowledgeBase)
          .set({
            embeddings: { vector: embedding },
            processedAt: new Date()
          })
          .where(eq(knowledgeBase.id, chunk.id));
        
        successCount++;
        console.log(`✅ Generated embedding for ${chunk.filename}`);
        
        // Small delay to avoid rate limiting
        if (i < chunksWithoutEmbeddings.length - 1) {
          await new Promise(r => setTimeout(r, 100));
        }
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to generate embedding for ${chunk.filename}:`, error);
        
        // Continue with next chunk
        continue;
      }
    }
    
    console.log(`\n🎯 Embedding generation complete!`);
    console.log(`✅ Success: ${successCount} chunks`);
    console.log(`❌ Failed: ${errorCount} chunks`);
    
    // Verify final state
    const stats = await db.select().from(knowledgeBase);
    const withEmbeddings = stats.filter(s => s.embeddings !== null).length;
    console.log(`\n📊 Final stats: ${withEmbeddings}/${stats.length} chunks have embeddings`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
console.log('='.repeat(60));
console.log('SAINTBROKER AI™ - Knowledge Base Embedding Generator');
console.log('='.repeat(60));

generateEmbeddings()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });