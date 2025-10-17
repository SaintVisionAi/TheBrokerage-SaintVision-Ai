// Email Configuration for SaintBroker AI Platform
// Updated: October 16, 2025

export const EMAIL_CONFIG = {
  // SaintBroker AI email (for AI-generated responses and automated communications)
  SAINTBROKER_EMAIL: 'saints@hacp.ai',
  
  // Support/Admin email (for hot lead alerts, system notifications, and firm communications)
  SUPPORT_EMAIL: 'support@cookin.io',
  
  // Email templates
  TEMPLATES: {
    HOT_LEAD_ALERT: {
      subject: '🔥 HOT LEAD ALERT - Immediate Action Required',
      from: 'saints@hacp.ai',
      to: 'support@cookin.io'
    },
    WELCOME_EMAIL: {
      subject: 'Welcome to Saint Vision Group',
      from: 'saints@hacp.ai'
    },
    DOCUMENT_REQUEST: {
      subject: 'Document Upload Required - Saint Vision Group',
      from: 'saints@hacp.ai'
    },
    STATUS_UPDATE: {
      subject: 'Application Status Update',
      from: 'saints@hacp.ai'
    }
  }
};

// SMS Configuration
export const SMS_CONFIG = {
  // Using GHL's built-in SMS (not Twilio directly)
  PROVIDER: 'GHL',
  
  // Phone number for Saint Vision Group (GHL)
  PHONE_NUMBER: '+19497550720',
  
  // SMS templates
  TEMPLATES: {
    WELCOME: 'Welcome to Saint Vision Group! Your application has been received. Reply STATUS for updates or HELP for assistance.',
    HOT_LEAD_FOLLOW_UP: 'Thank you for your interest! A Saint Vision Group specialist will contact you within 24 hours. Questions? Reply HELP.',
    DOCUMENT_REQUEST: 'Your Saint Vision Group application requires documents. Check your email for the secure upload link.',
    STATUS_UPDATE: 'Application Update: {status}. Next steps: {next_steps}. Questions? Reply HELP.'
  }
};
