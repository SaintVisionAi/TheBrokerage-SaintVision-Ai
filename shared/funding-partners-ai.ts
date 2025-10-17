export interface FundingPartner {
  id: string;
  name: string;
  active: boolean;
  submissionType: 'link' | 'email';
  link?: string;
  email?: string;
  contactPhone?: string;
  contactEmail?: string;
  priority: number;
  
  // Criteria for AI matching
  specialties: string[]; // MCA, SBA, Real Estate, Equipment, etc.
  minAmount?: number;
  maxAmount?: number;
  minCredit?: number;
  speedDays?: number; // How fast they fund
  description?: string;
}

// ALL BLB EXPERT LENDERS
export const FUNDING_PARTNERS: FundingPartner[] = [
  
  // 1. SVG PARTNER NETWORK - Fast MCA/Term (White Label)
  {
    id: 'svg-partner-network',
    name: 'SVG Partner Network',
    active: true,
    submissionType: 'email',
    email: 'lending@saintvisiongroup.com',
    priority: 1,
    specialties: ['MCA', 'Term Loan', 'Working Capital', 'Fast Funding'],
    minAmount: 5000,
    maxAmount: 1500000,
    speedDays: 3,
    description: '🚀 MCA and Term Loans - 1-3 day funding, $5K-$1.5M range (Saint Vision Group Partner Network)'
  },
  
  // 2. ARF FINANCIAL - Bank Loans & Lines of Credit
  {
    id: 'arf-financial',
    name: 'ARF Financial',
    active: true,
    submissionType: 'email',
    email: 'mark.lokmanyan@arffinancial.com',
    contactPhone: '(310) 402-1600',
    priority: 2,
    specialties: ['Bank Loan', 'Line of Credit', 'Commercial'],
    description: 'Bank-based loans and business lines of credit. Contact: Mark Lokmanyan, Amy Laughlin (818-643-7490), Valentina Sepic (346-724-3330)'
  },
  
  // 3. RICH MEE - 0% Startup SLOC
  {
    id: 'rich-mee-sloc',
    name: 'Rich Mee - 0% Startup SLOC',
    active: true,
    submissionType: 'email',
    email: 'rec.mee@tmn.com',
    contactPhone: '(801) 441-7943',
    priority: 3,
    specialties: ['SLOC', 'Startup', '0% Interest', 'Credit Stacking'],
    minAmount: 1000,
    maxAmount: 100000,
    minCredit: 700,
    description: '0% interest startup funding up to $100K - 12-24 months. Requires 700+ credit score'
  },
  
  // 4. EASY STREET CAPITAL - Real Estate Specialist
  {
    id: 'easy-street',
    name: 'Easy Street Capital',
    active: true,
    submissionType: 'email',
    email: 'tannerm@easystreetcap.com',
    contactPhone: 'Contact: Tanner Macklin',
    priority: 4,
    specialties: ['Real Estate', 'BRRRR', 'STR', 'AirBnB', 'Fix & Flip'],
    description: 'Real estate investment funding - BRRRR, STR, AirBnB strategies'
  },
  
  // 5. SB LENDING SOURCE - SBA Specialist
  {
    id: 'sb-lending',
    name: 'SB Lending Source',
    active: true,
    submissionType: 'email',
    email: 'info@sblendingsource.com',
    contactPhone: '(619) 253-0795',
    priority: 5,
    specialties: ['SBA', 'SBA 7(a)', 'SBA 504', 'Government Loans'],
    description: 'SBA loan specialist for revenue-generating businesses'
  },
  
  // 6. EXACTLY CAPITAL - Multi-Product
  {
    id: 'exactly-capital',
    name: 'Exactly Capital',
    active: true,
    submissionType: 'email',
    email: 'Brent@exactlycapital.com',
    contactPhone: '(949) 236-7769',
    priority: 6,
    specialties: ['MCA', 'Equipment', 'Invoice Factoring', 'Line of Credit', 'SBA'],
    description: 'Multiple funding products - MCA, Equipment, Factoring, LOC, SBA. Contact: Brent'
  },
  
  // 7. FUNDING DEPOT - Full Service
  {
    id: 'funding-depot',
    name: 'Funding Depot, LLC',
    active: true,
    submissionType: 'email',
    email: 'info@myfundingdepot.com',
    contactPhone: '(610) 998-8600',
    priority: 7,
    specialties: ['MCA', 'Line of Credit', 'Term Loan', 'Real Estate', 'Restaurant', 'Brick & Mortar'],
    description: 'Full-service lender - MCA, LOC, Term, Real Estate, Restaurant/B&M specialists. Contact: Doug'
  },
  
  // 8. COMMERCIAL CAPITAL CONNECT - Equipment & Working Capital
  {
    id: 'commercial-capital',
    name: 'Commercial Capital Connect',
    active: true,
    submissionType: 'email',
    email: 'Cheryl@commercialcapconnect.com',
    contactPhone: '(800) 798-4551',
    priority: 8,
    specialties: ['Equipment', 'Equipment Finance', 'Working Capital', 'Monthly Payment'],
    description: 'Equipment financing and monthly payment working capital. Contact: Cheryl'
  },
  
  // 9. TRINITY BAY LENDING - Real Estate Bridge/Fix&Flip
  {
    id: 'trinity-bay',
    name: 'Trinity Bay Lending',
    active: true,
    submissionType: 'link',
    link: 'https://trinitybaylending.com',
    email: 'hello@trinitybaylending.com',
    contactPhone: '(281) 900-1925',
    priority: 9,
    specialties: ['Real Estate', 'Bridge Loan', 'Fix & Flip', 'Ground Up Construction', 'Build to Rent', 'BRRRR'],
    description: 'Real estate bridge funding, fix & flip, ground-up construction. Contact: Brand'
  },
  
  // 10. HB CAPITAL - MCA & Real Estate Investment
  {
    id: 'hb-capital',
    name: 'HB Capital',
    active: true,
    submissionType: 'email',
    email: 'Ray@hbcapitalllc.com',
    contactPhone: '(201) 940-8048',
    priority: 10,
    specialties: ['MCA', 'Real Estate', 'Investment Funding'],
    description: 'MCA and Real Estate Investment Funding. Contact: Ray (info@hbcapitalllc.com)'
  },
  
  // 11. PRIME CORPORATE SERVICES - Business Structure
  {
    id: 'prime-corporate',
    name: 'Prime Corporate Services',
    active: true,
    submissionType: 'email',
    email: 'presidentsupport@primecorporateservices.com',
    priority: 11,
    specialties: ['Business Structure', 'Entity Formation', 'Compliance'],
    description: 'Business structure and entity formation expert. Contact: Tim Thornburgh'
  },
  
  // 12. ROK FINANCIAL - Large Commercial (EXISTING)
  {
    id: 'rok-financial',
    name: 'Rok Financial',
    active: true,
    submissionType: 'link',
    link: 'https://rokfinancial.com/apply',
    contactPhone: '+1 (949) 755-0720',
    contactEmail: 'submissions@rokfinancial.com',
    priority: 12,
    specialties: ['Commercial Real Estate', 'Large Loans', 'Commercial'],
    minAmount: 50000,
    maxAmount: 50000000,
    minCredit: 580,
    description: 'Large commercial loans $50K-$50M, 580+ credit'
  },
  
  // 13. SAINT VISION GROUP - IN-HOUSE (Your own underwriting)
  {
    id: 'svg-inhouse',
    name: 'Saint Vision Group - In-House',
    active: true,
    submissionType: 'email',
    email: 'lending@saintvisiongroup.com',
    priority: 0, // HIGHEST priority for in-house
    specialties: ['In-House', 'Full Underwriting', 'All Products', 'Custom Solutions'],
    minAmount: 50000,
    maxAmount: 5000000,
    description: '🏆 SVG In-House Lending - Full underwriting capability, custom solutions'
  }
];

// AI AUTO-SELECTION LOGIC
export function autoSelectFundingPartner(params: {
  loanType: string; // From form: "Working Capital", "Equipment Purchase", etc.
  loanAmount: number;
  creditScore?: number;
  speedNeeded?: boolean;
}): FundingPartner {
  
  const { loanType, loanAmount, creditScore, speedNeeded } = params;
  const typeKeywords = loanType.toLowerCase();
  
  // 1. SPECIALTY ROUTING FIRST (before in-house)
  // ORDER MATTERS - Most specific first!
  
  // EQUIPMENT - Dedicated equipment financing (check BEFORE SBA "purchase")
  if (typeKeywords.includes('equipment')) {
    const equipmentLender = FUNDING_PARTNERS.find(p => p.id === 'commercial-capital');
    if (equipmentLender) return equipmentLender;
  }
  
  // REAL ESTATE - Bridge, Fix&Flip, BRRRR (check BEFORE SBA)
  if (typeKeywords.includes('real estate') || typeKeywords.includes('commercial real estate') || 
      typeKeywords.includes('bridge')) {
    let realtors = FUNDING_PARTNERS.filter(p => 
      p.active && p.specialties.some(s => 
        s.toLowerCase().includes('real estate') || 
        s.toLowerCase().includes('brrrr') ||
        s.toLowerCase().includes('bridge') ||
        s.toLowerCase().includes('fix')
      )
    );
    
    // Filter by amount
    realtors = realtors.filter(p => {
      const minOk = !p.minAmount || loanAmount >= p.minAmount;
      const maxOk = !p.maxAmount || loanAmount <= p.maxAmount;
      return minOk && maxOk;
    });
    
    if (realtors.length > 0) {
      realtors.sort((a, b) => a.priority - b.priority);
      return realtors[0];
    }
  }
  
  // STARTUP 0% SLOC - High credit, small amount, MUST be startup purpose
  if (creditScore && creditScore >= 700 && loanAmount <= 100000 && 
      (typeKeywords.includes('startup') || typeKeywords.includes('start up') || typeKeywords.includes('start-up'))) {
    const richMee = FUNDING_PARTNERS.find(p => p.id === 'rich-mee-sloc');
    if (richMee) return richMee;
  }
  
  // SBA LOANS - Business expansion/acquisition/explicit SBA (NOT equipment/RE which are already routed)
  if ((typeKeywords.includes('sba') || 
       typeKeywords.includes('expansion') || 
       typeKeywords.includes('acquisition')) && 
      creditScore && creditScore >= 650) {
    const sbaLender = FUNDING_PARTNERS.find(p => p.id === 'sb-lending');
    if (sbaLender) return sbaLender;
  }
  
  // 2. NOW TRY IN-HOUSE (for general business lending only)
  const inHouse = FUNDING_PARTNERS.find(p => p.id === 'svg-inhouse');
  if (inHouse && 
      loanAmount >= (inHouse.minAmount || 0) && 
      loanAmount <= (inHouse.maxAmount || Infinity) &&
      // Only route general business lending to in-house (not specialty equipment/SBA/startup)
      (typeKeywords.includes('working capital') || 
       typeKeywords.includes('expansion') || 
       typeKeywords.includes('inventory') ||
       typeKeywords.includes('consolidation') ||
       typeKeywords.includes('commercial real estate'))) {
    return inHouse;
  }
  
  // 3. GENERAL PURPOSE ROUTING
  let eligible = FUNDING_PARTNERS.filter(p => p.active && p.id !== 'svg-inhouse');
  
  // Match by purpose
  if (typeKeywords.includes('inventory') || typeKeywords.includes('factoring')) {
    eligible = eligible.filter(p => 
      p.specialties.some(s => s.toLowerCase().includes('factoring') || 
                             s.toLowerCase().includes('invoice'))
    );
  }
  else if (typeKeywords.includes('working capital') || 
           typeKeywords.includes('expansion') ||
           typeKeywords.includes('consolidation')) {
    eligible = eligible.filter(p => 
      p.specialties.some(s => s.toLowerCase().includes('mca') || 
                             s.toLowerCase().includes('working') ||
                             s.toLowerCase().includes('term'))
    );
  }
  
  // 4. Filter by loan amount
  eligible = eligible.filter(p => {
    const minOk = !p.minAmount || loanAmount >= p.minAmount;
    const maxOk = !p.maxAmount || loanAmount <= p.maxAmount;
    return minOk && maxOk;
  });
  
  // 5. Filter by credit score
  if (creditScore) {
    eligible = eligible.filter(p => !p.minCredit || creditScore >= p.minCredit);
  }
  
  // 6. Prefer fast funding if needed
  if (speedNeeded) {
    eligible.sort((a, b) => (a.speedDays || 999) - (b.speedDays || 999));
  } else {
    // Sort by priority
    eligible.sort((a, b) => a.priority - b.priority);
  }
  
  // 7. Return best match or fallback to SVG Partner Network
  if (eligible.length > 0) {
    return eligible[0];
  }
  
  // Fallback: SVG Partner Network (handles most cases)
  return FUNDING_PARTNERS.find(p => p.id === 'svg-partner-network') || FUNDING_PARTNERS[0];
}

// Get all active partners
export function getActiveFundingPartners(): FundingPartner[] {
  return FUNDING_PARTNERS.filter(p => p.active);
}

// Get partner by ID
export function getFundingPartnerById(id: string): FundingPartner | undefined {
  return FUNDING_PARTNERS.find(p => p.id === id);
}

// Find best match (same as auto-select but returns all matches for manual selection)
export function findMatchingPartners(params: {
  loanType: string;
  loanAmount: number;
  creditScore?: number;
}): FundingPartner[] {
  
  const { loanType, loanAmount, creditScore } = params;
  
  let matches = FUNDING_PARTNERS.filter(p => p.active);
  
  // Filter by specialty
  const typeKeywords = loanType.toLowerCase();
  matches = matches.filter(p => 
    p.specialties.some(s => 
      typeKeywords.includes(s.toLowerCase()) ||
      s.toLowerCase().includes(typeKeywords.split(' ')[0])
    )
  );
  
  // Filter by amount
  matches = matches.filter(p => {
    const minOk = !p.minAmount || loanAmount >= p.minAmount;
    const maxOk = !p.maxAmount || loanAmount <= p.maxAmount;
    return minOk && maxOk;
  });
  
  // Filter by credit
  if (creditScore) {
    matches = matches.filter(p => !p.minCredit || creditScore >= p.minCredit);
  }
  
  // Sort by priority
  matches.sort((a, b) => a.priority - b.priority);
  
  return matches;
}
