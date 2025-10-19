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

export default function LendingProducts() {
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
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          service: 'lending',
          type: `${formData.loanAmount} - ${formData.businessType}`,
          source: 'lending-page',
          selectedProduct
        })
      });

      const result = await response.json();

      if (result.success || response.ok) {
        if (result.session) {
          toast({
            title: result.session.accountCreated ? "Account Created & Application Received!" : "Application Received!",
            description: result.session.accountCreated 
              ? "Your login credentials were sent via SMS & Email. Redirecting to your portal..." 
              : "Redirecting to your client portal...",
          });
          
          setTimeout(() => {
            window.location.replace('/client-portal');
          }, 3000);
        } else {
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
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Parse requirements and features arrays (handle both JSON arrays and strings)
  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [field];
      }
    }
    return [];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Business Lending Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              From $5,000 to $10 Million · Same Day to 30-Day Funding
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                11 Loan Products
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Timer className="h-5 w-5 mr-2" />
                24-Hour Approval
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <BadgeCheck className="h-5 w-5 mr-2" />
                500+ Credit Score Accepted
              </Badge>
            </div>
          </div>
        </section>

        {/* Loan Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Loan Product</h2>
              <p className="text-lg text-gray-600">
                Select the financing solution that best fits your business needs
              </p>
            </div>

            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 mb-4" />
                      <Skeleton className="h-10" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loanProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="hover:shadow-lg transition-shadow"
                    data-testid={`product-card-${product.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(product.category)}
                          <Badge className={getCategoryColor(product.category)}>
                            {product.category}
                          </Badge>
                        </div>
                        {product.speedDays <= 2 && (
                          <Badge variant="destructive" className="animate-pulse">
                            Fast Funding
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Loan Amount Range */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Loan Amount</p>
                        <p className="text-lg font-bold">
                          {formatAmount(product.minAmount)} - {formatAmount(product.maxAmount)}
                        </p>
                      </div>

                      {/* Rates */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Rates</p>
                        <p className="text-sm">
                          {product.minRate} - {product.maxRate}
                        </p>
                      </div>

                      {/* Terms */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Terms</p>
                        <p className="text-sm">{product.terms}</p>
                      </div>

                      {/* Speed & Credit */}
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Funding Speed</p>
                          <p className="text-sm font-bold text-green-600">
                            {product.speedDays === 1 ? '24 hours' : `${product.speedDays} days`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">Min Credit</p>
                          <p className="text-sm font-bold">{product.minCredit}+</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Key Features */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Key Features</p>
                        <ul className="space-y-1">
                          {parseArrayField(product.features).slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <CheckCircle className="h-3 w-3 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Requirements Preview */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Basic Requirements</p>
                        <ul className="space-y-1">
                          {parseArrayField(product.requirements).slice(0, 2).map((req, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <FileText className="h-3 w-3 mr-1 mt-0.5 text-blue-500 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply Button */}
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => handleApplyNow(product)}
                        data-testid={`button-apply-${product.id}`}
                      >
                        Apply Now
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>

                      {/* Disclosure Notice */}
                      {product.disclosures && (
                        <p className="text-xs text-gray-500 italic">
                          {product.disclosures.substring(0, 100)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Quick Application Form */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Pre-Qualification</CardTitle>
                <CardDescription>
                  Get pre-qualified in minutes. No impact on credit score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" id="apply-form">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        data-testid="input-firstName"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="loanAmount">Desired Loan Amount</Label>
                    <Select 
                      value={formData.loanAmount} 
                      onValueChange={(value) => setFormData({...formData, loanAmount: value})}
                    >
                      <SelectTrigger id="loanAmount" data-testid="select-loanAmount">
                        <SelectValue placeholder="Select amount range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$5K - $25K">$5,000 - $25,000</SelectItem>
                        <SelectItem value="$25K - $50K">$25,000 - $50,000</SelectItem>
                        <SelectItem value="$50K - $100K">$50,000 - $100,000</SelectItem>
                        <SelectItem value="$100K - $250K">$100,000 - $250,000</SelectItem>
                        <SelectItem value="$250K - $500K">$250,000 - $500,000</SelectItem>
                        <SelectItem value="$500K - $1M">$500,000 - $1,000,000</SelectItem>
                        <SelectItem value="$1M+">$1,000,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                      placeholder="e.g., Retail, Restaurant, Construction"
                      required
                      data-testid="input-businessType"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeInBusiness">Time in Business</Label>
                    <Select 
                      value={formData.timeInBusiness} 
                      onValueChange={(value) => setFormData({...formData, timeInBusiness: value})}
                    >
                      <SelectTrigger id="timeInBusiness" data-testid="select-timeInBusiness">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than 6 months">Less than 6 months</SelectItem>
                        <SelectItem value="6 months - 1 year">6 months - 1 year</SelectItem>
                        <SelectItem value="1 - 2 years">1 - 2 years</SelectItem>
                        <SelectItem value="2 - 5 years">2 - 5 years</SelectItem>
                        <SelectItem value="5+ years">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Information (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Tell us about your funding needs..."
                      rows={3}
                      data-testid="textarea-notes"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    disabled={isSubmitting}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Get Pre-Qualified
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By submitting this form, you agree to our terms and authorize us to contact you.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Saint Vision Group</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <Zap className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Fast Funding</h3>
                  <p className="text-gray-600">
                    Get funded in as little as 24 hours with our streamlined process
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Bad Credit OK</h3>
                  <p className="text-gray-600">
                    We work with all credit profiles, starting from 500 FICO score
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Competitive Rates</h3>
                  <p className="text-gray-600">
                    Access to 50+ lenders ensures you get the best rates available
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Loan Calculator */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <LoanCalculator />
          </div>
        </section>

        {/* AI Assistant */}
        <SaintBrokerEnhanced />
      </main>

      <GlobalFooter />
    </div>
  );
}