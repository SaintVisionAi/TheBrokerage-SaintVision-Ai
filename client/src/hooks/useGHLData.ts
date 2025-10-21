import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface GHLApplication {
  id: string;
  name: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'funded';
  type: 'lending' | 'real-estate' | 'investment' | 'mortgage';
  amount: number;
  loanAmount?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  documents?: {
    required: number;
    submitted: number;
    approved: number;
  };
  nextStep?: string;
  progress?: number;
}

export interface GHLOpportunity {
  id: string;
  name: string;
  status: 'open' | 'won' | 'lost';
  value: number;
  pipelineId: string;
  stageId: string;
  stageName: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  tags: string[];
  customFields?: Record<string, any>;
}

export interface GHLPortfolioItem {
  id: string;
  name: string;
  type: 'investment' | 'deal' | 'property';
  value: number;
  status: 'active' | 'completed' | 'pending';
  returnRate?: number;
  monthlyReturn?: number;
  dueDate?: string;
  documents?: string[];
}

export interface GHLDataState {
  applications: GHLApplication[];
  opportunities: GHLOpportunity[];
  contact: GHLContact | null;
  portfolio: GHLPortfolioItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Transforms mock GHL data into applications
 */
function transformOpportunitiesToApplications(opportunities: any[]): GHLApplication[] {
  return opportunities.map((opp: any) => ({
    id: opp.id,
    name: opp.name,
    status: opp.status === 'won' ? 'funded' : opp.status === 'lost' ? 'rejected' : 'in-review',
    type: extractServiceType(opp.name),
    amount: opp.value || 0,
    loanAmount: opp.customFields?.loan_amount || '',
    createdAt: opp.createdAt || new Date().toISOString(),
    updatedAt: opp.updatedAt || new Date().toISOString(),
    progress: opp.status === 'won' ? 100 : opp.status === 'lost' ? 0 : 50,
  }));
}

/**
 * Extract service type from opportunity name
 */
function extractServiceType(name: string): 'lending' | 'real-estate' | 'investment' | 'mortgage' {
  const lower = name.toLowerCase();
  if (lower.includes('mortgage')) return 'mortgage';
  if (lower.includes('real estate') || lower.includes('property')) return 'real-estate';
  if (lower.includes('invest')) return 'investment';
  return 'lending';
}

/**
 * Hook to fetch and manage GHL data
 * Integrates with React Query for caching and background updates
 */
export function useGHLData(userId?: string) {
  const [applications, setApplications] = useState<GHLApplication[]>([]);
  const [opportunities, setOpportunities] = useState<GHLOpportunity[]>([]);
  const [contact, setContact] = useState<GHLContact | null>(null);
  const [portfolio, setPortfolio] = useState<GHLPortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGHLData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch contact information
      if (userId) {
        try {
          const contactResponse = await fetch(`/api/ghl/contact/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            setContact(contactData);
          }
        } catch (err) {
          console.warn('Failed to fetch contact:', err);
        }
      }

      // Fetch opportunities (which represent applications in GHL)
      try {
        const oppResponse = await fetch('/api/ghl/opportunities', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (oppResponse.ok) {
          const oppData = await oppResponse.json();
          setOpportunities(oppData.opportunities || []);

          // Transform opportunities to applications
          const apps = transformOpportunitiesToApplications(oppData.opportunities || []);
          setApplications(apps);
        }
      } catch (err) {
        console.warn('Failed to fetch opportunities:', err);
      }

      // Fetch portfolio data
      try {
        const portfolioResponse = await fetch('/api/ghl/portfolio', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          setPortfolio(portfolioData.portfolio || []);
        }
      } catch (err) {
        console.warn('Failed to fetch portfolio:', err);
      }

      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch data on mount and when userId changes
  useEffect(() => {
    fetchGHLData();
  }, [userId, fetchGHLData]);

  return {
    applications,
    opportunities,
    contact,
    portfolio,
    isLoading,
    error,
    refetch: fetchGHLData,
  };
}

/**
 * Hook to fetch GHL applications with React Query
 * Provides better caching and background synchronization
 */
export function useGHLApplications(userId?: string) {
  const query = useQuery({
    queryKey: ['ghl-applications', userId],
    queryFn: async () => {
      const response = await fetch('/api/ghl/opportunities', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      return transformOpportunitiesToApplications(data.opportunities || []);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    applications: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to fetch GHL portfolio
 */
export function useGHLPortfolio(userId?: string) {
  const query = useQuery({
    queryKey: ['ghl-portfolio', userId],
    queryFn: async () => {
      const response = await fetch('/api/ghl/portfolio', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio');
      }

      const data = await response.json();
      return data.portfolio || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    portfolio: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook to fetch GHL contact details
 */
export function useGHLContact(userId?: string) {
  const query = useQuery({
    queryKey: ['ghl-contact', userId],
    queryFn: async () => {
      if (!userId) return null;

      const response = await fetch(`/api/ghl/contact/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contact');
      }

      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!userId,
  });

  return {
    contact: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Get pending applications count
 */
export function getPendingApplicationsCount(applications: GHLApplication[]): number {
  return applications.filter((app) => app.status === 'pending' || app.status === 'in-review').length;
}

/**
 * Get total portfolio value
 */
export function getTotalPortfolioValue(portfolio: GHLPortfolioItem[]): number {
  return portfolio.reduce((sum, item) => sum + item.value, 0);
}

/**
 * Get total monthly returns
 */
export function getTotalMonthlyReturns(portfolio: GHLPortfolioItem[]): number {
  return portfolio.reduce((sum, item) => sum + (item.monthlyReturn || 0), 0);
}

/**
 * Filter applications by status
 */
export function filterApplicationsByStatus(
  applications: GHLApplication[],
  status: GHLApplication['status']
): GHLApplication[] {
  return applications.filter((app) => app.status === status);
}

/**
 * Filter applications by type
 */
export function filterApplicationsByType(
  applications: GHLApplication[],
  type: GHLApplication['type']
): GHLApplication[] {
  return applications.filter((app) => app.type === type);
}
