// Create GHL Webhook Workflows via API
const fetch = require('node-fetch');

const GHL_TOKEN = 'pit-867ef626-39f8-4e19-b610-6736c9c35eac';
const GHL_LOCATION_ID = 'NgUphdsMGXpRO3h98XyG';
const WEBHOOK_URL = 'https://saintvisiongroup.com/api/webhooks/ghl';

async function createWebhookWorkflow(triggerType, workflowName) {
  try {
    console.log(`\n🔧 Creating workflow: ${workflowName}...`);
    
    const workflowData = {
      name: workflowName,
      locationId: GHL_LOCATION_ID,
      status: 'published',
      trigger: {
        type: triggerType
      },
      actions: [
        {
          type: 'webhook',
          url: WEBHOOK_URL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ]
    };

    const response = await fetch('https://services.leadconnectorhq.com/workflows/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(workflowData)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to create ${workflowName}:`, error);
      return null;
    }

    const result = await response.json();
    console.log(`✅ Created ${workflowName} successfully!`);
    console.log(`   Workflow ID: ${result.id || 'N/A'}`);
    return result;
    
  } catch (error) {
    console.error(`❌ Error creating ${workflowName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Creating 3 webhook workflows for SaintVision automation...\n');
  console.log(`Location ID: ${GHL_LOCATION_ID}`);
  console.log(`Webhook URL: ${WEBHOOK_URL}\n`);

  // Create 3 workflows
  await createWebhookWorkflow('ContactCreate', 'SaintVision - Contact Created Webhook');
  await createWebhookWorkflow('OpportunityCreate', 'SaintVision - Opportunity Created Webhook');
  await createWebhookWorkflow('OpportunityStageUpdate', 'SaintVision - Stage Changed Webhook');

  console.log('\n✅ DONE! Check your GHL Workflows page.');
}

main();
