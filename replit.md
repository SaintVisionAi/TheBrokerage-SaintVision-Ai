# Saint Vision Group - AI Brokerage Platform

## Overview
This project is a fully automated AI brokerage platform that combines the CookinKnowledge-101-SaintSal AI backbone with Saint Vision Group's brokerage services (Real Estate, Business Lending, and Investment Suite). The platform leverages SaintSal™ HACP™ technology (U.S. Patent No. 10,290,222), Azure Cognitive Services, PostgreSQL, GoHighLevel (GHL) CRM, and a custom knowledge base to provide real-time chat, voice processing, brain ingestion, tone detection, brokerage service pages, and automated lead capture. Its core purpose is to streamline and automate the brokerage process through advanced AI integration.

## Business Model (WHITE-LABEL OPERATION)

**SAINT VISION GROUP = THE BROKERAGE (Client-Facing A-Z Service):**
- ✅ Application & Document Collection
- ✅ Credit Pull & Financial Analysis
- ✅ Complete Underwriting (In-House)
- ✅ Loan Approval & Structuring
- ✅ Conditions & Compliance
- ✅ Closing Documents & Final Processing
- ✅ Client owns the relationship with Saint Vision Group ONLY

**FUNDING PARTNERS = CAPITAL PROVIDERS ONLY (Backend/Internal):**
- 💰 Provide capital at the end (after SVG approval)
- 💰 Receive clean, approved packages from SVG
- 💰 Wire funds based on SVG's underwriting
- 💰 Generally white-labeled (client doesn't see them)
- 💰 Strategic shout-outs only when it adds credibility

**KEY PRINCIPLE:** Client sees "Saint Vision Group - Powered by SaintBroker™ AI" throughout entire journey. Partners are SVG's competitive advantage and backend relationships - NOT exposed to clients except in strategic cases.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The client uses Vite with React and TypeScript, styled with shadcn/ui and Tailwind CSS. It's a single-page application using Wouter for routing and TanStack Query for server state. Key components include layouts, chat interfaces, dashboards, AI assistant feedback, and brokerage service pages with integrated GHL lead capture forms.

### Backend
The server is built with Express.js and TypeScript, following a RESTful API design. It features a storage layer (in-memory for easy migration), a service layer for AI, CRM, and brain ingestion, a Godmode executor for administrative tasks, and a route layer for API management. It integrates with Vite for development and serves static files in production.

### Data Storage
PostgreSQL is used for data persistence with Drizzle ORM, supporting full schema management for users, conversations, knowledge base, logging, and activity tracking. It includes automatic migrations and environment-configured connection pooling.

### Authentication and Authorization
The system uses session-based authentication with tiered user access (free, pro, enterprise) managed via Stripe subscriptions (though Stripe payment processing is currently removed). Feature gating controls access to advanced functionalities like Godmode and unlimited knowledge base storage.

### AI Integration
SaintSal™ HACP™ technology (U.S. Patent No. 10,290,222) and Azure Cognitive Services provide core AI functionalities, including conversation management with context preservation, tone analysis, real-time voice processing (speech-to-text, text-to-speech), knowledge base content ingestion with embeddings, and response generation. The system incorporates fallback mechanisms for AI service interruptions.

### UI/UX Decisions
The platform features unified Saint Vision Group branding, real-time chat interfaces, dedicated brokerage service pages, and ROI calculators for lending and investments. It incorporates a floating SaintBroker AI assistant with an enhanced knowledge base. Navigation includes prominent "Apply Now - Pre-Qualify" buttons.

### System Design Choices
The architecture emphasizes modularity with distinct service layers. It integrates GHL for all lead capture and workflow automation, featuring an 11-stage lending pipeline with full AI agent access and real-time tracking. Security and compliance adhere to GLBA, TCPA, and SOC 2 Type II standards, with data encryption and soft credit inquiries.

## External Dependencies

### Brokerage Services
- **Real Estate Services**: AI-powered property solutions for buying, selling, and financing.
- **Business Lending**: Capital solutions from $50K to $5M with flexible terms ($5K-$50M+ through partner network).
- **Investment Suite**: Fixed 9-12% annual returns with faith-aligned strategies.
All services include GHL-integrated lead capture forms.

### Lender Partner Network (AI-Powered Routing)
Saint Vision Group operates a comprehensive funding partner network with AI-powered routing through SaintBroker™. The system automatically matches applications to the optimal lender based on loan type, amount, credit score, and urgency.

**Network Overview:**
- **13 Active Partners**: $5K to $50M+ funding range
- **AI Auto-Selection**: SaintBroker analyzes and routes to best match
- **Multiple Specialties**: MCA, Real Estate, Equipment, SBA, Startup (0% SLOC)
- **Speed Range**: 1-3 days (urgent MCA) to 30-60 days (SBA)
- **Commission**: 8-30% depending on partner and product

**Key Partners:**
1. **SVG Partner Network** (Priority 1) - MCA/Term loans, 1-3 day funding, $5K-$1.5M
2. **SVG In-House** (Priority 0) - Full underwriting, $50K-$5M, general business lending
3. **Rok Financial** - Large commercial loans, $50K-$50M
4. **Easy Street Capital** - Real estate (BRRRR/STR/AirBnB)
5. **Trinity Bay Lending** - Bridge/Fix&Flip/Construction
6. **Commercial Capital Connect** - Equipment financing
7. **Exactly Capital** - Multi-product (MCA/Equipment/Factoring/SBA)
8. **Funding Depot** - Restaurants/Brick & Mortar
9. **HB Capital** - MCA/Real Estate Investment
10. **SB Lending Source** - SBA loans
11. **ARF Financial** - Bank-backed loans/LOC
12. **Rich Mee (Torro)** - 0% SLOC for startups (700+ credit)
13. **Prime Corporate Services** - Business structure/entity formation

**AI Routing Logic:**
- Equipment loans → Commercial Capital Connect
- Real Estate → Easy Street Capital or Trinity Bay Lending
- Startup (700+ credit, <$100K) → Rich Mee (0% SLOC)
- SBA (Expansion/Acquisition, 650+ credit) → SB Lending Source
- General Business Lending ($50K-$5M) → SVG In-House first, then partners
- Working Capital/MCA → SVG Partner Network (fastest)
- Large Commercial → Rok Financial

**Configuration:** `shared/funding-partners-ai.ts` contains complete partner database and AI selection logic.

### CRM Integration
**GoHighLevel (GHL)** serves as the central automation hub for lead capture, contact synchronization, automated tagging, and workflow triggers. It manages a 12-stage lending pipeline (SVG Lending Pipeline ID: `yHjfeb4PtF19oCFb2w2d`) with full automation.

**GHL Configuration (FULLY CONFIGURED):**
- Location ID: `NgUphdsMGXpRO3h98XyG`
- Private Access Token: Configured (GHL_PRIVATE_ACCESS_TOKEN)
- Webhook Endpoint: `/api/webhooks/ghl` (listens for ContactCreate, OpportunityCreate, OpportunityStageUpdate)
- All 12 pipeline stages mapped with IDs
- All workflows configured with IDs for automatic triggers

**Automation Flow:**
1. Lead submission → Contact created in GHL
2. Opportunity created → Assigned to pipeline stage
3. GHL webhook → Stage change detected
4. Workflow auto-triggered → SMS/Email sent
5. Zero manual intervention required

### AI Services
**OpenAI API**: Provides core intelligence using GPT-4o for chat, tone detection, and content processing.
**Azure Speech**: Powers speech-to-text and text-to-speech functionalities.

### Database
**Neon PostgreSQL (Serverless)**: Used for all persistent data storage, including contacts, opportunities, AI classifications, and chat messages.

### Communication Systems
- **Email**: `saints@hacp.ai` for AI-generated communications; `support@cookin.io` for support and alerts.
- **SMS/Phone**: GoHighLevel built-in SMS via `+1 (949) 755-0720`.

### Development Tools
- **Vite**: Build tool.
- **Drizzle ORM**: Type-safe database operations.
- **TanStack Query**: API state management.
- **shadcn/ui**: Component library.

### Infrastructure
Designed for deployment on **Replit Autoscale** with custom domain support (saintvisiongroup.com).