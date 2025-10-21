# GoHighLevel (GHL) Integration Guide
## Saint Vision Group - Client Hub Complete Integration

---

## 📋 Overview

This guide documents the complete GoHighLevel integration built for the Saint Vision Group Client Hub. The system enables seamless form submissions, lead management, application tracking, portfolio management, and AI-powered document analysis.

**Key Features:**
- ✅ GHL form submissions with field mapping
- ✅ Automated lead creation and pipeline management
- ✅ Real-time application status tracking
- ✅ Portfolio management with returns calculation
- ✅ AI-powered document preview (Gemini/Azure Vision)
- ✅ SaintBroker AI chat integration
- ✅ Comprehensive Client Hub dashboard

---

## 🔧 Architecture Overview

### Frontend Components
1. **useGHLSubmit Hook** - Handles form submissions to GHL
2. **useGHLData Hook** - Fetches applications, portfolio, and contact data
3. **useDocumentVision Hook** - AI-powered document analysis
4. **GHL Form Components** - Pre-built form components with validation
5. **Client Hub Dashboard** - Central dashboard for clients

### Backend Services
1. **GHL Client Service** (`server/services/ghl-client.ts`) - GHL API wrapper
2. **GHL Data Routes** (`server/routes/ghl-data.ts`) - Application/portfolio endpoints
3. **Vision Routes** (`server/routes/vision.ts`) - Document analysis endpoints
4. **GHL Forms Routes** (`server/routes/ghl-forms.ts`) - Form submission endpoints

### Configuration Files
1. **GHL Forms Config** (`client/src/config/ghl-forms.ts`) - Form definitions and field mappings

---

## 🚀 Implementation Details

### 1. GHL Form Configuration

**File:** `client/src/config/ghl-forms.ts`

Defines form types and field mappings:
```typescript
export enum GHLFormType {
  PRE_QUAL = 'pre-qual',
  FULL_APPLICATION = 'full-application',
  DOCUMENT_UPLOAD = 'document-upload',
  INVESTMENT = 'investment',
  REAL_ESTATE = 'real-estate',
  SVT_REGISTRATION = 'svt-registration',
  MORTGAGE = 'mortgage',
}
```

Each form includes:
- Form ID (from GHL)
- Field mappings (local field name → GHL field name)
- Required/optional fields
- Field types and validation rules

**How it works:**
1. User fills out a form with local field names
2. `mapFormDataToGHL()` converts to GHL field names
3. Data submitted to GHL API endpoint

### 2. Form Submission Hook

**File:** `client/src/hooks/useGHLSubmit.ts`

Usage:
```typescript
const { submit, isLoading, error } = useGHLSubmit();

const result = await submit(
  GHLFormType.PRE_QUAL,
  formData,
  {
    showToast: true,
    onSuccess: (response) => {
      console.log('Form submitted!', response);
    }
  }
);
```

Features:
- Automatic field validation
- Field mapping to GHL names
- Error handling with user-friendly messages
- Toast notifications
- Progress tracking

### 3. Data Fetching Hook

**File:** `client/src/hooks/useGHLData.ts`

Fetches GHL data for the Client Hub:
```typescript
const { applications, isLoading } = useGHLApplications(userId);
const { portfolio, isLoading: portfolioLoading } = useGHLPortfolio(userId);
```

Includes:
- Application status tracking
- Portfolio management
- Contact information
- React Query integration for caching

### 4. Document Vision Integration

**File:** `client/src/hooks/useDocumentVision.ts`

Analyzes documents using Gemini or Azure Vision:
```typescript
const { analyzeDocument, isAnalyzing } = useDocumentVision();

const analysis = await analyzeDocument(file);
// Returns: {
//   documentType: 'Tax Return',
//   status: 'valid',
//   confidence: 85,
//   summary: '...',
//   keyFields: [...],
//   issues: [],
//   recommendations: []
// }
```

### 5. Client Hub Dashboard

**File:** `client/src/pages/client-hub.tsx`

Main features:
- **Dashboard Tab:** Pending applications, portfolio overview, quick actions
- **Applications Tab:** View all applications with status tracking
- **Funding/Portfolio Tab:** Investments, deals, returns analysis
- **Documents:** File management with AI preview capabilities
- **SaintBroker AI:** Integrated chat assistant

---

## 📝 Form Components

### Pre-Qualification Form

**File:** `client/src/components/forms/ghl-prequal-form.tsx`

A complete pre-qualification form with:
- Personal information
- Business details
- Funding request
- Credit & collateral assessment
- Form validation
- Progress tracking
- Success confirmation

Usage:
```typescript
import GHLPreQualForm from '@/components/forms/ghl-prequal-form';

<GHLPreQualForm
  onSuccess={(data) => console.log(data)}
  onError={(error) => console.error(error)}
  embedded={false}
/>
```

---

## 🔌 Backend API Endpoints

### GHL Data Endpoints

#### GET `/api/ghl/opportunities`
Fetch user's applications/opportunities

Response:
```json
{
  "success": true,
  "opportunities": [
    {
      "id": "opp_123",
      "name": "Equipment Loan",
      "status": "in-review",
      "type": "lending",
      "value": 500000,
      "progress": 50,
      "stageName": "Under Review"
    }
  ]
}
```

#### GET `/api/ghl/portfolio`
Fetch user's portfolio and investments

Response:
```json
{
  "success": true,
  "portfolio": [
    {
      "id": "port_123",
      "name": "Commercial Real Estate",
      "type": "deal",
      "value": 1000000,
      "status": "active",
      "returnRate": 10,
      "monthlyReturn": 8333.33
    }
  ],
  "totalValue": 1000000,
  "totalMonthlyReturn": 8333.33
}
```

#### GET `/api/ghl/contact/:userId`
Fetch contact details

#### GET `/api/ghl/pipelines`
Fetch available pipelines

### Form Submission Endpoints

#### POST `/api/ghl-forms/submit`
Submit a form and create a lead

```json
{
  "formType": "pre-qual",
  "formData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    ...
  }
}
```

Response:
```json
{
  "success": true,
  "leadId": "contact_123",
  "applicationId": "opp_456",
  "message": "Form submitted successfully"
}
```

#### POST `/api/ghl-forms/validate`
Validate form data before submission

#### POST `/api/ghl-forms/save-draft`
Save form as draft (requires authentication)

#### GET `/api/ghl-forms/draft/:draftId`
Retrieve a saved draft

### Vision Analysis Endpoints

#### POST `/api/vision/analyze-document`
Analyze a document using AI

```json
{
  "document": "base64_encoded_image",
  "documentType": "tax_return"
}
```

Response:
```json
{
  "documentType": "Tax Return",
  "status": "valid",
  "confidence": 85,
  "summary": "2024 Tax Return for John Doe",
  "keyFields": [...],
  "issues": [],
  "recommendations": []
}
```

#### POST `/api/vision/extract-text`
Extract text from document

#### POST `/api/vision/validate-document`
Validate document matches expected type

---

## ⚙️ Environment Variables

Required environment variables for GHL integration:

```bash
# GHL API Configuration
GHL_API_KEY=<your_ghl_api_key>
GHL_LOCATION_ID=<your_ghl_location_id>
GHL_LOCATION_KEY=<your_ghl_location_key>
GHL_PRIVATE_TOKEN=<your_ghl_private_token>
GHL_PRIVATE_ACCESS_TOKEN=<your_ghl_private_access_token>

# Webhook Configuration
GHL_WEBHOOK_SECRET=<your_webhook_secret>

# Workflows
GHL_WELCOME_WORKFLOW_ID=<your_welcome_workflow_id>

# Vision AI (choose one)
GEMINI_API_KEY=<your_gemini_api_key>
# OR
AZURE_VISION_KEY=<your_azure_vision_key>
AZURE_VISION_ENDPOINT=<your_azure_vision_endpoint>

# Other
FRONTEND_URL=https://saintvisionai.com
```

---

## 🔐 Setting Up GHL Form IDs

To connect your GHL forms:

1. **In GHL Admin Console:**
   - Create or find your form
   - Copy the Form ID
   - Note all custom field names

2. **In `.env` file:**
   ```bash
   REACT_APP_GHL_PREQUAL_FORM_ID=<form_id>
   REACT_APP_GHL_APPLICATION_FORM_ID=<form_id>
   # etc...
   ```

3. **Update Form Config:**
   Update `client/src/config/ghl-forms.ts` with your field mappings

4. **Test Form Submission:**
   Use the Pre-Qual form to verify integration works

---

## 📊 Field Mapping Examples

### Pre-Qualification Form Mapping

| Frontend Field | GHL Field Name | Type | Required |
|---|---|---|---|
| firstName | first_name | text | Yes |
| lastName | last_name | text | Yes |
| email | email | email | Yes |
| phone | phone | phone | Yes |
| businessName | business_name | text | No |
| loanAmount | loan_amount | text | No |
| serviceType | service_type | select | Yes |
| creditScore | credit_score_range | select | No |

Custom mappings can be added in `ghl-forms.ts` for each form type.

---

## 🔄 Data Flow

### Application Submission Flow

```
User fills form
    ↓
useGHLSubmit validates data
    ↓
Field mapping to GHL names
    ↓
POST /api/ghl-forms/submit
    ↓
Backend processes with GHL SDK
    ↓
createContact() → creates GHL contact
    ↓
createOpportunity() → creates application
    ↓
triggerWorkflow() → sends welcome email/SMS
    ↓
Client receives confirmation
```

### Data Fetching Flow

```
Client Hub Dashboard mounts
    ↓
useGHLApplications() called
    ↓
GET /api/ghl/opportunities
    ↓
Backend calls getOpportunitiesByContact()
    ↓
Transforms GHL data to applications format
    ↓
React Query caches for 5 minutes
    ↓
Dashboard displays pending apps
```

---

## 🎨 UI Components

### Pre-Qual Form Component
- Location: `client/src/components/forms/ghl-prequal-form.tsx`
- Status: Complete with validation, progress tracking, success confirmation

### Document Vision Component
- Location: `client/src/components/ai/document-vision-preview.tsx`
- Features: Multi-tab interface (Summary, Fields, Issues, Raw Data)

### Client Hub Dashboard
- Location: `client/src/pages/client-hub.tsx`
- Sections: Dashboard, Applications, Portfolio, Documents, Settings

---

## 🧪 Testing

### Test Pre-Qual Submission
1. Navigate to Client Hub
2. Go to "Applications" tab
3. Click "Start New Application"
4. Fill out Pre-Qual form
5. Submit and verify:
   - GHL creates contact
   - Opportunity is created
   - Client receives confirmation
   - Lead appears in GHL account

### Test Data Fetching
1. Go to Client Hub Dashboard
2. Verify "Pending Applications" section loads
3. Verify "Your Portfolio" section loads
4. Check counts and values are displayed

### Test Document Vision
1. In Workspace Files section
2. Click "Preview" on any file
3. Click "Analyze with Gemini/Azure"
4. Verify document analysis appears

---

## 🚨 Troubleshooting

### Form not submitting
- ✓ Check GHL_API_KEY and FORM_ID are set
- ✓ Verify field mappings match GHL custom fields
- ✓ Check browser console for specific error
- ✓ Test with `/api/ghl-forms/validate` endpoint first

### Applications not loading
- ✓ Verify GHL_API_KEY is valid
- ✓ Check user has opportunities in GHL
- ✓ Check React Query is caching data
- ✓ Look for CORS errors in network tab

### Vision analysis not working
- ✓ Set either GEMINI_API_KEY or AZURE_VISION_KEY
- ✓ Verify API key is valid
- ✓ Check that document is a valid image
- ✓ Review backend logs for specific error

---

## 🔄 Updates & Maintenance

### Field Mapping Changes
If GHL custom fields change:
1. Update `client/src/config/ghl-forms.ts`
2. Update form component if needed
3. Test form submission

### Adding New Form Types
1. Add form type to `GHLFormType` enum
2. Create form config in `GHL_FORM_CONFIGS`
3. Create corresponding form component (optional)
4. Add route in Client Hub navigation

### API Updates
If GHL API changes:
1. Update `server/services/ghl-client.ts`
2. Update affected route handlers
3. Test all form submissions and data fetching

---

## 📞 Support

For issues or questions:
1. Check this guide for solution
2. Review browser console for errors
3. Check backend logs
4. Contact GHL support if API-specific issue

---

## ✅ Checklist for Full Implementation

- [ ] Set all GHL environment variables
- [ ] Get all GHL Form IDs from your account
- [ ] Map all custom field names in `ghl-forms.ts`
- [ ] Test pre-qual form submission
- [ ] Test data fetching in Client Hub
- [ ] Configure vision API (Gemini or Azure)
- [ ] Test document analysis
- [ ] Set up GHL webhooks (optional)
- [ ] Configure welcome workflow (optional)
- [ ] Train team on Client Hub usage

---

*Last Updated: January 2025*
*Version: 1.0*
*Status: Production Ready*
