# Saint Vision Group - Client Hub Knowledge Base
## Complete Reference for SaintBroker AI Assistant

---

## 🔗 CRITICAL ENDPOINTS & LINKS

### **Primary Application & Onboarding**
- **Apply Now (Full Application)**: `/pricing` or `https://saintvisiongroup.com/apply-now/`
- **Credit Pull Authorization**: `https://www.myscoreiq.com/get-fico-max.aspx?offercode=4321396P`
- **Discovery Call Scheduling**: `https://calendly.com/ryan-stvisiongroup`
- **Real Estate Investing Portal**: `https://saintvisiongroup.com/real-estate-investing/`

### **GoHighLevel (GHL) Integration Endpoints**
- **Lead Capture API**: `/api/ghl/lead-capture` (POST)
- **Webhook Handler**: `/api/ghl/webhook` (POST)
- **Contact Sync**: `/api/ghl/sync-contact` (POST)

### **Platform Routes**
- **Dashboard**: `/dashboard`
- **Lending Services**: `/lending`
- **Real Estate**: `/real-estate`
- **Investments**: `/investments`
- **PartnerTech CRM**: `/partnertech`
- **CRM WorkCenter**: `/crm`
- **Client Portal**: `/audit-service`

---

## 📊 ROI CALCULATORS - EXACT FORMULAS

### **1. Mortgage/Loan Payment Calculator**
**Purpose**: Calculate monthly mortgage payments accurately

**Formula**:
```javascript
function calculateMortgage(loanAmount, loanTermYears, annualInterestRate) {
  // Convert annual rate to monthly rate (as decimal)
  const monthlyRate = (annualInterestRate / 100) / 12;
  
  // Total number of payments
  const numberOfPayments = loanTermYears * 12;
  
  // Calculate compound factor
  const compoundFactor = Math.pow(1 + monthlyRate, numberOfPayments);
  
  // Monthly payment formula
  const monthlyPayment = (loanAmount * monthlyRate * compoundFactor) / (compoundFactor - 1);
  
  return monthlyPayment;
}
```

**Validation**:
- Must check: `!isNaN(monthlyPayment) && monthlyPayment !== Infinity && monthlyPayment !== -Infinity && monthlyPayment > 0`
- Display: `$${monthlyPayment.toFixed(2)}`

**Example**:
- Loan Amount: $500,000
- Term: 30 years
- Rate: 9%
- Result: ~$4,023/month

---

### **2. Investment ROI Calculator**
**Purpose**: Calculate fixed returns on investment principal

**Formula**:
```javascript
function calculateInvestmentROI(principal, annualRate, termYears) {
  // Annual return
  const annualReturn = principal * (annualRate / 100);
  
  // Monthly return
  const monthlyReturn = annualReturn / 12;
  
  // Total return over term
  const totalReturn = annualReturn * termYears;
  
  // Final value
  const finalValue = principal + totalReturn;
  
  return {
    annualReturn,
    monthlyReturn,
    totalReturn,
    finalValue,
    roi: (totalReturn / principal) * 100
  };
}
```

**Saint Vision Group Fixed Returns**:
- **Rate Range**: 9-12% annually
- **Minimum Investment**: Varies by tier
- **Payment Frequency**: Monthly distributions
- **Faith-Aligned**: Christian business values integrated

**Example**:
- Principal: $100,000
- Rate: 10% annually
- Term: 5 years
- Annual Return: $10,000
- Monthly Return: $833.33
- Total Return: $50,000
- Final Value: $150,000
- ROI: 50%

---

### **3. Rent Estimate Calculator**
**Purpose**: Estimate rental income for real estate investments

**API Integration**: RentCast API
**Endpoint**: `https://api.rentcast.io/v1/estimates`

**Implementation**:
```javascript
async function getRentEstimate(propertyAddress) {
  const apiKey = process.env.RENTCAST_API_KEY;
  const url = `https://api.rentcast.io/v1/estimates?address=${encodeURIComponent(propertyAddress)}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: { "X-Api-Key": apiKey }
  });
  
  const data = await response.json();
  return data.estimated_rent; // Returns monthly rent estimate
}
```

---

## 📋 FULL LENDING APPLICATION PROCESS

### **Step-by-Step Client Journey**

#### **Step 1: Initial Inquiry**
- Client visits landing page or specific service page
- Completes initial contact form or pre-qualification
- **Auto-capture**: Lead sent to GHL via `/api/ghl/lead-capture`

#### **Step 2: Credit Authorization**
- Client redirected to: `https://www.myscoreiq.com/get-fico-max.aspx?offercode=4321396P`
- **MyScoreIQ**: Soft pull for pre-qualification (no credit impact)
- Credit data flows back to GHL via webhook

#### **Step 3: Discovery Call**
- Scheduled via: `https://calendly.com/ryan-stvisiongroup`
- **Automated**: Calendly webhooks trigger GHL workflow
- Tags added: `discovery-scheduled`, `high-intent`

#### **Step 4: Full Application**
- Access via `/pricing` (converted to pre-qual app)
- **Required Fields**:
  - Personal Info (name, email, phone)
  - Business Info (name, structure, industry, years, revenue)
  - Loan Details (amount, purpose, timeframe)
  - Credit Score range (optional)
  - Collateral availability

#### **Step 5: Document Upload**
- Bank statements (3-6 months)
- Tax returns (2 years for businesses)
- Business financials (P&L, balance sheet)
- **Future**: Integrate document upload endpoint

#### **Step 6: Underwriting & Approval**
- 24-48 hour decision timeline
- AI-powered risk assessment
- **Communication**: Automated via GHL email/SMS sequences

#### **Step 7: Funding**
- Wire transfer or ACH
- Funds available within 3-5 business days
- **Rates**: Starting at 9%, competitive terms

---

## 🎯 GHL AUTOMATION WORKFLOWS

### **Lead Capture Form Fields**
```javascript
{
  firstName: string,
  lastName: string,
  email: string (required),
  phone: string (required),
  businessName: string,
  businessType: string,
  industry: string,
  yearsInBusiness: string,
  annualRevenue: string,
  loanAmount: string,
  loanPurpose: string,
  timeframe: string,
  creditScore: string,
  hasCollateral: string,
  additionalNotes: string,
  service: 'lending' | 'real-estate' | 'investments',
  source: string, // form identifier
  type: string // inquiry type
}
```

### **Custom Fields in GHL**
- `loan_amount`
- `loan_purpose`
- `business_revenue`
- `years_in_business`
- `credit_score_range`
- `collateral_type`
- `service_type`
- `lead_source`
- `inquiry_type`

### **Pipeline Stages**
1. **New Lead** → Initial inquiry captured
2. **Credit Authorized** → Soft pull completed
3. **Discovery Scheduled** → Call booked
4. **Application Submitted** → Full app received
5. **Under Review** → Underwriting in progress
6. **Approved** → Ready to fund
7. **Funded** → Loan disbursed
8. **Active Client** → Ongoing relationship

### **Automated Tags**
- Service tags: `lending`, `real-estate`, `investments`
- Intent tags: `hot-lead`, `warm-lead`, `cold-lead`
- Stage tags: `pre-qualified`, `application-pending`, `approved`
- Source tags: `website`, `referral`, `paid-ad`

---

## 💼 LENDING PRODUCTS & RATES

### **Commercial Lending**
- **Amount**: $50K - $5M
- **Rates**: Starting at 9%
- **Terms**: 6 months - 25 years
- **Use Cases**:
  - Working capital
  - Equipment financing
  - Commercial real estate
  - Business expansion
  - Debt consolidation
  - Bridge loans

### **Real Estate Financing**
- **Amount**: $100K - $10M+
- **Rates**: 9-12% (competitive)
- **Products**:
  - Fix & Flip loans
  - DSCR loans (no income verification)
  - Bridge financing
  - Cash-out refinance
  - Investment property loans

### **Investment Suite**
- **Returns**: Fixed 9-12% annually
- **Minimum**: Varies by product
- **Payment**: Monthly distributions
- **Security**: Asset-backed investments
- **Values**: Faith-aligned Christian principles

---

## 🛠️ TECHNICAL INTEGRATION

### **Frontend Calculators**
All calculators should be interactive React components with:
- Real-time calculation on input change
- Input validation and error handling
- Clear visual presentation of results
- Mobile-responsive design
- Integration with GHL lead capture

### **Backend API Structure**
```javascript
// Lead Capture
POST /api/ghl/lead-capture
Body: {
  ...formData,
  service: 'lending' | 'real-estate' | 'investments',
  source: string,
  type: string
}
Response: { success: boolean, leadId: string }

// Webhook Handler  
POST /api/ghl/webhook
Body: GHL webhook payload
Response: { received: true }

// Contact Sync
POST /api/ghl/sync-contact
Body: { contactId: string, updates: object }
Response: { success: boolean }
```

### **Environment Variables Required**
```
GHL_API_KEY=xxx
GHL_LOCATION_API_KEY=xxx
GHL_LOCATION_ID=xxx
GHL_LOCATION_KEY=xxx
GHL_PRIVATE_TOKEN=xxx
RENTCAST_API_KEY=xxx (for rent calculator)
```

---

## 📚 SAINTBROKER AI ASSISTANT - RESPONSE GUIDELINES

### **When asked about applications:**
"To get started with Saint Vision Group, here's your pathway:

1. **Pre-Qualify Now**: Complete our quick pre-qualification form at [link to /pricing]
2. **Credit Check**: Authorize a soft credit pull (no impact to score) at https://www.myscoreiq.com/get-fico-max.aspx?offercode=4321396P
3. **Discovery Call**: Schedule time with our team at https://calendly.com/ryan-stvisiongroup

Our AI-powered process delivers decisions in 24-48 hours with competitive rates starting at 9%."

### **When asked about calculations:**
"Let me help you calculate that! [Use appropriate calculator]

For a [loan amount] at [rate]% over [term] years:
- Monthly Payment: $[calculated]
- Total Interest: $[calculated]
- Total Cost: $[calculated]

Ready to move forward? I can start your pre-qualification right now!"

### **When asked about rates/terms:**
"Saint Vision Group offers competitive financing:

**Commercial Lending**: $50K-$5M at rates starting at 9%
**Real Estate**: $100K-$10M+ with flexible terms
**Investments**: Fixed 9-12% annual returns

What specific financing are you exploring? I can provide personalized calculations and start your application."

### **When asked about process/timeline:**
"Here's our streamlined timeline:

✅ Pre-Qualification: 5 minutes
✅ Credit Check: Same day  
✅ Discovery Call: Next available slot
✅ Full Application: 15-20 minutes
✅ Decision: 24-48 hours
✅ Funding: 3-5 business days

We've automated the entire process with HACP™ technology for maximum speed and accuracy. Ready to begin?"

---

## 🔐 SECURITY & COMPLIANCE

- All credit pulls are soft inquiries (no credit score impact)
- Data encrypted in transit and at rest
- GLBA compliant for financial data
- TCPA compliant for communications
- SOC 2 Type II certified infrastructure
- Faith-aligned Christian business practices

---

## 📞 CONTACT & SUPPORT

- **Main Site**: https://saintvisiongroup.com
- **Discovery Calls**: https://calendly.com/ryan-stvisiongroup  
- **Email**: info@saintvisiongroup.com
- **Emergency**: Use SaintBroker AI for 24/7 instant assistance

---

*This knowledge base is the complete reference for the Saint Vision Group AI Brokerage Platform. SaintBroker should use this to answer ALL client questions with accuracy, provide calculations, and guide users through the complete application process.*

**Last Updated**: October 2025
**Platform**: CookinKnowledge-101-SaintSal + Saint Vision Group Integration
**Technology**: HACP™ Patent-Protected AI Automation
