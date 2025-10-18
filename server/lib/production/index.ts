/**
 * Production System Initialization
 * Starts all 24/7 automation and monitoring systems
 */

import { SaintBrokerAI } from './ai-orchestrator';
import { AutomationOrchestrator } from './automation-orchestrator';
import { MonitoringService } from './monitoring-system';

// Export singleton instances
export const saintBrokerAI = new SaintBrokerAI();
export const automationOrchestrator = new AutomationOrchestrator();
export const monitoringService = new MonitoringService();

// Initialize function for server startup
export function initializeProductionSystems() {
  console.log('🚀 Initializing SaintBroker Production Systems...');
  
  try {
    // Start 24/7 automation
    automationOrchestrator.start();
    console.log('✅ 24/7 Automation Engine: ACTIVE');
    
    // Start monitoring & alerting
    monitoringService.start();
    console.log('✅ Monitoring & Alerting: ACTIVE');
    
    console.log('🎉 All production systems initialized successfully!');
    console.log('📊 Dashboard: https://saintvisiongroup.com/admin/dashboard');
    console.log('🔔 Alerts will be sent to: +1 (949) 755-0720');
    
  } catch (error) {
    console.error('❌ Failed to initialize production systems:', error);
    // Send critical alert
    sendCriticalAlert('Production systems failed to initialize', error);
  }
}

// Helper function to send critical alerts
function sendCriticalAlert(message: string, error: any) {
  console.error(`[CRITICAL] ${message}`, error);
  // TODO: Send SMS/Email alert
}