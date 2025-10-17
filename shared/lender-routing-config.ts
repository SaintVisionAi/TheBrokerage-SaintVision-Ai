export interface LenderCriteria {
  minLoanAmount?: number;
  maxLoanAmount?: number;
  propertyTypes?: string[];
  states?: string[];
  creditScoreMin?: number;
}

export interface LenderConfig {
  id: string;
  name: string;
  active: boolean;
  type: 'link' | 'email' | 'api';
  applicationLink?: string;
  email?: string;
  priority: number;
  contactPhone?: string;
  contactEmail?: string;
  criteria?: LenderCriteria;
  apiConfig?: {
    endpoint: string;
    apiKey: string;
    webhookUrl?: string;
  };
}

export const LENDERS: LenderConfig[] = [
  {
    id: 'rok-financial',
    name: 'Rok Financial',
    active: true,
    type: 'link' as const,
    applicationLink: 'https://rokfinancial.com/apply',
    priority: 1,
    contactPhone: '+1 (949) 755-0720',
    contactEmail: 'submissions@rokfinancial.com',
    criteria: {
      minLoanAmount: 50000,
      maxLoanAmount: 50000000,
      propertyTypes: ['residential', 'commercial', 'mixed'],
      states: ['CA', 'NY', 'TX', 'FL', 'AZ', 'NV', 'WA', 'OR', 'CO', 'IL'],
      creditScoreMin: 580
    }
  }
];

export function findBestLender(params: {
  loanAmount: number;
  propertyType?: string;
  state?: string;
  creditScore?: number;
}): LenderConfig | null {
  const eligibleLenders = LENDERS.filter(lender => {
    if (!lender.active) return false;
    
    const { criteria } = lender;
    if (!criteria) return true;
    
    if (criteria.minLoanAmount && params.loanAmount < criteria.minLoanAmount) return false;
    if (criteria.maxLoanAmount && params.loanAmount > criteria.maxLoanAmount) return false;
    if (criteria.propertyTypes && params.propertyType && !criteria.propertyTypes.includes(params.propertyType)) return false;
    if (criteria.states && params.state && !criteria.states.includes(params.state)) return false;
    if (criteria.creditScoreMin && params.creditScore && params.creditScore < criteria.creditScoreMin) return false;
    
    return true;
  });
  
  if (eligibleLenders.length === 0) return null;
  
  eligibleLenders.sort((a, b) => a.priority - b.priority);
  return eligibleLenders[0];
}
