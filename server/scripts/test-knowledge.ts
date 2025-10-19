import { knowledgeBaseService } from '../services/knowledge-base';

async function testKnowledge() {
  console.log('🧠 Testing SaintBroker AI Knowledge Base\n');
  console.log('='.repeat(60));
  
  // Test queries
  const queries = [
    'commercial lending maximum loan amount',
    'real estate investment',
    'healthcare compliance',
    'government contracts'
  ];
  
  for (const query of queries) {
    console.log(`\n📍 Query: "${query}"`);
    console.log('-'.repeat(40));
    
    try {
      const results = await knowledgeBaseService.searchKnowledge(query, undefined, 2);
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} relevant chunks:\n`);
        
        results.forEach((result, i) => {
          console.log(`[${i + 1}] From: ${result.filename}`);
          console.log(`    Score: ${(result.score || 0).toFixed(3)}`);
          console.log(`    Preview: ${result.content.substring(0, 100)}...`);
          console.log();
        });
      } else {
        console.log('❌ No results found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  console.log('='.repeat(60));
  console.log('\n✨ Knowledge base test complete!');
}

testKnowledge()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });