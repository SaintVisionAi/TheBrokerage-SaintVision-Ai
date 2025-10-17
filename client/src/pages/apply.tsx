import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import SaintBrokerEnhanced from '@/components/ai/saint-broker-enhanced';
import { 
  CheckCircle,
  DollarSign,
  Clock,
  Shield,
  FileText,
  TrendingUp,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';

export default function Apply() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    industry: '',
    yearsInBusiness: '',
    annualRevenue: '',
    
    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    timeframe: '',
    
    // Additional Information
    creditScore: '',
    hasCollateral: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          type: `Pre-Qual: ${formData.loanAmount} - ${formData.loanPurpose}`,
          source: 'pre-qualification-form',
          pipelineStage: 'Pre Qualified -Apply Now-SVG2',
          loanAmount: formData.loanAmount,
          businessRevenue: formData.annualRevenue,
          creditScore: formData.creditScore,
          notes: `Business: ${formData.businessName} | Industry: ${formData.industry} | Revenue: ${formData.annualRevenue} | ${formData.additionalNotes}`
        })
      });

      const result = await response.json();
      console.log('[AUTO-ONBOARDING] Response received:', { 
        status: response.status, 
        ok: response.ok, 
        success: result.success,
        hasSession: !!result.session,
        hasWarning: !!result.warning,
        result 
      });

      if (result.success || response.ok) {
        // Check if session info was returned (auto-login)
        if (result.session) {
          console.log('[AUTO-ONBOARDING] Session detected, showing toast and redirecting to /client-portal');
          // Account was created or exists - auto-login and redirect to portal
          toast({
            title: result.session.accountCreated ? "Account Created & Pre-Qualification Submitted!" : "Pre-Qualification Submitted!",
            description: result.session.accountCreated 
              ? "Your login credentials were sent via SMS & Email. Redirecting to your portal..." 
              : "Redirecting to your client portal...",
          });
          
          // Auto-login by redirecting to client portal (backend session already set)
          // Use replace() to force full page reload and ensure cookie is picked up
          // 3-second delay to ensure cookie is fully processed by browser before navigation
          setTimeout(() => {
            console.log('[AUTO-ONBOARDING] Redirecting to /client-portal now...');
            window.location.replace('/client-portal');
          }, 3000);
        } else if (result.warning) {
          console.log('[AUTO-ONBOARDING] Warning detected, redirecting to /application-complete');
          // Account creation failed - show warning and redirect to completion page
          toast({
            title: "Pre-Qualification Submitted!",
            description: result.warning || "Check your email for next steps.",
          });
          
          // Extract credit score value for routing
          const creditValue = formData.creditScore ? 
            (formData.creditScore.includes('Excellent') ? '750' :
             formData.creditScore.includes('Good') ? '700' :
             formData.creditScore.includes('Fair') ? '650' :
             formData.creditScore.includes('Poor') ? '550' : '680') : '680';
          
          // Map loan amount ranges to numeric values
          const loanAmountMap: Record<string, number> = {
            'Under $100K': 100000,
            '$50K - $100K': 100000,
            '$100K - $250K': 250000,
            '$250K - $500K': 500000,
            '$500K - $1M': 1000000,
            '$1M - $3M': 3000000,
            '$1M - $5M': 5000000,
            '$3M - $5M': 5000000,
            '$5M - $10M': 10000000,
            '$5M+': 10000000,
            '$10M+': 20000000,
          };
          
          const loanAmount = loanAmountMap[formData.loanAmount] || 500000;
          
          setTimeout(() => {
            const purposeEncoded = encodeURIComponent(formData.loanPurpose);
            const timeframeEncoded = encodeURIComponent(formData.timeframe);
            window.location.href = `/application-complete?amount=${loanAmount}&credit=${creditValue}&purpose=${purposeEncoded}&timeframe=${timeframeEncoded}`;
          }, 1500);
        } else {
          console.log('[AUTO-ONBOARDING] Legacy flow, no session or warning, redirecting to /application-complete');
          // Legacy flow - no auto-login info
          toast({
            title: "Pre-Qualification Submitted!",
            description: "Routing you to our lending partner...",
          });
          
          const creditValue = formData.creditScore ? 
            (formData.creditScore.includes('Excellent') ? '750' :
             formData.creditScore.includes('Good') ? '700' :
             formData.creditScore.includes('Fair') ? '650' :
             formData.creditScore.includes('Poor') ? '550' : '680') : '680';
          
          const loanAmountMap: Record<string, number> = {
            'Under $100K': 100000,
            '$50K - $100K': 100000,
            '$100K - $250K': 250000,
            '$250K - $500K': 500000,
            '$500K - $1M': 1000000,
            '$1M - $3M': 3000000,
            '$1M - $5M': 5000000,
            '$3M - $5M': 5000000,
            '$5M - $10M': 10000000,
            '$5M+': 10000000,
            '$10M+': 20000000,
          };
          
          const loanAmount = loanAmountMap[formData.loanAmount] || 500000;
          
          setTimeout(() => {
            const purposeEncoded = encodeURIComponent(formData.loanPurpose);
            const timeframeEncoded = encodeURIComponent(formData.timeframe);
            window.location.href = `/application-complete?amount=${loanAmount}&credit=${creditValue}&purpose=${purposeEncoded}&timeframe=${timeframeEncoded}`;
          }, 1500);
        }
      } else {
        console.log('[AUTO-ONBOARDING] Response not success, throwing error');
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('[AUTO-ONBOARDING] Error during submission:', error);
      toast({
        title: "Submission Error",
        description: "Please try again or call us directly at (800) 555-LOAN",
        variant: "destructive"
      });
    } finally {
      console.log('[AUTO-ONBOARDING] Setting isSubmitting=false');
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Clock, title: "24-48 Hour Decision", description: "AI-powered pre-qualification with fast approval" },
    { icon: DollarSign, title: "$50K - $5M Available", description: "Flexible loan amounts for any business need" },
    { icon: Shield, title: "No Collateral Required", description: "Unsecured options for qualified borrowers" },
    { icon: TrendingUp, title: "Rates from 9%", description: "Competitive rates with transparent terms" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/20 via-transparent to-neutral-900/20"></div>
        
        {/* Animated Background Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-20 right-10 h-12 w-12 text-yellow-400/20 animate-pulse" />
          <DollarSign className="absolute top-40 left-10 h-16 w-16 text-yellow-400/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <TrendingUp className="absolute bottom-40 right-1/4 h-10 w-10 text-yellow-400/20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-semibold">
              🚀 Get Pre-Qualified in Minutes
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-white to-yellow-600 bg-clip-text text-transparent">
            Business Lending
            <br />
            Pre-Qualification
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            Complete our quick application and receive a pre-qualification decision within 24 hours.
            <span className="text-yellow-400"> No impact to your credit score.</span>
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white/5 border-yellow-400/20 hover:border-yellow-400/50 transition-all" data-testid={`benefit-card-${index}`}>
              <CardContent className="pt-6 text-center">
                <div className="h-12 w-12 rounded-full bg-yellow-400/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-white/70">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pre-Qualification Form */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-black/60 border-yellow-400/30 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-yellow-400/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
              <CardTitle className="text-3xl text-white">Lending Pre-Qualification Application</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Get pre-approved in 24 hours • No credit score impact • 100% secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-white">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="bg-white/5 border-yellow-400/30 text-white"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="bg-white/5 border-yellow-400/30 text-white"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Label htmlFor="email" className="text-white">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-white/5 border-yellow-400/30 text-white"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="bg-white/5 border-yellow-400/30 text-white"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Business Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName" className="text-white">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        required
                        className="bg-white/5 border-yellow-400/30 text-white"
                        data-testid="input-business-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType" className="text-white">Business Structure *</Label>
                      <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                        <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-business-type">
                          <SelectValue placeholder="Select structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LLC">LLC</SelectItem>
                          <SelectItem value="Corporation">Corporation</SelectItem>
                          <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="S-Corp">S-Corporation</SelectItem>
                          <SelectItem value="C-Corp">C-Corporation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Label htmlFor="industry" className="text-white">Industry *</Label>
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g., Healthcare, Technology, Retail"
                        required
                        className="bg-white/5 border-yellow-400/30 text-white"
                        data-testid="input-industry"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearsInBusiness" className="text-white">Years in Business *</Label>
                      <Select value={formData.yearsInBusiness} onValueChange={(value) => setFormData({ ...formData, yearsInBusiness: value })}>
                        <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-years-in-business">
                          <SelectValue placeholder="Select years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                          <SelectItem value="1-2 years">1-2 years</SelectItem>
                          <SelectItem value="2-5 years">2-5 years</SelectItem>
                          <SelectItem value="5-10 years">5-10 years</SelectItem>
                          <SelectItem value="10+ years">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label htmlFor="annualRevenue" className="text-white">Annual Revenue *</Label>
                    <Select value={formData.annualRevenue} onValueChange={(value) => setFormData({ ...formData, annualRevenue: value })}>
                      <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-annual-revenue">
                        <SelectValue placeholder="Select annual revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under $100K">Under $100K</SelectItem>
                        <SelectItem value="$100K - $250K">$100K - $250K</SelectItem>
                        <SelectItem value="$250K - $500K">$250K - $500K</SelectItem>
                        <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                        <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                        <SelectItem value="$5M - $10M">$5M - $10M</SelectItem>
                        <SelectItem value="$10M+">$10M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Loan Details */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Loan Requirements
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="loanAmount" className="text-white">Loan Amount Needed *</Label>
                      <Select value={formData.loanAmount} onValueChange={(value) => setFormData({ ...formData, loanAmount: value })}>
                        <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-loan-amount">
                          <SelectValue placeholder="Select amount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$50K - $100K">$50K - $100K</SelectItem>
                          <SelectItem value="$100K - $250K">$100K - $250K</SelectItem>
                          <SelectItem value="$250K - $500K">$250K - $500K</SelectItem>
                          <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                          <SelectItem value="$1M - $3M">$1M - $3M</SelectItem>
                          <SelectItem value="$3M - $5M">$3M - $5M</SelectItem>
                          <SelectItem value="$5M - $10M">$5M - $10M</SelectItem>
                          <SelectItem value="$10M+">$10M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="loanPurpose" className="text-white">Loan Purpose *</Label>
                      <Select value={formData.loanPurpose} onValueChange={(value) => setFormData({ ...formData, loanPurpose: value })}>
                        <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-loan-purpose">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Working Capital">Working Capital</SelectItem>
                          <SelectItem value="Equipment Purchase">Equipment Purchase</SelectItem>
                          <SelectItem value="Commercial Real Estate">Commercial Real Estate</SelectItem>
                          <SelectItem value="Business Expansion">Business Expansion</SelectItem>
                          <SelectItem value="Inventory Financing">Inventory Financing</SelectItem>
                          <SelectItem value="Debt Consolidation">Debt Consolidation</SelectItem>
                          <SelectItem value="Bridge Loan">Bridge Loan</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <Label htmlFor="timeframe" className="text-white">Funding Timeframe *</Label>
                      <Select value={formData.timeframe} onValueChange={(value) => setFormData({ ...formData, timeframe: value })}>
                        <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-timeframe">
                          <SelectValue placeholder="When do you need funds?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Immediately">Immediately</SelectItem>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-3 months">1-3 months</SelectItem>
                          <SelectItem value="3+ months">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="creditScore" className="text-white">Credit Score Range</Label>
                      <Select value={formData.creditScore} onValueChange={(value) => setFormData({ ...formData, creditScore: value })}>
                        <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-credit-score">
                          <SelectValue placeholder="Select range (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Excellent (750+)">Excellent (750+)</SelectItem>
                          <SelectItem value="Good (700-749)">Good (700-749)</SelectItem>
                          <SelectItem value="Fair (650-699)">Fair (650-699)</SelectItem>
                          <SelectItem value="Poor (below 650)">Poor (below 650)</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label htmlFor="hasCollateral" className="text-white">Collateral Available?</Label>
                    <Select value={formData.hasCollateral} onValueChange={(value) => setFormData({ ...formData, hasCollateral: value })}>
                      <SelectTrigger className="bg-white/5 border-yellow-400/30 text-white" data-testid="select-collateral">
                        <SelectValue placeholder="Do you have collateral?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes - Real Estate">Yes - Real Estate</SelectItem>
                        <SelectItem value="Yes - Equipment">Yes - Equipment</SelectItem>
                        <SelectItem value="Yes - Inventory">Yes - Inventory</SelectItem>
                        <SelectItem value="Yes - Other Assets">Yes - Other Assets</SelectItem>
                        <SelectItem value="No - Unsecured">No - Unsecured Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="additionalNotes" className="text-white">Additional Information</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Tell us more about your business and financing needs..."
                    className="bg-white/5 border-yellow-400/30 text-white min-h-32"
                    data-testid="input-additional-notes"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-8 text-xl"
                    data-testid="button-submit-prequalification"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Processing Application...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-6 w-6" />
                        Submit Pre-Qualification Application
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-sm text-white/60 mt-4">
                    🔒 Your information is secure and will only be used for your loan application.
                    <br />
                    Submitting this form does not impact your credit score.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <GlobalFooter />
      
      {/* AI Concierge */}
      <SaintBrokerEnhanced />
    </div>
  );
}
