import { InsertLoanProduct } from './schema';

export const LOAN_PRODUCTS_DATA: InsertLoanProduct[] = [
  // WORKING CAPITAL & MCA
  {
    name: "Quick Business Advance (MCA)",
    category: "MCA",
    minAmount: 5000,
    maxAmount: 500000,
    minRate: "Factor 1.15",
    maxRate: "Factor 1.45",
    terms: "3-12 months",
    minCredit: 500,
    speedDays: 1,
    requirements: [
      "Minimum 6 months in business",
      "Minimum $10,000 monthly revenue",
      "Business bank statements (3 months)",
      "Driver's license or state ID"
    ],
    features: [
      "Funding in 24-48 hours",
      "No collateral required",
      "Daily or weekly repayment",
      "Bad credit accepted",
      "Simple application process"
    ],
    disclosures: "This is a merchant cash advance, not a loan. Factor rates apply. Daily or weekly ACH repayment required. Early payoff available with no prepayment penalty on remaining balance. Subject to underwriting approval.",
    description: "Get fast funding for immediate business needs. Perfect for inventory, payroll, or unexpected expenses. Factor rate pricing with flexible daily or weekly payments.",
    priority: 1,
    active: true
  },
  
  // TERM LOANS
  {
    name: "Business Term Loan",
    category: "Term Loan",
    minAmount: 25000,
    maxAmount: 5000000,
    minRate: "9.99%",
    maxRate: "29.99%",
    terms: "6 months - 5 years",
    minCredit: 600,
    speedDays: 3,
    requirements: [
      "Minimum 2 years in business",
      "Minimum $250,000 annual revenue",
      "Business and personal tax returns (2 years)",
      "Bank statements (6 months)",
      "Profit & Loss statement",
      "Business plan for loans over $250K"
    ],
    features: [
      "Fixed monthly payments",
      "Lower rates than MCA",
      "Build business credit",
      "Longer repayment terms",
      "Amounts up to $5 million"
    ],
    disclosures: "Annual Percentage Rate (APR) ranges from 9.99% to 29.99%. Actual rate depends on creditworthiness, business financials, and loan term. Origination fee of 2-5% may apply. Prepayment allowed without penalty after 6 months.",
    description: "Traditional business lending with competitive rates and predictable monthly payments. Ideal for expansion, equipment purchases, or working capital needs.",
    priority: 2,
    active: true
  },

  // EQUIPMENT FINANCING
  {
    name: "Equipment Financing",
    category: "Equipment",
    minAmount: 10000,
    maxAmount: 2000000,
    minRate: "6.99%",
    maxRate: "24.99%",
    terms: "1-7 years",
    minCredit: 550,
    speedDays: 5,
    requirements: [
      "Equipment quote or invoice",
      "2 years in business (or strong personal credit)",
      "Business bank statements (3 months)",
      "Personal financial statement",
      "List of equipment to be purchased"
    ],
    features: [
      "100% financing available",
      "Equipment serves as collateral",
      "Tax benefits (Section 179)",
      "Preserve working capital",
      "New and used equipment",
      "Competitive fixed rates"
    ],
    disclosures: "Equipment serves as collateral for financing. Interest rates from 6.99% to 24.99% APR. Down payment may be required based on credit. Equipment must be for business use. Title transfers upon final payment.",
    description: "Finance new or used equipment with the equipment itself as collateral. Preserve cash flow while upgrading your business assets. Section 179 tax deductions available.",
    priority: 3,
    active: true
  },

  // SBA LOANS
  {
    name: "SBA 7(a) Loan",
    category: "SBA",
    minAmount: 50000,
    maxAmount: 5000000,
    minRate: "11.5%",
    maxRate: "14.5%",
    terms: "5-25 years",
    minCredit: 680,
    speedDays: 45,
    requirements: [
      "US-based for-profit business",
      "Business and personal tax returns (3 years)",
      "Financial statements (3 years)",
      "Business plan and projections",
      "Personal financial statement (SBA Form 413)",
      "Business debt schedule",
      "Collateral documentation"
    ],
    features: [
      "Government-backed guarantee",
      "Lower down payments",
      "Longer repayment terms",
      "Lower interest rates",
      "Can be used for multiple purposes",
      "No prepayment penalties"
    ],
    disclosures: "SBA loans are partially guaranteed by the U.S. Small Business Administration. Rates are WSJ Prime + 2.75% to 5.5%. Processing time 30-90 days. Collateral and personal guarantee required. SBA guarantee fee of 2-3.75% of guaranteed portion.",
    description: "Government-backed loans with competitive rates and long terms. Perfect for business acquisition, real estate, expansion, or refinancing existing debt.",
    priority: 4,
    active: true
  },

  // REAL ESTATE - COMMERCIAL
  {
    name: "Commercial Real Estate Loan",
    category: "Real Estate",
    minAmount: 100000,
    maxAmount: 50000000,
    minRate: "7.5%",
    maxRate: "12.5%",
    terms: "5-30 years",
    minCredit: 650,
    speedDays: 30,
    requirements: [
      "Property appraisal",
      "Environmental assessment (Phase 1)",
      "Rent roll (for income properties)",
      "Operating statements (3 years)",
      "Personal financial statement",
      "20-30% down payment"
    ],
    features: [
      "Purchase or refinance",
      "Owner-occupied or investment",
      "Fixed or variable rates",
      "Interest-only options available",
      "Non-recourse options for qualified",
      "Cross-collateralization available"
    ],
    disclosures: "Secured by commercial real estate. LTV typically 70-80%. Personal guarantee usually required. Prepayment penalties may apply. Environmental and property insurance required. Subject to appraisal and underwriting.",
    description: "Finance commercial properties including office buildings, retail centers, warehouses, and multi-family properties. Competitive rates with flexible terms.",
    priority: 5,
    active: true
  },

  // REAL ESTATE - FIX & FLIP
  {
    name: "Fix & Flip / Bridge Loan",
    category: "Real Estate",
    minAmount: 50000,
    maxAmount: 3000000,
    minRate: "9.99%",
    maxRate: "15%",
    terms: "6-24 months",
    minCredit: 600,
    speedDays: 7,
    requirements: [
      "Property purchase contract",
      "Renovation budget and scope",
      "Contractor bids",
      "Exit strategy (sale or refinance)",
      "Proof of funds for down payment",
      "Real estate experience preferred"
    ],
    features: [
      "Fast closing (7-14 days)",
      "Interest-only payments",
      "Up to 90% of purchase price",
      "100% of renovation costs",
      "No prepayment penalty",
      "Draw schedule for renovations"
    ],
    disclosures: "Short-term bridge financing. Interest-only during term. Points typically 2-4%. Property serves as collateral. Borrower experience considered. Exit strategy required. Not for owner-occupied properties.",
    description: "Short-term financing for real estate investors. Quick funding for property acquisition and renovation. Interest-only payments during renovation period.",
    priority: 6,
    active: true
  },

  // LINE OF CREDIT
  {
    name: "Business Line of Credit",
    category: "Line of Credit",
    minAmount: 10000,
    maxAmount: 1000000,
    minRate: "8.99%",
    maxRate: "24.99%",
    terms: "6 months - 2 years (revolving)",
    minCredit: 600,
    speedDays: 5,
    requirements: [
      "1+ years in business",
      "Bank statements (6 months)",
      "Business tax returns",
      "$100,000+ annual revenue",
      "No recent bankruptcies"
    ],
    features: [
      "Draw funds as needed",
      "Only pay interest on what you use",
      "Revolving credit line",
      "Reusable once repaid",
      "Lower rates than MCA",
      "Build business credit"
    ],
    disclosures: "Revolving line of credit. Variable interest rate tied to Prime. Annual fee may apply. Interest charged only on outstanding balance. Personal guarantee required. Subject to periodic review.",
    description: "Flexible revolving credit line for ongoing business needs. Draw funds when needed, repay, and reuse. Perfect for managing cash flow and seasonal fluctuations.",
    priority: 7,
    active: true
  },

  // INVOICE FACTORING
  {
    name: "Invoice Factoring",
    category: "Factoring",
    minAmount: 20000,
    maxAmount: 5000000,
    minRate: "1.5%",
    maxRate: "5%",
    terms: "30-90 days (per invoice)",
    minCredit: 0,
    speedDays: 2,
    requirements: [
      "B2B invoices (no B2C)",
      "Creditworthy customers",
      "Invoices less than 90 days old",
      "No liens on receivables",
      "Verification of delivery/completion"
    ],
    features: [
      "Immediate cash (80-90% advance)",
      "No debt on balance sheet",
      "Credit based on customers, not you",
      "Outsourced collections",
      "Grows with your sales",
      "Selective factoring available"
    ],
    disclosures: "Not a loan - sale of receivables. Factor rate 1.5-5% per 30 days. Advance rate 80-90%. Customer notification may be required. Recourse or non-recourse options. UCC filing required.",
    description: "Convert unpaid invoices into immediate working capital. Get 80-90% of invoice value upfront. Your customers' credit matters more than yours.",
    priority: 8,
    active: true
  },

  // STARTUP FUNDING
  {
    name: "Startup Business Funding",
    category: "Startup",
    minAmount: 5000,
    maxAmount: 150000,
    minRate: "0%",
    maxRate: "29.99%",
    terms: "0% for 12-18 months, then variable",
    minCredit: 680,
    speedDays: 10,
    requirements: [
      "Personal credit score 680+",
      "Business plan",
      "Financial projections",
      "Personal financial statement",
      "Business entity formation docs",
      "EIN number"
    ],
    features: [
      "0% intro rates available",
      "No business history required",
      "Based on personal credit",
      "Multiple funding sources",
      "Business credit building",
      "Unsecured options"
    ],
    disclosures: "For new businesses with less than 2 years history. 0% promotional rates for qualified borrowers (12-18 months), then variable rate applies. Personal guarantee required. May involve multiple credit products.",
    description: "Funding solutions for new businesses and startups. Access capital based on personal credit strength. 0% intro rates available for qualified borrowers.",
    priority: 9,
    active: true
  },

  // ACQUISITION FINANCING
  {
    name: "Business Acquisition Loan",
    category: "Acquisition",
    minAmount: 100000,
    maxAmount: 10000000,
    minRate: "8.5%",
    maxRate: "15%",
    terms: "5-10 years",
    minCredit: 700,
    speedDays: 60,
    requirements: [
      "Letter of Intent (LOI)",
      "Target company financials (3 years)",
      "Business valuation",
      "Acquisition business plan",
      "Management team resumes",
      "10-30% down payment",
      "Due diligence documentation"
    ],
    features: [
      "Finance up to 90% of purchase",
      "Seller financing options",
      "SBA options available",
      "Earnout structuring",
      "Asset or stock purchase",
      "Advisory services included"
    ],
    disclosures: "For business or franchise acquisition. Down payment 10-30% required. Seller note may be part of structure. Personal guarantee and collateral required. Due diligence period applies. Closing costs 2-5%.",
    description: "Specialized financing for buying an existing business or franchise. Structure includes bank financing, seller notes, and earn-outs. Full advisory support included.",
    priority: 10,
    active: true
  },

  // REVENUE-BASED FINANCING
  {
    name: "Revenue-Based Financing",
    category: "Revenue Share",
    minAmount: 50000,
    maxAmount: 3000000,
    minRate: "6%",
    maxRate: "12%",
    terms: "Flexible (% of revenue)",
    minCredit: 550,
    speedDays: 10,
    requirements: [
      "$500K+ annual revenue",
      "12+ months in business",
      "Consistent monthly revenue",
      "Bank statements (12 months)",
      "Merchant processing statements"
    ],
    features: [
      "Payments flex with revenue",
      "No fixed monthly payment",
      "No personal guarantee",
      "No dilution of equity",
      "Pay more when you earn more",
      "Early buyout options"
    ],
    disclosures: "Repayment based on percentage of gross revenue (typically 5-15%). Total repayment typically 1.3x to 1.5x of advance. No fixed term - repaid faster if revenue grows. Weekly or monthly reconciliation required.",
    description: "Flexible funding that aligns with your revenue cycles. Pay a percentage of revenue instead of fixed payments. Perfect for seasonal or high-growth businesses.",
    priority: 11,
    active: true
  }
];

// Helper function to get products by category
export function getLoanProductsByCategory(category: string): InsertLoanProduct[] {
  return LOAN_PRODUCTS_DATA.filter(product => 
    product.category.toLowerCase() === category.toLowerCase() && product.active
  );
}

// Helper function to get all active products
export function getActiveLoanProducts(): InsertLoanProduct[] {
  return LOAN_PRODUCTS_DATA.filter(product => product.active)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
}

// Helper function to find best matching product
export function findBestLoanProduct(amount: number, creditScore?: number): InsertLoanProduct | undefined {
  const eligible = LOAN_PRODUCTS_DATA.filter(product => {
    if (!product.active) return false;
    if (amount < product.minAmount || amount > product.maxAmount) return false;
    if (creditScore && product.minCredit && creditScore < product.minCredit) return false;
    return true;
  });
  
  // Sort by speed for quick funding needs
  eligible.sort((a, b) => {
    const speedA = a.speedDays ?? 999;
    const speedB = b.speedDays ?? 999;
    return speedA - speedB;
  });
  
  return eligible[0];
}