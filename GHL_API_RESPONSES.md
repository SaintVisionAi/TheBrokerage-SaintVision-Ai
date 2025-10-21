# GHL Integration API Response Types & Examples

Complete reference for all API endpoints, request/response formats, and data types.

---

## 📋 Table of Contents

1. [GHL Data Endpoints](#ghl-data-endpoints)
2. [GHL Forms Endpoints](#ghl-forms-endpoints)
3. [Vision Endpoints](#vision-endpoints)
4. [Type Definitions](#type-definitions)
5. [Error Responses](#error-responses)

---

## 🔗 GHL Data Endpoints

### GET `/api/ghl/opportunities`

Fetch user's applications and opportunities from GHL.

**Authentication:** Required (Bearer token or session)

**Response:**
```json
{
  "success": true,
  "opportunities": [
    {
      "id": "opp_abc123",
      "name": "Equipment Loan - Restaurant Supply",
      "status": "in-review",
      "type": "lending",
      "value": 500000,
      "loanAmount": "$500,000",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z",
      "stageName": "Under Review",
      "progress": 50
    },
    {
      "id": "opp_def456",
      "name": "Commercial Real Estate - Property",
      "status": "approved",
      "type": "real-estate",
      "value": 2000000,
      "loanAmount": "$2,000,000",
      "createdAt": "2024-01-10T09:00:00Z",
      "updatedAt": "2024-01-19T16:20:00Z",
      "stageName": "Ready to Fund",
      "progress": 80
    }
  ],
  "count": 2
}
```

**TypeScript Type:**
```typescript
interface GHLOpportunityResponse {
  success: boolean;
  opportunities: GHLApplication[];
  count: number;
}

interface GHLApplication {
  id: string;
  name: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'funded';
  type: 'lending' | 'real-estate' | 'investment' | 'mortgage';
  value: number;
  loanAmount: string;
  createdAt: string;
  updatedAt: string;
  stageName: string;
  progress: number;
}
```

---

### GET `/api/ghl/contact/:userId`

Fetch contact details from GHL.

**Parameters:**
- `userId` (path) - The user's ID

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": "contact_xyz789",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "tags": [
      "pre-qualified",
      "lending",
      "high-value"
    ],
    "customFields": {
      "loan_amount": "$500,000",
      "credit_score_range": "excellent",
      "years_in_business": "5"
    }
  }
}
```

---

### GET `/api/ghl/portfolio`

Fetch user's portfolio including investments and funded deals.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "portfolio": [
    {
      "id": "inv_001",
      "name": "Commercial Real Estate Fund",
      "type": "investment",
      "value": 1000000,
      "status": "active",
      "returnRate": 10,
      "monthlyReturn": 8333.33,
      "startDate": "2024-01-01T00:00:00Z",
      "documents": ["deed.pdf", "appraisal.pdf"]
    },
    {
      "id": "deal_002",
      "name": "Equipment Financing Deal",
      "type": "deal",
      "value": 500000,
      "status": "active",
      "returnRate": 12,
      "monthlyReturn": 5000,
      "startDate": "2024-01-05T00:00:00Z",
      "documents": ["equipment_list.pdf"]
    }
  ],
  "totalValue": 1500000,
  "totalMonthlyReturn": 13333.33
}
```

**TypeScript Type:**
```typescript
interface PortfolioResponse {
  success: boolean;
  portfolio: PortfolioItem[];
  totalValue: number;
  totalMonthlyReturn: number;
}

interface PortfolioItem {
  id: string;
  name: string;
  type: 'investment' | 'deal' | 'property';
  value: number;
  status: 'active' | 'completed' | 'pending';
  returnRate?: number;
  monthlyReturn?: number;
  startDate: string;
  documents: string[];
}
```

---

### GET `/api/ghl/pipelines`

Fetch available pipelines from GHL.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "pipelines": [
    {
      "id": "pipe_lending",
      "name": "Commercial Lending Pipeline",
      "stages": [
        {
          "id": "stage_1",
          "name": "New Lead",
          "order": 1
        },
        {
          "id": "stage_2",
          "name": "Pre-Qualified",
          "order": 2
        },
        {
          "id": "stage_3",
          "name": "Under Review",
          "order": 3
        },
        {
          "id": "stage_4",
          "name": "Approved",
          "order": 4
        },
        {
          "id": "stage_5",
          "name": "Funded",
          "order": 5
        }
      ]
    },
    {
      "id": "pipe_realestate",
      "name": "Real Estate Pipeline",
      "stages": [
        {
          "id": "stage_re1",
          "name": "Inquiry",
          "order": 1
        }
      ]
    }
  ]
}
```

---

### POST `/api/ghl/sync-contact`

Sync/update contact information with GHL.

**Authentication:** Required

**Request Body:**
```json
{
  "updates": {
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1-555-987-6543",
    "tags": ["updated", "qualified"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact synced successfully"
}
```

---

## 📝 GHL Forms Endpoints

### POST `/api/ghl-forms/submit`

Submit a form and create a lead in GHL.

**Request Body:**
```json
{
  "formType": "pre-qual",
  "formData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-123-4567",
    "businessName": "Doe's Restaurant",
    "businessType": "llc",
    "industry": "Food Service",
    "yearsInBusiness": "3",
    "annualRevenue": "$500,000",
    "loanAmount": "$100,000",
    "loanPurpose": "Equipment Purchase",
    "creditScore": "excellent",
    "hasCollateral": "yes",
    "serviceType": "lending",
    "additionalNotes": "Looking to expand kitchen"
  }
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "contact_abc123",
  "applicationId": "opp_def456",
  "message": "Form submitted successfully and lead created in GHL"
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "errors": {
    "email": "Invalid email address",
    "phone": "Phone number must be at least 10 digits"
  }
}
```

---

### POST `/api/ghl-forms/validate`

Validate form data without submitting.

**Request Body:**
```json
{
  "formType": "pre-qual",
  "formData": {
    "firstName": "",
    "lastName": "Doe",
    "email": "invalid-email",
    "loanAmount": "$5,000"
  }
}
```

**Response:**
```json
{
  "valid": false,
  "errors": {
    "firstName": "firstName is required",
    "email": "Invalid email address",
    "loanAmount": "Loan amount must be between $50K and $10M"
  }
}
```

---

### POST `/api/ghl-forms/save-draft`

Save form as draft for later completion.

**Authentication:** Required

**Request Body:**
```json
{
  "formType": "full-application",
  "formData": {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "draftId": "draft_1705768800000",
  "message": "Draft saved successfully"
}
```

---

### GET `/api/ghl-forms/draft/:draftId`

Retrieve a previously saved draft.

**Parameters:**
- `draftId` (path) - The draft ID from save-draft endpoint

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "draft": {
    "formType": "full-application",
    "formData": {
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com"
    },
    "savedAt": "2024-01-20T10:00:00Z",
    "lastModified": "2024-01-20T10:30:00Z"
  }
}
```

---

## 🎯 Vision Endpoints

### POST `/api/vision/analyze-document`

Analyze a document using AI vision (Gemini or Azure).

**Request Body:**
```json
{
  "document": "base64_encoded_image_data_here",
  "documentType": "tax_return"
}
```

**Response:**
```json
{
  "documentType": "Tax Return",
  "status": "valid",
  "confidence": 92,
  "summary": "2024 Tax Return (Form 1040) for John Doe. Annual income: $150,000. Filed: January 2025.",
  "keyFields": [
    {
      "label": "Tax Year",
      "value": "2024"
    },
    {
      "label": "Filing Status",
      "value": "Married Filing Jointly"
    },
    {
      "label": "Adjusted Gross Income",
      "value": "$150,000"
    },
    {
      "label": "Total Tax",
      "value": "$28,500"
    }
  ],
  "issues": [],
  "recommendations": [
    "Document is clear and readable",
    "All key fields are present",
    "Ready for processing"
  ],
  "extractedData": {
    "documentType": "Tax Return",
    "taxYear": 2024,
    "filingStatus": "married_filing_jointly",
    "agi": 150000,
    "totalTax": 28500
  }
}
```

**Error Response (400):**
```json
{
  "error": "Document analysis failed",
  "message": "Vision service not configured. Please set GEMINI_API_KEY or AZURE_VISION_KEY"
}
```

**TypeScript Type:**
```typescript
interface DocumentAnalysis {
  documentType: string;
  status: 'valid' | 'invalid' | 'warning' | 'unknown';
  confidence: number;
  summary: string;
  keyFields: Array<{
    label: string;
    value: string;
  }>;
  issues: string[];
  recommendations: string[];
  extractedData: Record<string, any>;
}
```

---

### POST `/api/vision/extract-text`

Extract all text from a document.

**Request Body:**
```json
{
  "document": "base64_encoded_image_data_here"
}
```

**Response:**
```json
{
  "text": "Full extracted text from the document here...\nMultiple lines of text...\nAll content from image"
}
```

---

### POST `/api/vision/validate-document`

Validate that a document matches the expected type.

**Request Body:**
```json
{
  "document": "base64_encoded_image_data_here",
  "expectedType": "bank_statement"
}
```

**Response:**
```json
{
  "isValid": true,
  "detectedType": "Bank Statement",
  "confidence": 88,
  "status": "valid"
}
```

---

## 📊 Type Definitions

### Form Type Enum

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

### Application Status

```typescript
type ApplicationStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'funded';
type ApplicationType = 'lending' | 'real-estate' | 'investment' | 'mortgage';
```

### Portfolio Status

```typescript
type PortfolioStatus = 'active' | 'completed' | 'pending';
type PortfolioType = 'investment' | 'deal' | 'property';
```

### Vision Status

```typescript
type VisionStatus = 'valid' | 'invalid' | 'warning' | 'unknown';
type DocumentType = 'tax_return' | 'bank_statement' | 'government_id' | 'utility_bill' | 'contract' | 'unknown';
```

---

## ❌ Error Responses

### 400 - Bad Request

```json
{
  "error": "Missing required fields",
  "details": "formType and formData are required"
}
```

### 401 - Unauthorized

```json
{
  "error": "User not authenticated",
  "message": "Please log in to access this resource"
}
```

### 403 - Forbidden

```json
{
  "error": "Unauthorized",
  "message": "You cannot access another user's data"
}
```

### 500 - Server Error

```json
{
  "error": "Form submission failed",
  "message": "GHL API returned an error: invalid_form_id"
}
```

---

## 📈 Usage Examples

### Example 1: Submit Pre-Qual Form

```bash
curl -X POST http://localhost:5000/api/ghl-forms/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "formType": "pre-qual",
    "formData": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-123-4567",
      "loanAmount": "$100,000",
      "serviceType": "lending"
    }
  }'
```

### Example 2: Fetch Applications

```bash
curl -X GET http://localhost:5000/api/ghl/opportunities \
  -H "Authorization: Bearer your_token_here"
```

### Example 3: Analyze Document

```bash
# First, convert image to base64
base64 -i document.jpg > document.b64

curl -X POST http://localhost:5000/api/vision/analyze-document \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "document": "'"$(cat document.b64)"'",
    "documentType": "tax_return"
  }'
```

---

## 🔄 Request/Response Format

### Standard Request Headers

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

### Standard Response Format

**Success (200):**
```json
{
  "success": true,
  "data": {...}
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error type",
  "message": "Human readable message",
  "details": {...}
}
```

---

## ⏱️ Rate Limiting

- **Limits:** 100 requests per minute per API key
- **Headers:**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 87`
  - `X-RateLimit-Reset: 1705770000`

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All currency values are in cents/smallest unit
3. All IDs are prefixed with resource type (contact_, opp_, etc.)
4. Authentication uses JWT Bearer tokens
5. Endpoints require HTTPS in production

---

**Last Updated:** January 2025
**API Version:** 1.0
**Status:** Production Ready
