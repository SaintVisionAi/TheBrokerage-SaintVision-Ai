/**
 * ⚡ 24/7 AUTOMATION ORCHESTRATOR
 * 
 * This system runs continuously, monitoring all pipelines and executing
 * automated workflows without human intervention.
 * 
 * Brother, this is the system that makes you money while you sleep.
 */

import { SaintBrokerAI } from './ai-orchestrator';
import { db } from '../../db';
import { 
  contacts, 
  opportunities, 
  automationLogs, 
  smsMessages,
  uploadTokens,
  documents,
  type Contact as DBContact,
  type Opportunity as DBOpportunity,
  type InsertAutomationLog
} from '@shared/schema';
import { eq, and, lte, gte, isNull, sql, or, notInArray, inArray } from 'drizzle-orm';
import * as ghlClient from '../../services/ghl-client';
import { 
  triggerWorkflow as triggerGHLWorkflow,
  WORKFLOW_REGISTRY,
  LENDING_PIPELINE_STAGES,
  resolveStageNameFromWebhook
} from '../../services/ghl';
import { sendSMS, SMS_TEMPLATES } from '../../services/twilio-service';
import { documentStorage } from '../../services/document-storage';
import { EMAIL_CONFIG } from '../../config/email';

// Initialize AI instance
const saintBrokerAI = new SaintBrokerAI();

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
}

type WorkflowTrigger = 
  | { type: 'new_lead' }
  | { type: 'stage_change'; from?: string; to?: string }
  | { type: 'time_based'; hours: number }
  | { type: 'document_uploaded' }
  | { type: 'webhook_received'; source: string };

type WorkflowCondition = 
  | { field: string; operator: 'equals' | 'contains' | 'greater_than' | 'less_than'; value: any };

type WorkflowAction =
  | { type: 'send_sms'; template: string }
  | { type: 'send_email'; template: string }
  | { type: 'create_task'; assignee: string; title: string }
  | { type: 'update_stage'; stageId: string }
  | { type: 'tag_contact'; tags: string[] }
  | { type: 'ai_followup'; context: string }
  | { type: 'webhook'; url: string; payload: Record<string, any> }
  | { type: 'trigger_ghl_workflow'; workflowId?: string };

// Workflow execution state persistence
interface WorkflowExecutionState {
  workflowId: string;
  opportunityId: string;
  lastExecutedAt: Date;
}

// ═══════════════════════════════════════════════════════════
// AUTOMATION ENGINE
// ═══════════════════════════════════════════════════════════

export class AutomationOrchestrator {
  private workflows: Workflow[] = [];
  private running = false;
  private checkInterval = 60000; // Check every minute
  private executionState = new Map<string, WorkflowExecutionState>();
  
  constructor() {
    this.initializeWorkflows();
    this.loadExecutionState();
  }
  
  /**
   * Load execution state from database
   */
  private async loadExecutionState() {
    try {
      // Load recent automation logs to prevent re-execution
      const recentLogs = await db
        .select()
        .from(automationLogs)
        .where(
          gte(automationLogs.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        );
      
      for (const log of recentLogs) {
        if (log.actionType && log.opportunityId) {
          const key = `${log.actionType}_${log.opportunityId}`;
          this.executionState.set(key, {
            workflowId: log.actionType,
            opportunityId: log.opportunityId,
            lastExecutedAt: log.createdAt!
          });
        }
      }
      
      console.log(`[AUTOMATION] Loaded ${this.executionState.size} execution states`);
    } catch (error) {
      console.error('[AUTOMATION] Failed to load execution state:', error);
    }
  }
  
  /**
   * Start the 24/7 automation engine
   */
  start() {
    if (this.running) {
      console.log('[AUTOMATION] Already running');
      return;
    }
    
    this.running = true;
    console.log('[AUTOMATION] 🚀 Starting 24/7 automation engine...');
    
    // Run continuous monitoring loop
    this.monitoringLoop();
  }
  
  /**
   * Stop the automation engine
   */
  stop() {
    this.running = false;
    console.log('[AUTOMATION] Stopping automation engine...');
  }
  
  /**
   * Main monitoring loop - runs continuously
   */
  private async monitoringLoop() {
    while (this.running) {
      try {
        console.log('[AUTOMATION] 🔄 Running automation check...');
        
        // Check for time-based triggers
        await this.checkTimeBasedTriggers();
        
        // Check for abandoned leads
        await this.checkAbandonedLeads();
        
        // Check for stuck pipelines
        await this.checkStuckOpportunities();
        
        // Check for document expirations
        await this.checkDocumentExpirations();
        
        // Check for follow-up reminders
        await this.checkFollowUpReminders();
        
        console.log('[AUTOMATION] ✅ Check complete');
        
      } catch (error) {
        console.error('[AUTOMATION] Error in monitoring loop:', error);
        await this.logAutomation({
          actionType: 'monitoring_error',
          actionDetails: { error: String(error) },
          success: false,
          errorMessage: String(error)
        });
      }
      
      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, this.checkInterval));
    }
  }
  
  /**
   * Initialize predefined workflows
   */
  private initializeWorkflows() {
    this.workflows = [
      // ═══════════════════════════════════════════════════════
      // LENDING WORKFLOWS
      // ═══════════════════════════════════════════════════════
      
      {
        id: 'lending-new-lead-instant-response',
        name: 'New Lending Lead - Instant Response',
        trigger: { type: 'new_lead' },
        conditions: [
          { field: 'division', operator: 'equals', value: 'lending' },
        ],
        actions: [
          { 
            type: 'send_sms', 
            template: 'Hi {{firstName}}! Thanks for your interest in financing with Saint Vision Group. We received your inquiry and will review it within 1 hour. Reply with any questions!' 
          },
          { 
            type: 'send_email', 
            template: 'new_lending_lead_welcome' 
          },
          { 
            type: 'tag_contact', 
            tags: ['hot-lead', 'needs-follow-up'] 
          },
          { 
            type: 'trigger_ghl_workflow',
            workflowId: WORKFLOW_REGISTRY[LENDING_PIPELINE_STAGES.NEW_LEAD]
          },
          { 
            type: 'create_task', 
            assignee: 'ryan', 
            title: 'Review new lending lead - {{firstName}} {{lastName}}' 
          },
        ],
        enabled: true,
      },
      
      {
        id: 'lending-credit-check-reminder',
        name: 'Credit Check Authorization Reminder',
        trigger: { type: 'time_based', hours: 24 },
        conditions: [
          { field: 'division', operator: 'equals', value: 'lending' },
          { field: 'stageName', operator: 'equals', value: LENDING_PIPELINE_STAGES.CONTACTED },
        ],
        actions: [
          { 
            type: 'send_sms', 
            template: 'Hi {{firstName}}, just following up on your loan inquiry. We need your authorization for a soft credit check to provide accurate loan options. Click here to authorize: https://saintvisiongroup.com/credit-auth' 
          },
          { 
            type: 'ai_followup', 
            context: 'remind about credit authorization' 
          },
        ],
        enabled: true,
      },
      
      {
        id: 'lending-documents-pending',
        name: 'Document Collection Follow-Up',
        trigger: { type: 'stage_change', to: LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING },
        conditions: [],
        actions: [
          { 
            type: 'send_email', 
            template: 'document_checklist' 
          },
          { 
            type: 'send_sms', 
            template: 'Hi {{firstName}}, we need a few documents to move forward with your loan. Check your email for the complete list. Upload here: {{uploadLink}}' 
          },
          {
            type: 'trigger_ghl_workflow',
            workflowId: WORKFLOW_REGISTRY[LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING]
          }
        ],
        enabled: true,
      },
      
      {
        id: 'lending-stuck-in-review',
        name: 'Stuck in Under Review - Escalate',
        trigger: { type: 'time_based', hours: 72 },
        conditions: [
          { field: 'stageName', operator: 'equals', value: LENDING_PIPELINE_STAGES.SENT_TO_LENDER },
        ],
        actions: [
          { 
            type: 'create_task', 
            assignee: 'ryan', 
            title: 'URGENT: Loan stuck in review for 72+ hours - {{firstName}} {{lastName}}' 
          },
          { 
            type: 'tag_contact', 
            tags: ['stuck-pipeline', 'needs-attention'] 
          },
          { 
            type: 'send_sms', 
            template: 'Hi {{firstName}}, checking in on your loan application. We want to ensure we\'re moving as quickly as possible. Any questions? Call us: (949) 755-0720' 
          },
        ],
        enabled: true,
      },
      
      {
        id: 'lending-funding-celebration',
        name: 'Loan Funded - Celebration & Next Steps',
        trigger: { type: 'stage_change', to: LENDING_PIPELINE_STAGES.FUNDED },
        conditions: [],
        actions: [
          { 
            type: 'send_email', 
            template: 'loan_funded_congratulations' 
          },
          { 
            type: 'send_sms', 
            template: '🎉 Congratulations {{firstName}}! Your loan has been funded. Funds will be in your account within 1-2 business days. Thank you for choosing Saint Vision Group!' 
          },
          { 
            type: 'tag_contact', 
            tags: ['funded', 'success-story', 'testimonial-candidate'] 
          },
          {
            type: 'trigger_ghl_workflow',
            workflowId: WORKFLOW_REGISTRY[LENDING_PIPELINE_STAGES.FUNDED]
          },
          { 
            type: 'create_task', 
            assignee: 'ryan', 
            title: 'Request testimonial from {{firstName}} {{lastName}}' 
          },
        ],
        enabled: true,
      },
      
      // ═══════════════════════════════════════════════════════
      // INVESTMENT WORKFLOWS
      // ═══════════════════════════════════════════════════════
      
      {
        id: 'investment-new-lead-qualification',
        name: 'New Investment Lead - Qualification',
        trigger: { type: 'new_lead' },
        conditions: [
          { field: 'division', operator: 'equals', value: 'investment' },
        ],
        actions: [
          { 
            type: 'send_email', 
            template: 'investment_welcome' 
          },
          { 
            type: 'send_sms', 
            template: 'Hi {{firstName}}! Thanks for your interest in investment opportunities with Saint Vision Group. Let\'s schedule a call to discuss your goals: https://calendly.com/saintvision' 
          },
          { 
            type: 'tag_contact', 
            tags: ['investor', 'needs-qualification'] 
          },
          { 
            type: 'ai_followup', 
            context: 'qualify investment interest and accreditation status' 
          },
        ],
        enabled: true,
      },
      
      // ═══════════════════════════════════════════════════════
      // REAL ESTATE WORKFLOWS
      // ═══════════════════════════════════════════════════════
      
      {
        id: 'real-estate-new-lead',
        name: 'New Real Estate Lead - Instant Response',
        trigger: { type: 'new_lead' },
        conditions: [
          { field: 'division', operator: 'equals', value: 'real_estate' },
        ],
        actions: [
          { 
            type: 'send_sms', 
            template: 'Hi {{firstName}}! Thanks for contacting Saint Vision Group about real estate. Let\'s schedule a showing or consultation: https://calendly.com/saintvision' 
          },
          { 
            type: 'send_email', 
            template: 'real_estate_welcome' 
          },
          { 
            type: 'tag_contact', 
            tags: ['buyer', 'needs-showing'] 
          },
        ],
        enabled: true,
      },
      
      // ═══════════════════════════════════════════════════════
      // UNIVERSAL WORKFLOWS (ALL DIVISIONS)
      // ══════��════════════════════════════════════════════════
      
      {
        id: 'universal-abandoned-lead-recovery',
        name: 'Abandoned Lead Recovery',
        trigger: { type: 'time_based', hours: 168 }, // 7 days
        conditions: [
          { field: 'status', operator: 'equals', value: 'open' },
        ],
        actions: [
          { 
            type: 'send_email', 
            template: 'win_back_campaign' 
          },
          { 
            type: 'ai_followup', 
            context: 'attempt to re-engage abandoned lead' 
          },
          { 
            type: 'tag_contact', 
            tags: ['cold-lead', 'needs-reactivation'] 
          },
        ],
        enabled: true,
      },
    ];
    
    console.log(`[AUTOMATION] Initialized ${this.workflows.length} workflows`);
  }
  
  /**
   * Check time-based triggers
   */
  private async checkTimeBasedTriggers() {
    const now = new Date();
    
    try {
      // Get all opportunities that haven't been touched recently
      const staleOpportunities = await this.fetchOpportunitiesNeedingAttention();
      
      for (const opp of staleOpportunities) {
        const hoursStale = (now.getTime() - (opp.updatedAt || opp.createdAt!).getTime()) / (1000 * 60 * 60);
        
        // Find matching workflows
        const matchingWorkflows = this.workflows.filter(w => 
          w.enabled && 
          w.trigger.type === 'time_based' && 
          hoursStale >= (w.trigger as any).hours &&
          this.checkConditions(w.conditions, opp) &&
          !this.hasRecentExecution(w.id, opp.id)
        );
        
        for (const workflow of matchingWorkflows) {
          console.log(`[AUTOMATION] Executing workflow: ${workflow.name} for opportunity ${opp.id}`);
          await this.executeWorkflow(workflow, opp);
        }
      }
    } catch (error) {
      console.error('[AUTOMATION] Error checking time-based triggers:', error);
    }
  }
  
  /**
   * Check for abandoned leads
   */
  private async checkAbandonedLeads() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    try {
      // Query database for abandoned leads
      const abandonedOpportunities = await db
        .select()
        .from(opportunities)
        .where(
          and(
            eq(opportunities.status, 'open'),
            lte(opportunities.updatedAt, sevenDaysAgo)
          )
        );
      
      for (const opp of abandonedOpportunities) {
        if (this.hasRecentExecution('abandoned-recovery', opp.id)) continue;
        
        console.log(`[AUTOMATION] Found abandoned opportunity: ${opp.firstName} ${opp.lastName}`);
        
        // Get contact details
        const [contact] = opp.contactId 
          ? await db.select().from(contacts).where(eq(contacts.id, opp.contactId))
          : [];
        
        if (contact) {
          // AI-powered re-engagement
          await saintBrokerAI.chat({
            message: `This lead has been inactive for 7+ days. Craft a personalized re-engagement message.`,
            context: {
              contactId: contact.id,
              division: opp.division || 'lending',
            },
          });
          
          // Tag as cold
          if (contact.ghlContactId) {
            await this.tagContact(contact.ghlContactId, ['cold-lead', 'needs-reactivation']);
          }
          
          // Log the action
          await this.logAutomation({
            contactId: contact.id,
            opportunityId: opp.id,
            actionType: 'abandoned-recovery',
            actionDetails: { daysAbandoned: 7 },
            success: true
          });
        }
      }
    } catch (error) {
      console.error('[AUTOMATION] Error checking abandoned leads:', error);
    }
  }
  
  /**
   * Check for stuck opportunities
   */
  private async checkStuckOpportunities() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    try {
      const stuckOpportunities = await db
        .select()
        .from(opportunities)
        .where(
          and(
            eq(opportunities.status, 'open'),
            lte(opportunities.updatedAt, threeDaysAgo),
            notInArray(opportunities.stageName, [
              LENDING_PIPELINE_STAGES.FUNDED,
              LENDING_PIPELINE_STAGES.AMOUNT_WON,
              LENDING_PIPELINE_STAGES.DISQUALIFIED
            ])
          )
        );
      
      for (const opp of stuckOpportunities) {
        if (this.hasRecentExecution('stuck-escalation', opp.id)) continue;
        
        console.log(`[AUTOMATION] Found stuck opportunity: ${opp.id} (${opp.stageName})`);
        
        // Create urgent task (log it for now)
        console.log(`[TASK] URGENT: Opportunity stuck in ${opp.stageName} for 3+ days - ${opp.firstName} ${opp.lastName}`);
        
        // Get contact for SMS
        const [contact] = opp.contactId 
          ? await db.select().from(contacts).where(eq(contacts.id, opp.contactId))
          : [];
        
        if (contact?.phone) {
          // Send follow-up SMS
          await sendSMS(
            contact.phone,
            `Hi ${contact.firstName}, checking in on your application. We want to ensure we're moving as quickly as possible. Any questions? Call us: (949) 755-0720`
          );
        }
        
        // AI analysis of why it's stuck
        await saintBrokerAI.chat({
          message: `Analyze why this opportunity is stuck and suggest actions to move it forward.`,
          context: {
            opportunityId: opp.id,
            stage: opp.stageName || 'unknown',
          },
        });
        
        // Log the escalation
        await this.logAutomation({
          contactId: contact?.id,
          opportunityId: opp.id,
          actionType: 'stuck-escalation',
          actionDetails: { 
            stageName: opp.stageName,
            daysStuck: 3
          },
          success: true
        });
      }
    } catch (error) {
      console.error('[AUTOMATION] Error checking stuck opportunities:', error);
    }
  }
  
  /**
   * Check for document expirations
   */
  private async checkDocumentExpirations() {
    // Check for upload tokens expiring soon
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    try {
      // Skip this check - schema validation needed
      // The uploadTokens table may not exist yet
      const expiringTokens: any[] = [];
      
      for (const token of expiringTokens) {
        if (!token.contactId) continue;
        
        const [contact] = await db
          .select()
          .from(contacts)
          .where(eq(contacts.id, token.contactId));
        
        if (contact?.phone) {
          const uploadLink = `https://saintvisiongroup.com/upload/${token.token}`;
          
          console.log(`[AUTOMATION] Document token expiring soon for contact ${contact.id}`);
          
          // Send reminder SMS
          await sendSMS(
            contact.phone,
            `Hi ${contact.firstName}, your document upload link expires in 7 days. Please upload your documents soon to avoid delays: ${uploadLink}`
          );
          
          // Log the reminder
          await this.logAutomation({
            contactId: contact.id,
            opportunityId: token.opportunityId,
            actionType: 'document-expiry-reminder',
            actionDetails: { 
              tokenId: token.id,
              expiresAt: token.expiresAt
            },
            success: true
          });
        }
      }
    } catch (error) {
      console.error('[AUTOMATION] Error checking document expirations:', error);
    }
  }
  
  /**
   * Check for follow-up reminders based on stage
   */
  private async checkFollowUpReminders() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    try {
      // Check opportunities in specific stages that need follow-up
      const needsFollowUp = await db
        .select()
        .from(opportunities)
        .where(
          and(
            eq(opportunities.status, 'open'),
            inArray(opportunities.stageName, [
              LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING,
              LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING_FOLLOWUP,
              LENDING_PIPELINE_STAGES.PRE_QUALIFIED
            ]),
            lte(opportunities.updatedAt, oneDayAgo)
          )
        );
      
      for (const opp of needsFollowUp) {
        if (this.hasRecentExecution('stage-follow-up', opp.id)) continue;
        
        const [contact] = opp.contactId 
          ? await db.select().from(contacts).where(eq(contacts.id, opp.contactId))
          : [];
        
        if (contact?.phone) {
          let message = '';
          
          switch (opp.stageName) {
            case LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING:
              message = `Hi ${contact.firstName}, reminder: We're still waiting for your documents to process your loan. Need help? Reply YES`;
              break;
            case LENDING_PIPELINE_STAGES.PRE_QUALIFIED:
              message = `Hi ${contact.firstName}, you're pre-qualified! Complete your application to move forward. Questions? Reply HELP`;
              break;
            default:
              message = `Hi ${contact.firstName}, checking in on your application. Reply STATUS for an update`;
          }
          
          if (message) {
            await sendSMS(contact.phone, message);
            
            // Log the follow-up
            await this.logAutomation({
              contactId: contact.id,
              opportunityId: opp.id,
              actionType: 'stage-follow-up',
              actionDetails: { 
                stageName: opp.stageName,
                message
              },
              success: true
            });
          }
        }
      }
    } catch (error) {
      console.error('[AUTOMATION] Error checking follow-up reminders:', error);
    }
  }
  
  /**
   * Execute a workflow with all actions
   */
  private async executeWorkflow(workflow: Workflow, opportunity: DBOpportunity) {
    console.log(`[AUTOMATION] ⚡ Executing: ${workflow.name}`);
    
    // Get contact details
    const [contact] = opportunity.contactId 
      ? await db.select().from(contacts).where(eq(contacts.id, opportunity.contactId))
      : [];
    
    const context = {
      ...opportunity,
      ...contact,
      phone: contact?.phone,
      email: contact?.email,
      contactId: contact?.id,
      firstName: contact?.firstName || opportunity.firstName,
      lastName: contact?.lastName || opportunity.lastName,
      uploadLink: opportunity.id ? `https://saintvisiongroup.com/upload/${opportunity.id}` : ''
    };
    
    let success = true;
    const errors: string[] = [];
    
    for (const action of workflow.actions) {
      try {
        await this.executeAction(action, context);
      } catch (error) {
        console.error(`[AUTOMATION] Action failed:`, error);
        errors.push(`${action.type}: ${String(error)}`);
        success = false;
      }
    }
    
    // Record execution
    await this.logAutomation({
      contactId: contact?.id,
      opportunityId: opportunity.id,
      actionType: workflow.id,
      actionDetails: { 
        workflowName: workflow.name,
        actionsCount: workflow.actions.length
      },
      success,
      errorMessage: errors.length > 0 ? errors.join('; ') : undefined
    });
    
    // Update execution state
    this.executionState.set(`${workflow.id}_${opportunity.id}`, {
      workflowId: workflow.id,
      opportunityId: opportunity.id,
      lastExecutedAt: new Date()
    });
  }
  
  /**
   * Execute a single action
   */
  private async executeAction(action: WorkflowAction, context: any) {
    switch (action.type) {
      case 'send_sms':
        if (context.phone) {
          const message = this.interpolateTemplate(action.template, context);
          await sendSMS(context.phone, message);
          
          // Log SMS in database
          await db.insert(smsMessages).values({
            contactId: context.contactId,
            direction: 'outbound',
            fromNumber: '+19497550720',
            toNumber: context.phone,
            message: message,
            status: 'sent'
          });
        }
        break;
        
      case 'send_email':
        if (context.email && context.ghlContactId) {
          // Use GHL to send email
          const subject = EMAIL_CONFIG.TEMPLATES[action.template as keyof typeof EMAIL_CONFIG.TEMPLATES]?.subject || 'Saint Vision Group Update';
          const htmlBody = this.generateEmailBody(action.template, context);
          await ghlClient.sendEmail(context.ghlContactId, subject, htmlBody);
        }
        break;
        
      case 'create_task':
        // Log task creation (implement actual task system as needed)
        console.log(`[TASK] ${action.assignee}: ${this.interpolateTemplate(action.title, context)}`);
        break;
        
      case 'update_stage':
        if (context.ghlOpportunityId) {
          await ghlClient.moveOpportunityStage(context.ghlOpportunityId, action.stageId);
          
          // Update local database
          await db
            .update(opportunities)
            .set({ 
              stageId: action.stageId,
              updatedAt: new Date()
            })
            .where(eq(opportunities.id, context.id));
        }
        break;
        
      case 'tag_contact':
        if (context.ghlContactId) {
          await this.tagContact(context.ghlContactId, action.tags);
        }
        break;
        
      case 'ai_followup':
        await saintBrokerAI.chat({
          message: action.context,
          context: {
            contactId: context.contactId,
            opportunityId: context.id,
          },
        });
        break;
        
      case 'trigger_ghl_workflow':
        if (context.ghlContactId) {
          const workflowId = action.workflowId || WORKFLOW_REGISTRY[context.stageName];
          if (workflowId) {
            await ghlClient.triggerWorkflow(context.ghlContactId, workflowId);
            console.log(`[AUTOMATION] Triggered GHL workflow ${workflowId} for contact ${context.ghlContactId}`);
          }
        }
        break;
        
      case 'webhook':
        await fetch(action.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...action.payload, context }),
        });
        break;
    }
  }
  
  /**
   * Check if conditions match
   */
  private checkConditions(conditions: WorkflowCondition[], data: any): boolean {
    return conditions.every(condition => {
      const value = data[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        default:
          return false;
      }
    });
  }
  
  /**
   * Template interpolation
   */
  private interpolateTemplate(template: string, context: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }
  
  /**
   * Generate email body from template
   */
  private generateEmailBody(template: string, context: any): string {
    // Basic email templates
    const templates: Record<string, string> = {
      new_lending_lead_welcome: `
        <h2>Welcome to Saint Vision Group, ${context.firstName}!</h2>
        <p>Thank you for your interest in our lending services.</p>
        <p>We've received your application and will review it within 1 hour.</p>
        <p>Next steps:</p>
        <ol>
          <li>Complete any missing information</li>
          <li>Upload required documents</li>
          <li>Schedule a call with our team</li>
        </ol>
        <p>Questions? Reply to this email or call (949) 755-0720</p>
      `,
      document_checklist: `
        <h2>Documents Needed, ${context.firstName}</h2>
        <p>To process your loan application, please upload the following:</p>
        <ul>
          <li>Government-issued ID</li>
          <li>Bank statements (last 3 months)</li>
          <li>Proof of income</li>
          <li>Tax returns (if self-employed)</li>
        </ul>
        <p><a href="${context.uploadLink}">Click here to upload documents</a></p>
      `,
      loan_funded_congratulations: `
        <h2>🎉 Congratulations, ${context.firstName}!</h2>
        <p>Your loan has been successfully funded!</p>
        <p>The funds will be in your account within 1-2 business days.</p>
        <p>Thank you for choosing Saint Vision Group!</p>
      `,
      investment_welcome: `
        <h2>Welcome to Saint Vision Group Investments</h2>
        <p>Dear ${context.firstName},</p>
        <p>Thank you for your interest in investment opportunities with Saint Vision Group.</p>
        <p>Our team will contact you within 24 hours to discuss your investment goals.</p>
      `,
      real_estate_welcome: `
        <h2>Welcome to Saint Vision Group Real Estate</h2>
        <p>Hello ${context.firstName},</p>
        <p>Thank you for contacting us about real estate opportunities.</p>
        <p>Our agents will reach out within 24 hours to schedule a consultation.</p>
      `,
      win_back_campaign: `
        <h2>We Miss You, ${context.firstName}!</h2>
        <p>We noticed you started an application but haven't completed it.</p>
        <p>Is there anything we can help with? Our team is here to assist.</p>
        <p>Reply to this email or call us at (949) 755-0720</p>
      `
    };
    
    return templates[template] || `<p>${template}</p>`;
  }
  
  /**
   * Check if workflow was recently executed
   */
  private hasRecentExecution(workflowId: string, opportunityId: string): boolean {
    const key = `${workflowId}_${opportunityId}`;
    const state = this.executionState.get(key);
    
    if (!state) return false;
    
    // Don't re-execute within 24 hours
    const hoursSinceExecution = (Date.now() - state.lastExecutedAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceExecution < 24;
  }
  
  /**
   * Log automation execution
   */
  private async logAutomation(log: InsertAutomationLog) {
    try {
      await db.insert(automationLogs).values(log);
    } catch (error) {
      console.error('[AUTOMATION] Failed to log automation:', error);
    }
  }
  
  /**
   * Tag a contact in GHL
   */
  private async tagContact(ghlContactId: string, tags: string[]) {
    try {
      await ghlClient.updateContact(ghlContactId, { tags });
      console.log(`[AUTOMATION] Tagged contact ${ghlContactId} with:`, tags);
    } catch (error) {
      console.error('[AUTOMATION] Failed to tag contact:', error);
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // DATABASE QUERIES
  // ═══════════════════════════════════════════════════════════
  
  private async fetchOpportunitiesNeedingAttention(): Promise<DBOpportunity[]> {
    try {
      // Get opportunities not updated in last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      return await db
        .select()
        .from(opportunities)
        .where(
          and(
            eq(opportunities.status, 'open'),
            lte(opportunities.updatedAt, oneHourAgo)
          )
        )
        .limit(100);
    } catch (error) {
      console.error('[AUTOMATION] Error fetching opportunities:', error);
      return [];
    }
  }
  
  /**
   * Process new lead trigger
   */
  async processNewLead(contact: DBContact, opportunity: DBOpportunity) {
    console.log(`[AUTOMATION] Processing new lead: ${contact.firstName} ${contact.lastName}`);
    
    // Find workflows with new_lead trigger
    const newLeadWorkflows = this.workflows.filter(w => 
      w.enabled && 
      w.trigger.type === 'new_lead' &&
      this.checkConditions(w.conditions, { ...opportunity, ...contact })
    );
    
    for (const workflow of newLeadWorkflows) {
      await this.executeWorkflow(workflow, opportunity);
    }
  }
  
  /**
   * Process stage change trigger
   */
  async processStageChange(opportunity: DBOpportunity, fromStage: string, toStage: string) {
    console.log(`[AUTOMATION] Processing stage change: ${fromStage} → ${toStage}`);
    
    // Find workflows with stage_change trigger
    const stageChangeWorkflows = this.workflows.filter(w => {
      if (!w.enabled || w.trigger.type !== 'stage_change') return false;
      
      const trigger = w.trigger as { type: 'stage_change'; from?: string; to?: string };
      
      // Check if trigger matches the stage change
      const matchesFrom = !trigger.from || trigger.from === fromStage;
      const matchesTo = !trigger.to || trigger.to === toStage;
      
      return matchesFrom && matchesTo && this.checkConditions(w.conditions, opportunity);
    });
    
    for (const workflow of stageChangeWorkflows) {
      await this.executeWorkflow(workflow, opportunity);
    }
  }
  
  /**
   * Process document upload trigger
   */
  async processDocumentUpload(uploadToken: any, document: any) {
    console.log(`[AUTOMATION] Processing document upload for token ${uploadToken.id}`);
    
    if (uploadToken.completedAt && uploadToken.opportunityId) {
      // Get opportunity
      const [opportunity] = await db
        .select()
        .from(opportunities)
        .where(eq(opportunities.id, uploadToken.opportunityId));
      
      if (opportunity && opportunity.stageName === LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING) {
        // Move to next stage
        const nextStage = LENDING_PIPELINE_STAGES.FULL_APPLICATION_COMPLETE;
        
        if (opportunity.ghlOpportunityId) {
          // Find the stage ID for the next stage (would need mapping)
          console.log(`[AUTOMATION] Moving opportunity to ${nextStage}`);
          
          // Update local database
          await db
            .update(opportunities)
            .set({ 
              stageName: nextStage,
              updatedAt: new Date()
            })
            .where(eq(opportunities.id, opportunity.id));
          
          // Trigger stage change workflows
          await this.processStageChange(opportunity, LENDING_PIPELINE_STAGES.DOCUMENTS_PENDING, nextStage);
        }
      }
    }
  }
}

// Export singleton instance
export const automationOrchestrator = new AutomationOrchestrator();
