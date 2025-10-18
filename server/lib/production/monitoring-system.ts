/**
 * 📊 MONITORING & ALERTING SYSTEM
 * 
 * This keeps watch over your entire platform 24/7 and alerts you
 * immediately if anything goes wrong.
 * 
 * Brother, this is your early warning system.
 */

import { pool } from '../../db';
import { storage } from '../../storage';
import { sendSMS } from '../../services/twilio-service';
import { sendEmail, checkGHLConnection } from '../../services/ghl-client';
import { openai, MODEL_NAME } from '../../services/openai';
import { validateSMSConfig } from '../../services/twilio-service';

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const MONITORING_CONFIG = {
  // Health check intervals
  healthCheck: {
    database: 60000,      // Check every minute
    api: 30000,           // Check every 30 seconds
    integrations: 300000, // Check every 5 minutes
  },
  
  // Alert thresholds
  thresholds: {
    errorRate: 0.05,           // 5% error rate triggers alert
    responseTime: 5000,        // 5 seconds response time triggers alert
    queueDepth: 100,           // 100 items in queue triggers alert
    failedLeadCaptures: 3,     // 3 failed captures in 10 min triggers alert
  },
  
  // Alert channels
  alerts: {
    sms: process.env.ALERT_PHONE || '+19497550720', // Your phone
    email: process.env.ALERT_EMAIL || 'ryan@saintvisiongroup.com',
    slack: process.env.SLACK_WEBHOOK,
    pagerDuty: process.env.PAGERDUTY_KEY,
  },
};

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
  timestamp: Date;
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  service: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════
// MONITORING SERVICE
// ═══════════════════════════════════════════════════════════

export class MonitoringService {
  private alerts: Alert[] = [];
  private metrics: Metric[] = [];
  private healthStatus: Map<string, HealthCheckResult> = new Map();
  private running = false;
  
  // Alert deduplication tracking
  private sentAlerts: Map<string, Date> = new Map(); // key: service-severity-messageHash, value: timestamp
  private readonly ALERT_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes cooldown
  
  /**
   * Start monitoring
   */
  start() {
    if (this.running) return;
    
    this.running = true;
    console.log('[MONITORING] 📊 Starting monitoring system...');
    
    // Start health checks
    this.startHealthChecks();
    
    // Start metric collection
    this.startMetricCollection();
    
    // Start alert monitoring
    this.startAlertMonitoring();
  }
  
  /**
   * Stop monitoring
   */
  stop() {
    this.running = false;
    console.log('[MONITORING] Stopping monitoring system...');
  }
  
  // ═══════════════════════════════════════════════════════════
  // HEALTH CHECKS
  // ═══════════════════════════════════════════════════════════
  
  private startHealthChecks() {
    // Database health check
    setInterval(async () => {
      await this.checkDatabaseHealth();
    }, MONITORING_CONFIG.healthCheck.database);
    
    // API health check
    setInterval(async () => {
      await this.checkAPIHealth();
    }, MONITORING_CONFIG.healthCheck.api);
    
    // Integration health checks
    setInterval(async () => {
      await this.checkIntegrationHealth();
    }, MONITORING_CONFIG.healthCheck.integrations);
  }
  
  /**
   * Check database health
   */
  private async checkDatabaseHealth() {
    const startTime = Date.now();
    
    try {
      // Simple query to test database
      const result = await pool.query('SELECT 1 as test');
      const responseTime = Date.now() - startTime;
      
      // Check if we got a valid response
      if (!result || !result.rows) {
        throw new Error('Invalid database response');
      }
      
      this.recordHealthCheck({
        service: 'database',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date(),
      });
      
      if (responseTime > 3000) {
        this.sendAlert({
          severity: 'warning',
          service: 'database',
          message: `Database response time: ${responseTime}ms (slow)`,
        });
      }
      
    } catch (error: any) {
      this.recordHealthCheck({
        service: 'database',
        status: 'down',
        error: error.message,
        timestamp: new Date(),
      });
      
      this.sendAlert({
        severity: 'critical',
        service: 'database',
        message: `Database is DOWN: ${error.message}`,
      });
    }
  }
  
  /**
   * Check API health
   */
  private async checkAPIHealth() {
    const startTime = Date.now();
    
    try {
      // Use localhost for health check
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const responseTime = Date.now() - startTime;
      
      this.recordHealthCheck({
        service: 'api',
        status: responseTime < 2000 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date(),
      });
      
    } catch (error: any) {
      this.recordHealthCheck({
        service: 'api',
        status: 'down',
        error: error.message,
        timestamp: new Date(),
      });
      
      this.sendAlert({
        severity: 'critical',
        service: 'api',
        message: `API is DOWN: ${error.message}`,
      });
    }
  }
  
  /**
   * Check integration health
   */
  private async checkIntegrationHealth() {
    await this.checkGHLHealth();
    await this.checkTwilioHealth();
    await this.checkOpenAIHealth();
  }
  
  private async checkGHLHealth() {
    const startTime = Date.now();
    
    try {
      // Test GHL API with connection check
      const isConnected = await checkGHLConnection();
      const responseTime = Date.now() - startTime;
      
      if (!isConnected) {
        throw new Error('GHL connection test failed');
      }
      
      this.recordHealthCheck({
        service: 'ghl',
        status: responseTime < 3000 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date(),
      });
      
      if (responseTime > 5000) {
        this.sendAlert({
          severity: 'warning',
          service: 'ghl',
          message: `GHL API response time: ${responseTime}ms (slow)`,
        });
      }
      
    } catch (error: any) {
      this.recordHealthCheck({
        service: 'ghl',
        status: 'down',
        error: error.message,
        timestamp: new Date(),
      });
      
      this.sendAlert({
        severity: 'critical',
        service: 'ghl',
        message: `GHL CRM is DOWN: ${error.message}`,
      });
    }
  }
  
  private async checkTwilioHealth() {
    try {
      // Twilio is integrated via GHL, so check if SMS config is valid
      const isConfigured = validateSMSConfig();
      
      if (!isConfigured) {
        this.recordHealthCheck({
          service: 'twilio',
          status: 'degraded',
          error: 'SMS service not configured',
          timestamp: new Date(),
        });
        
        // Only warn, not critical since SMS might be intentionally disabled
        this.sendAlert({
          severity: 'warning',
          service: 'twilio',
          message: 'SMS service not configured (GHL API key or location ID missing)',
        });
      } else {
        this.recordHealthCheck({
          service: 'twilio',
          status: 'healthy',
          timestamp: new Date(),
        });
      }
      
    } catch (error: any) {
      this.recordHealthCheck({
        service: 'twilio',
        status: 'down',
        error: error.message,
        timestamp: new Date(),
      });
      
      this.sendAlert({
        severity: 'critical',
        service: 'twilio',
        message: `SMS service error: ${error.message}`,
      });
    }
  }
  
  private async checkOpenAIHealth() {
    const startTime = Date.now();
    
    try {
      // Test OpenAI with a minimal completion request
      const response = await openai.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: 'Health check'
          },
          {
            role: 'user',
            content: 'OK'
          }
        ],
        max_tokens: 5,
        temperature: 0
      });
      
      const responseTime = Date.now() - startTime;
      
      if (!response || !response.choices || response.choices.length === 0) {
        throw new Error('Invalid OpenAI response');
      }
      
      this.recordHealthCheck({
        service: 'openai',
        status: responseTime < 5000 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: new Date(),
      });
      
      if (responseTime > 10000) {
        this.sendAlert({
          severity: 'warning',
          service: 'openai',
          message: `OpenAI API response time: ${responseTime}ms (slow)`,
        });
      }
      
    } catch (error: any) {
      this.recordHealthCheck({
        service: 'openai',
        status: 'down',
        error: error.message,
        timestamp: new Date(),
      });
      
      this.sendAlert({
        severity: 'critical',
        service: 'openai',
        message: `OpenAI API is DOWN: ${error.message}`,
      });
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // METRIC COLLECTION
  // ═══════════════════════════════════════════════════════════
  
  private startMetricCollection() {
    // Collect metrics every minute
    setInterval(async () => {
      await this.collectBusinessMetrics();
      await this.collectPerformanceMetrics();
      await this.collectErrorMetrics();
    }, 60000);
  }
  
  /**
   * Collect business metrics
   */
  private async collectBusinessMetrics() {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Leads captured today - count new contacts created today
      const leadsTodayResult = await pool.query(
        `SELECT COUNT(*) as count FROM contacts WHERE created_at >= $1`,
        [startOfDay]
      );
      const leadsToday = parseInt(leadsTodayResult.rows[0]?.count || '0');
      
      this.recordMetric({
        name: 'leads_captured_today',
        value: leadsToday,
        unit: 'count',
        timestamp: now,
        tags: { division: 'all' },
      });
      
      // Opportunities in pipeline - count active opportunities
      const openOpportunitiesResult = await pool.query(
        `SELECT COUNT(*) as count FROM opportunities 
         WHERE status != 'closed' AND status != 'lost' AND status != 'won'`
      );
      const openOpportunities = parseInt(openOpportunitiesResult.rows[0]?.count || '0');
      
      this.recordMetric({
        name: 'open_opportunities',
        value: openOpportunities,
        unit: 'count',
        timestamp: now,
        tags: { division: 'all' },
      });
      
      // Pipeline value - sum of all open opportunity values
      const pipelineValueResult = await pool.query(
        `SELECT COALESCE(SUM(monetary_value), 0) as total FROM opportunities 
         WHERE status != 'closed' AND status != 'lost' AND status != 'won'`
      );
      const pipelineValue = parseInt(pipelineValueResult.rows[0]?.total || '0');
      
      this.recordMetric({
        name: 'pipeline_value',
        value: pipelineValue,
        unit: 'usd',
        timestamp: now,
        tags: { division: 'all' },
      });
      
      // Conversion rate - calculate won vs total opportunities this month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const conversionRateResult = await pool.query(
        `SELECT 
          COUNT(*) FILTER (WHERE status = 'won' OR stage_name LIKE '%Funded%' OR stage_name LIKE '%Won%') as won,
          COUNT(*) as total
         FROM opportunities 
         WHERE created_at >= $1`,
        [startOfMonth]
      );
      
      const wonCount = parseInt(conversionRateResult.rows[0]?.won || '0');
      const totalCount = parseInt(conversionRateResult.rows[0]?.total || '1');
      const conversionRate = totalCount > 0 ? (wonCount / totalCount) * 100 : 0;
      
      this.recordMetric({
        name: 'conversion_rate',
        value: Math.round(conversionRate * 100) / 100, // Round to 2 decimal places
        unit: 'percent',
        timestamp: now,
        tags: { division: 'all' },
      });
      
      // Collect metrics by division
      const divisionsResult = await pool.query(
        `SELECT 
          division,
          COUNT(*) as count,
          COALESCE(SUM(monetary_value), 0) as value
         FROM opportunities
         WHERE status != 'closed' AND status != 'lost' AND status != 'won'
         GROUP BY division`
      );
      
      for (const row of divisionsResult.rows) {
        if (row.division) {
          this.recordMetric({
            name: `opportunities_${row.division}`,
            value: parseInt(row.count),
            unit: 'count',
            timestamp: now,
            tags: { division: row.division },
          });
          
          this.recordMetric({
            name: `pipeline_value_${row.division}`,
            value: parseInt(row.value),
            unit: 'usd',
            timestamp: now,
            tags: { division: row.division },
          });
        }
      }
      
    } catch (error) {
      console.error('[MONITORING] Error collecting business metrics:', error);
    }
  }
  
  /**
   * Collect performance metrics
   */
  private async collectPerformanceMetrics() {
    try {
      const now = new Date();
      
      // Collect response times from health checks
      for (const [service, health] of this.healthStatus.entries()) {
        if (health.responseTime !== undefined) {
          this.recordMetric({
            name: `response_time_${service}`,
            value: health.responseTime,
            unit: 'ms',
            timestamp: now,
            tags: { service },
          });
          
          // Alert if response time exceeds threshold
          if (health.responseTime > MONITORING_CONFIG.thresholds.responseTime) {
            this.sendAlert({
              severity: 'warning',
              service: service,
              message: `High response time: ${health.responseTime}ms (threshold: ${MONITORING_CONFIG.thresholds.responseTime}ms)`,
            });
          }
        }
      }
      
      // Database connection pool stats
      const poolStats = pool.totalCount;
      const idleConnections = pool.idleCount;
      const activeConnections = poolStats - idleConnections;
      
      this.recordMetric({
        name: 'db_pool_total',
        value: poolStats,
        unit: 'count',
        timestamp: now,
        tags: { type: 'total' },
      });
      
      this.recordMetric({
        name: 'db_pool_active',
        value: activeConnections,
        unit: 'count',
        timestamp: now,
        tags: { type: 'active' },
      });
      
      this.recordMetric({
        name: 'db_pool_idle',
        value: idleConnections,
        unit: 'count',
        timestamp: now,
        tags: { type: 'idle' },
      });
      
      // Memory usage
      const memUsage = process.memoryUsage();
      this.recordMetric({
        name: 'memory_heap_used',
        value: Math.round(memUsage.heapUsed / 1024 / 1024), // Convert to MB
        unit: 'MB',
        timestamp: now,
        tags: { type: 'heap' },
      });
      
      this.recordMetric({
        name: 'memory_rss',
        value: Math.round(memUsage.rss / 1024 / 1024), // Convert to MB
        unit: 'MB',
        timestamp: now,
        tags: { type: 'rss' },
      });
      
    } catch (error) {
      console.error('[MONITORING] Error collecting performance metrics:', error);
    }
  }
  
  /**
   * Collect error metrics
   */
  private async collectErrorMetrics() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      // Query error logs from system_logs table
      const errorsResult = await pool.query(
        `SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE action LIKE '%error%' OR action LIKE '%failed%') as errors,
          COUNT(*) FILTER (WHERE details->>'severity' = 'critical') as critical
         FROM system_logs
         WHERE created_at >= $1`,
        [oneHourAgo]
      );
      
      const errorsLastHour = parseInt(errorsResult.rows[0]?.errors || '0');
      const criticalErrors = parseInt(errorsResult.rows[0]?.critical || '0');
      
      this.recordMetric({
        name: 'errors_last_hour',
        value: errorsLastHour,
        unit: 'count',
        timestamp: now,
        tags: { severity: 'all' },
      });
      
      this.recordMetric({
        name: 'critical_errors_last_hour',
        value: criticalErrors,
        unit: 'count',
        timestamp: now,
        tags: { severity: 'critical' },
      });
      
      // Calculate error rate
      const totalLogs = parseInt(errorsResult.rows[0]?.total || '1');
      const errorRate = totalLogs > 0 ? (errorsLastHour / totalLogs) : 0;
      
      this.recordMetric({
        name: 'error_rate',
        value: Math.round(errorRate * 10000) / 100, // Convert to percentage with 2 decimals
        unit: 'percent',
        timestamp: now,
        tags: { period: 'hour' },
      });
      
      // Alert on high error rate
      if (errorRate > MONITORING_CONFIG.thresholds.errorRate) {
        this.sendAlert({
          severity: 'warning',
          service: 'platform',
          message: `High error rate: ${(errorRate * 100).toFixed(2)}% (${errorsLastHour} errors in last hour)`,
        });
      }
      
      // Alert on critical errors
      if (criticalErrors > 0) {
        this.sendAlert({
          severity: 'critical',
          service: 'platform',
          message: `${criticalErrors} critical errors detected in last hour`,
        });
      }
      
      // Query failed automation logs
      const failedAutomationsResult = await pool.query(
        `SELECT COUNT(*) as count FROM automation_logs
         WHERE success = false AND created_at >= $1`,
        [oneHourAgo]
      );
      
      const failedAutomations = parseInt(failedAutomationsResult.rows[0]?.count || '0');
      
      this.recordMetric({
        name: 'failed_automations_last_hour',
        value: failedAutomations,
        unit: 'count',
        timestamp: now,
        tags: { type: 'automation' },
      });
      
      if (failedAutomations > 5) {
        this.sendAlert({
          severity: 'warning',
          service: 'automation',
          message: `${failedAutomations} automation failures in last hour`,
        });
      }
      
    } catch (error) {
      console.error('[MONITORING] Error collecting error metrics:', error);
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // ALERT MONITORING
  // ═══════════════════════════════════════════════════════════
  
  private startAlertMonitoring() {
    // Check for critical situations every 30 seconds
    setInterval(async () => {
      await this.checkCriticalSituations();
    }, 30000);
  }
  
  /**
   * Check for critical situations
   */
  private async checkCriticalSituations() {
    // Check for failed lead captures
    await this.checkFailedLeadCaptures();
    
    // Check for long-running processes
    await this.checkStuckProcesses();
    
    // Check for low balance warnings
    await this.checkBalanceWarnings();
  }
  
  private async checkFailedLeadCaptures() {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      // Query recent failed lead captures from automation logs
      const failedCapturesResult = await pool.query(
        `SELECT COUNT(*) as count FROM automation_logs
         WHERE (action_type = 'lead_capture' OR action_type LIKE '%capture%')
         AND success = false 
         AND created_at >= $1`,
        [tenMinutesAgo]
      );
      
      const recentFailures = parseInt(failedCapturesResult.rows[0]?.count || '0');
      
      if (recentFailures >= MONITORING_CONFIG.thresholds.failedLeadCaptures) {
        this.sendAlert({
          severity: 'critical',
          service: 'lead-capture',
          message: `${recentFailures} failed lead captures in last 10 minutes!`,
        });
      }
      
      // Also check for contacts without opportunities (potential failed workflow)
      const orphanedContactsResult = await pool.query(
        `SELECT COUNT(*) as count FROM contacts c
         WHERE c.created_at >= $1
         AND NOT EXISTS (
           SELECT 1 FROM opportunities o 
           WHERE o.contact_id = c.id OR o.ghl_contact_id = c.ghl_contact_id
         )`,
        [tenMinutesAgo]
      );
      
      const orphanedContacts = parseInt(orphanedContactsResult.rows[0]?.count || '0');
      
      if (orphanedContacts > 5) {
        this.sendAlert({
          severity: 'warning',
          service: 'lead-capture',
          message: `${orphanedContacts} new contacts without opportunities (possible workflow failure)`,
        });
      }
      
    } catch (error) {
      console.error('[MONITORING] Error checking failed lead captures:', error);
    }
  }
  
  private async checkStuckProcesses() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      // Check for opportunities stuck in certain stages for too long
      const stuckOpportunitiesResult = await pool.query(
        `SELECT 
          COUNT(*) as count,
          stage_name
         FROM opportunities
         WHERE updated_at < $1
         AND stage_name IN ('Documents pending', 'Documents Pending and Follow Up', 'Pre Qualified -Apply Now-SVG2')
         AND status NOT IN ('closed', 'lost', 'won')
         GROUP BY stage_name`,
        [oneHourAgo]
      );
      
      for (const row of stuckOpportunitiesResult.rows) {
        const count = parseInt(row.count);
        if (count > 0) {
          this.sendAlert({
            severity: 'warning',
            service: 'workflow',
            message: `${count} opportunities stuck in "${row.stage_name}" stage for over 1 hour`,
          });
        }
      }
      
      // Check for upload tokens that expired without being used
      const expiredTokensResult = await pool.query(
        `SELECT COUNT(*) as count FROM upload_tokens
         WHERE expires_at < NOW()
         AND used = false
         AND created_at >= $1`,
        [oneHourAgo]
      );
      
      const expiredTokens = parseInt(expiredTokensResult.rows[0]?.count || '0');
      
      if (expiredTokens > 3) {
        this.sendAlert({
          severity: 'warning',
          service: 'document-upload',
          message: `${expiredTokens} upload tokens expired unused (clients may need help uploading)`,
        });
      }
      
      // Check for long-running automations (potential infinite loops)
      const longRunningAutomationsResult = await pool.query(
        `SELECT COUNT(*) as count FROM automation_logs
         WHERE created_at < $1
         AND success IS NULL`,  // Still running
        [oneHourAgo]
      );
      
      const longRunningCount = parseInt(longRunningAutomationsResult.rows[0]?.count || '0');
      
      if (longRunningCount > 0) {
        this.sendAlert({
          severity: 'critical',
          service: 'automation',
          message: `${longRunningCount} automations running for over 1 hour (possible infinite loop)`,
        });
      }
      
    } catch (error) {
      console.error('[MONITORING] Error checking stuck processes:', error);
    }
  }
  
  private async checkBalanceWarnings() {
    // Check Twilio balance
    // Check OpenAI credits
    // etc.
  }
  
  // ═══════════════════════════════════════════════════════════
  // ALERT SENDING
  // ═══════════════════════════════════════════════════════════
  
  /**
   * Send alert to all configured channels
   */
  private async sendAlert(params: {
    severity: 'critical' | 'warning' | 'info';
    service: string;
    message: string;
  }) {
    // Create alert key for deduplication
    const alertKey = `${params.service}-${params.severity}-${this.hashMessage(params.message)}`;
    const lastSent = this.sentAlerts.get(alertKey);
    const now = new Date();
    
    // Check if we've sent this alert recently
    if (lastSent && (now.getTime() - lastSent.getTime()) < this.ALERT_COOLDOWN_MS) {
      console.log(`[ALERT] Suppressed duplicate alert for ${params.service} (cooldown active)`);
      return; // Skip duplicate alert within cooldown period
    }
    
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      severity: params.severity,
      service: params.service,
      message: params.message,
      timestamp: now,
      resolved: false,
    };
    
    this.alerts.push(alert);
    this.sentAlerts.set(alertKey, now); // Mark this alert as sent
    
    console.log(`[ALERT] ${params.severity.toUpperCase()} - ${params.service}: ${params.message}`);
    
    // Send SMS for critical alerts
    if (params.severity === 'critical') {
      await this.sendSMSAlert(alert);
    }
    
    // Send email for all alerts
    await this.sendEmailAlert(alert);
    
    // Send to Slack
    if (MONITORING_CONFIG.alerts.slack) {
      await this.sendSlackAlert(alert);
    }
    
    // Send to PagerDuty for critical
    if (params.severity === 'critical' && MONITORING_CONFIG.alerts.pagerDuty) {
      await this.sendPagerDutyAlert(alert);
    }
  }
  
  /**
   * Simple hash function for message deduplication
   */
  private hashMessage(message: string): string {
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  private async sendSMSAlert(alert: Alert) {
    try {
      console.log(`[SMS ALERT] Sending to ${MONITORING_CONFIG.alerts.sms}`);
      
      const message = `🚨 ${alert.severity.toUpperCase()} ALERT\n\n` +
        `Service: ${alert.service}\n` +
        `${alert.message}\n\n` +
        `Time: ${alert.timestamp.toLocaleString()}\n` +
        `Check dashboard: https://saintvisiongroup.com/admin`;
      
      // Send SMS using the Twilio service (which uses GHL internally)
      const result = await sendSMS(MONITORING_CONFIG.alerts.sms, message);
      
      if (result.success) {
        console.log(`[SMS ALERT] ✅ Alert sent successfully (ID: ${result.messageSid})`);
      } else {
        console.error(`[SMS ALERT] ❌ Failed to send: ${result.error}`);
      }
      
    } catch (error) {
      console.error('[MONITORING] Failed to send SMS alert:', error);
    }
  }
  
  private async sendEmailAlert(alert: Alert) {
    try {
      console.log(`[EMAIL ALERT] Sending to ${MONITORING_CONFIG.alerts.email}`);
      
      // Create HTML email content
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: ${alert.severity === 'critical' ? '#ff0000' : alert.severity === 'warning' ? '#ffaa00' : '#0099ff'};">
              🚨 ${alert.severity.toUpperCase()} ALERT
            </h2>
            
            <div style="margin: 20px 0;">
              <p><strong>Service:</strong> ${alert.service}</p>
              <p><strong>Message:</strong> ${alert.message}</p>
              <p><strong>Time:</strong> ${alert.timestamp.toLocaleString()}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
              <p style="margin: 0;">
                <a href="https://saintvisiongroup.com/admin" style="color: #0066cc; text-decoration: none;">
                  📊 View Dashboard →
                </a>
              </p>
            </div>
            
            <div style="margin-top: 20px; font-size: 12px; color: #666;">
              <p>This is an automated alert from Saint Vision Group monitoring system.</p>
            </div>
          </div>
        </div>
      `;
      
      // Note: GHL sendEmail requires a contactId, not an email address
      // For system alerts, we'll need to handle this differently
      // For now, log the alert - in production, you'd integrate with your email service
      console.log(`[EMAIL ALERT] Alert prepared for ${MONITORING_CONFIG.alerts.email}`);
      
      // If you have a dedicated email service or SMTP, implement it here
      // For example:
      // await yourEmailService.send({
      //   to: MONITORING_CONFIG.alerts.email,
      //   subject: `[${alert.severity.toUpperCase()}] ${alert.service} Alert`,
      //   html: htmlBody
      // });
      
    } catch (error) {
      console.error('[MONITORING] Failed to send email alert:', error);
    }
  }
  
  private async sendSlackAlert(alert: Alert) {
    try {
      const color = {
        critical: '#ff0000',
        warning: '#ffaa00',
        info: '#0099ff',
      }[alert.severity];
      
      await fetch(MONITORING_CONFIG.alerts.slack!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attachments: [{
            color,
            title: `${alert.severity.toUpperCase()} Alert`,
            text: alert.message,
            fields: [
              { title: 'Service', value: alert.service, short: true },
              { title: 'Time', value: alert.timestamp.toLocaleString(), short: true },
            ],
          }],
        }),
      });
      
    } catch (error) {
      console.error('[MONITORING] Failed to send Slack alert:', error);
    }
  }
  
  private async sendPagerDutyAlert(alert: Alert) {
    try {
      // TODO: Send to PagerDuty
    } catch (error) {
      console.error('[MONITORING] Failed to send PagerDuty alert:', error);
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // DATA RECORDING
  // ═══════════════════════════════════════════════════════════
  
  private recordHealthCheck(result: HealthCheckResult) {
    this.healthStatus.set(result.service, result);
    
    // Also store in database for historical tracking
    // TODO: Store in database
  }
  
  private recordMetric(metric: Metric) {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    
    // Store in database for long-term tracking
    // TODO: Store in database
  }
  
  // ═══════════════════════════════════════════════════════════
  // DASHBOARD DATA
  // ═══════════════════════════════════════════════════════════
  
  /**
   * Get current system status for dashboard
   */
  getSystemStatus() {
    const status = {
      overall: 'healthy' as 'healthy' | 'degraded' | 'down',
      services: Array.from(this.healthStatus.values()),
      recentAlerts: this.alerts.slice(-10),
      metrics: {
        leads: this.getMetric('leads_captured_today'),
        opportunities: this.getMetric('open_opportunities'),
        pipelineValue: this.getMetric('pipeline_value'),
        conversionRate: this.getMetric('conversion_rate'),
        errors: this.getMetric('errors_last_hour'),
      },
    };
    
    // Determine overall status
    const servicesDown = status.services.filter(s => s.status === 'down').length;
    const servicesDegraded = status.services.filter(s => s.status === 'degraded').length;
    
    if (servicesDown > 0) {
      status.overall = 'down';
    } else if (servicesDegraded > 0) {
      status.overall = 'degraded';
    }
    
    return status;
  }
  
  private getMetric(name: string): number {
    const recent = this.metrics
      .filter(m => m.name === name)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    return recent?.value || 0;
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════

export const monitoringService = new MonitoringService();

// ═══════════════════════════════════════════════════════════
// START ON SERVER BOOT
// ═══════════════════════════════════════════════════════════

// In your server.ts or app entry point:
// monitoringService.start();

console.log('[MONITORING] ✅ Monitoring system ready');

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK ENDPOINT (FOR VERCEL/UPTIME MONITORS)
// ═══════════════════════════════════════════════════════════

/*
// Create this in your API routes:
// api/health/route.ts

import { monitoringService } from '@/lib/monitoring-service';

export async function GET() {
  const status = monitoringService.getSystemStatus();
  
  return Response.json(status, {
    status: status.overall === 'down' ? 503 : 200,
  });
}
*/
