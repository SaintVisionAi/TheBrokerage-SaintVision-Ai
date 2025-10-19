import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import LoanCalculator from '@/components/calculators/loan-calculator';
import SaintBrokerEnhanced from '@/components/ai/saint-broker-enhanced';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Percent,
  Zap,
  FileText,
  Building,
  CreditCard,
  BadgeCheck,
  Timer,
  ChevronRight
} from 'lucide-react';
import { useLocation } from 'wouter';

interface LoanProduct {
  id: string;
  name: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  minRate: string;
  maxRate: string;
  terms: string;
  minCredit: number;
  speedDays: number;
  requirements: string[] | any;
  features: string[] | any;
  disclosures: string;
  description: string;
  priority: number;
  active: boolean;
}

export default function Lending() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    loanAmount: '',
    businessType: '',
    timeInBusiness: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch loan products from API
  const { data: loanProducts = [], isLoading: isLoadingProducts } = useQuery<LoanProduct[]>({
    queryKey: ['/api/loan-products']
  });

  // Seed loan products if none exist
  useEffect(() => {
    if (!isLoadingProducts && loanProducts.length === 0) {
      fetch('/api/loan-products/seed', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Loan products seeded:', data.message);
            window.location.reload(); // Reload to fetch seeded products
          }
        })
        .catch(err => console.error('Failed to seed loan products:', err));
    }
  }, [isLoadingProducts, loanProducts.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ghl/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // CRITICAL: Allow browser to save session cookie from response
        body: JSON.stringify({
          ...formData,
          service: 'lending',
          type: `${formData.loanAmount} - ${formData.businessType}`,
          source: 'lending-page'
        })
      });

      const result = await response.json();

      if (result.success || response.ok) {
        // Check if session info was returned (auto-login)
        if (result.session) {
          // Account was created or exists - auto-login and redirect to portal
          toast({
            title: result.session.accountCreated ? "Account Created & Application Received!" : "Application Received!",
            description: result.session.accountCreated 
              ? "Your login credentials were sent via SMS & Email. Redirecting to your portal..." 
              : "Redirecting to your client portal...",
          });
          
          // Auto-login by redirecting to client portal (backend session already set)
          // Use replace() to force full page reload and ensure cookie is picked up
          // 3-second delay to ensure cookie is fully processed by browser before navigation
          setTimeout(() => {
            window.location.replace('/client-portal');
          }, 3000);
        } else if (result.warning) {
          // Account creation failed - show warning
          toast({
            title: "Application Received!",
            description: result.warning,
            variant: "default"
          });
        } else {
          // Standard confirmation without auto-login
          toast({
            title: "Application Received!",
            description: "Our lending team will contact you within 24 hours. Check your email for next steps.",
          });
        }
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          loanAmount: '',
          businessType: '',
          timeInBusiness: '',
          notes: ''
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Please try again or call us at (800) 555-LOAN",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loanFeatures = [
    { icon: DollarSign, title: "$50K - $5M", description: "Flexible loan amounts for any business need" },
    { icon: Percent, title: "9% Starting Rate", description: "Competitive rates with no hidden fees" },
    { icon: Clock, title: "24-48 Hour Approval", description: "Fast decisions powered by AI underwriting" },
    { icon: Shield, title: "No Collateral Required", description: "Unsecured options available for qualified borrowers" }
  ];

  const handleApplyNow = (product: LoanProduct) => {
    setSelectedProduct(product.id);
    // Navigate to apply page with pre-selected product
    setLocation(`/apply?product=${encodeURIComponent(product.name)}&category=${product.category}`);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'mca': return <Zap className="h-5 w-5" />;
      case 'term loan': return <DollarSign className="h-5 w-5" />;
      case 'equipment': return <Building className="h-5 w-5" />;
      case 'sba': return <Shield className="h-5 w-5" />;
      case 'real estate': return <Building className="h-5 w-5" />;
      case 'startup': return <TrendingUp className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'mca': return 'bg-blue-100 text-blue-800';
      case 'term loan': return 'bg-green-100 text-green-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'sba': return 'bg-orange-100 text-orange-800';
      case 'real estate': return 'bg-indigo-100 text-indigo-800';
      case 'startup': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      <GlobalHeader />

      {/* Hero Section with Dynamic Background */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/20 via-transparent to-neutral-900/20"></div>
        
        {/* Floating Money Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <DollarSign className="absolute top-20 left-10 h-12 w-12 text-yellow-400/20 animate-pulse" />
          <TrendingUp className="absolute top-40 right-20 h-16 w-16 text-yellow-400/20 animate-pulse" style={{ animationDelay: '0.3s' }} />
          <DollarSign className="absolute bottom-32 left-1/3 h-10 w-10 text-yellow-400/20 animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-semibold mb-6">
              🚀 AI-Powered Business Lending
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
            $500M+ Funded
            <br />
            24-Hour Decisions
          </h1>
          <p className="text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Enterprise-grade business lending from $10K to $10M+ with rates starting at 7.99%. 
            Powered by AI underwriting and <span className="text-yellow-400">13 Active Funding Partners with AI-Powered Routing</span> for faster approvals and better terms. 
            No collateral required for qualified borrowers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-8 py-6 text-lg font-semibold"
              onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-apply-now"
            >
              Apply Now - Get Pre-Approved
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Metrics Banner */}
      <section className="py-16 px-6 bg-gradient-to-r from-yellow-900/20 to-yellow-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="border-r border-white/10 last:border-r-0">
              <div className="text-4xl font-bold text-yellow-400 mb-2">$500M+</div>
              <p className="text-white/60">Total Funded</p>
            </div>
            <div className="border-r border-white/10 last:border-r-0">
              <div className="text-4xl font-bold text-yellow-400 mb-2">24-48hr</div>
              <p className="text-white/60">Decision Time</p>
            </div>
            <div className="border-r border-white/10 last:border-r-0">
              <div className="text-4xl font-bold text-yellow-400 mb-2">9%</div>
              <p className="text-white/60">Starting Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">9</div>
              <p className="text-white/60">Loan Products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Premium Lending Solutions</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Enterprise-grade financing backed by AI-powered underwriting and 10+ years of industry expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {loanProducts.map((loan: typeof loanProducts[0], index: number) => (
              <div 
                key={index}
                className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-8 hover:border-yellow-400/50 transition-all"
                data-testid={`card-loan-${index}`}
              >
                <div className="mb-4">{loan.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{loan.title}</h3>
                <p className="text-yellow-400 font-semibold mb-3">{loan.rates}</p>
                <p className="text-white/60 mb-6">{loan.description}</p>
                <ul className="space-y-2">
                  {loan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-4 h-4 text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Calculate Your Loan Payment</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              See exactly what your monthly payments will be with our accurate loan calculator
            </p>
          </div>
          <LoanCalculator />
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Streamlined Application Process</h2>
            <p className="text-white/60 text-lg">AI-powered underwriting delivers decisions in 24-48 hours, not weeks</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Apply Online", description: "Complete our quick application form" },
              { step: "02", title: "AI Review", description: "Instant preliminary approval decision" },
              { step: "03", title: "Documentation", description: "Submit required business documents" },
              { step: "04", title: "Get Funded", description: "Receive capital in your account" }
            ].map((item: { step: string; title: string; description: string }, index: number) => (
              <div key={index} className="text-center" data-testid={`step-${index}`}>
                <div className="text-5xl font-bold text-yellow-400/30 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Saint Vision Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Saint Vision Group?</h2>
            <p className="text-white/60 text-lg">Real funding, real results - powered by AI and human expertise</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">24-Hour Decisions</h3>
              <p className="text-white/60">SaintBroker AI analyzes your application instantly, providing preliminary approval in minutes and final decision within 24 hours.</p>
            </div>
            
            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Collateral Required</h3>
              <p className="text-white/60">Qualified businesses get funding based on revenue and cash flow, not assets. Keep your property and equipment safe.</p>
            </div>
            
            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">13 Funding Partners</h3>
              <p className="text-white/60">Our AI matches you with the perfect lender from our network, ensuring the best rates and terms for your specific needs.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-6 py-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">100% Free to Apply • No Obligation • No Credit Pull Until Approval</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-600/10 to-yellow-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join $500M+ in Funded Businesses
          </h2>
          <p className="text-xl text-white/60 mb-8">
            Experience the future of business lending with AI-powered approvals, competitive rates, and white-glove service.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => window.location.href = '/apply'}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold px-8 py-6 text-lg"
              data-testid="button-start-application"
            >
              Start Application
            </Button>
            <Button 
              onClick={() => window.location.href = '/contact'}
              variant="outline" 
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg"
              data-testid="button-speak-specialist"
            >
              Speak to a Specialist
            </Button>
          </div>
        </div>
      </section>

      <GlobalFooter />
      
      {/* AI Concierge */}
      <SaintBrokerEnhanced />
    </div>
  );
}
