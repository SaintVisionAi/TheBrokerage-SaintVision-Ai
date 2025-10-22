import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import SignatureCapture from '@/components/signature/signature-capture';
import { useToast } from '@/hooks/use-toast';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Loader2, FileText, User, Building2, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

const applicationSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  businessName: z.string().min(2, 'Business name is required'),
  businessStructure: z.string().min(1, 'Please select business structure'),
  yearsInBusiness: z.string().min(1, 'Please select years in business'),
  industry: z.string().min(2, 'Industry is required'),
  annualRevenue: z.string().min(1, 'Please select annual revenue range'),
  monthlyRevenue: z.string().optional(),
  loanAmount: z.string().min(1, 'Please select loan amount'),
  loanPurpose: z.string().min(1, 'Please select loan purpose'),
  creditScore: z.string().optional(),
  fundingTimeframe: z.string().min(1, 'Please select funding timeframe'),
  businessDescription: z.string().optional(),
  taxReturns: z.string().optional(),
  bankStatements: z.string().optional(),
  businessLicense: z.string().optional(),
  collateral: z.string().optional(),
  additionalInfo: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the loan terms and conditions'),
  confirmAccuracy: z.boolean().refine(val => val === true, 'You must confirm the accuracy of your information'),
  authorizeCredit: z.boolean().refine(val => val === true, 'You must authorize credit inquiry'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
  signature: z.string().min(2, 'Your full name (signature) is required'),
  signatureDate: z.string().min(1, 'Date is required'),
  signatureData: z.string().optional(),
  signatureType: z.enum(['drawn', 'typed']).optional()
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function FullLendingApplicationPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSignatureCapture, setShowSignatureCapture] = useState(false);
  const [signatureData, setSignatureData] = useState<{
    data: string;
    type: 'drawn' | 'typed';
    consentChecks: Record<string, boolean>;
    signerName: string;
  } | null>(null);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      businessStructure: '',
      yearsInBusiness: '',
      industry: '',
      annualRevenue: '',
      monthlyRevenue: '',
      loanAmount: '',
      loanPurpose: '',
      creditScore: '',
      fundingTimeframe: '',
      businessDescription: '',
      taxReturns: '',
      bankStatements: '',
      businessLicense: '',
      collateral: '',
      additionalInfo: '',
      agreeToTerms: false,
      confirmAccuracy: false,
      authorizeCredit: false,
      agreeToPrivacy: false,
      signature: '',
      signatureDate: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/ghl/form-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          formId: '0zcz0ZlG2eEddg94wcbq',
          formData: data
        })
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }

      if (response.ok && result.success) {
        setIsSuccess(true);
        toast({
          title: "Application Submitted! 🎉",
          description: "You'll receive a text message within minutes with next steps.",
          duration: 5000
        });

        setTimeout(() => {
          setLocation('/prequal-success');
        }, 2000);
      } else {
        throw new Error(result.error || result.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Something went wrong. Please call us at (949) 546-1123",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <GlobalHeader />
        <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl text-center">
            <div className="mx-auto w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mb-8">
              <CheckCircle className="w-12 h-12 text-yellow-400" />
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold text-white mb-6 leading-tight">
              Application Submitted Successfully
            </h1>
            <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-300 mb-8 max-w-xl mx-auto">
              Your full lending application is being processed. You'll receive a text message within minutes and an email with next steps.
            </p>
            <Button 
              onClick={() => setLocation('/client-portal')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-6 text-lg rounded-xl"
            >
              Access Your Dashboard
            </Button>
          </div>
        </div>
        <GlobalFooter />
      </>
    );
  }

  return (
    <>
      <GlobalHeader />
      
      {/* Premium Background */}
      <div className="relative bg-black overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-400/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIEwgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 min-h-screen flex items-center justify-center pt-20 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-5xl text-center space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center justify-center">
              <Badge className="bg-yellow-400/25 text-yellow-300 border border-yellow-400/60 hover:bg-yellow-400/35 text-sm md:text-base px-4 py-2 font-semibold">
                📋 Full Lending Application
              </Badge>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  Complete Your
                </span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Funding Application
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/85 leading-relaxed font-light">
                Comprehensive application for <span className="font-semibold text-yellow-400">full funding consideration</span>
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/70">
                Takes 15-20 minutes • No credit impact • Fast approval
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-8">
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                <span className="text-2xl md:text-3xl mb-3 block">⚡</span>
                <h3 className="text-xs md:text-sm font-bold text-white mb-2">24-48 Hour Decision</h3>
                <p className="text-xs text-white/60 leading-snug">AI-powered approval</p>
              </div>

              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                <span className="text-2xl md:text-3xl mb-3 block">💰</span>
                <h3 className="text-xs md:text-sm font-bold text-white mb-2">$50K - $5M</h3>
                <p className="text-xs text-white/60 leading-snug">Flexible amounts</p>
              </div>

              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                <span className="text-2xl md:text-3xl mb-3 block">🔓</span>
                <h3 className="text-xs md:text-sm font-bold text-white mb-2">No Collateral</h3>
                <p className="text-xs text-white/60 leading-snug">Unsecured options</p>
              </div>

              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                <span className="text-2xl md:text-3xl mb-3 block">📈</span>
                <h3 className="text-xs md:text-sm font-bold text-white mb-2">Rates from 9%</h3>
                <p className="text-xs text-white/60 leading-snug">Transparent terms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-black min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-white/[0.07] to-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            {/* Form Header */}
            <div className="text-center mb-12">
              <div className="mx-auto w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-white mb-3">
                Lending Application
              </h2>
              <p className="text-[clamp(0.875rem,1.5vw,1rem)] text-gray-400">
                Get pre-approved in 24 hours • 100% secure • No credit score impact
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-yellow-400">
                      Personal Information
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">First Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="John"
                              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Last Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Smith"
                              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              placeholder="john@company.com"
                              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Phone Number *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel"
                              placeholder="(555) 123-4567"
                              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-yellow-400">
                      Business Information
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">Business Name *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="ABC Company LLC"
                            className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessStructure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Business Structure *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select structure" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="llc">LLC</SelectItem>
                              <SelectItem value="corporation">Corporation</SelectItem>
                              <SelectItem value="s-corp">S-Corporation</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                              <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearsInBusiness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Years in Business *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select years" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                              <SelectItem value="1-2">1-2 years</SelectItem>
                              <SelectItem value="2-5">2-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Industry *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., Healthcare, Technology, Retail"
                              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="annualRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Annual Revenue *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="0-100k">$0 - $100K</SelectItem>
                              <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                              <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                              <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                              <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                              <SelectItem value="5m+">$5M+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Briefly describe your business operations..."
                            className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Loan Details */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-yellow-400">
                      Loan Requirements
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Loan Amount Needed *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select amount" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="$50,000">$50,000</SelectItem>
                              <SelectItem value="$100,000">$100,000</SelectItem>
                              <SelectItem value="$250,000">$250,000</SelectItem>
                              <SelectItem value="$500,000">$500,000</SelectItem>
                              <SelectItem value="$1,000,000">$1,000,000</SelectItem>
                              <SelectItem value="$2,500,000">$2,500,000</SelectItem>
                              <SelectItem value="$5,000,000">$5,000,000+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="loanPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Loan Purpose *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="working-capital">Working Capital</SelectItem>
                              <SelectItem value="equipment">Equipment Purchase</SelectItem>
                              <SelectItem value="expansion">Business Expansion</SelectItem>
                              <SelectItem value="inventory">Inventory</SelectItem>
                              <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fundingTimeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Funding Timeframe *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="asap">ASAP (Within 7 days)</SelectItem>
                              <SelectItem value="2-weeks">2 weeks</SelectItem>
                              <SelectItem value="30-days">30 days</SelectItem>
                              <SelectItem value="60-days">60 days</SelectItem>
                              <SelectItem value="90-days">90 days</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Credit Score (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number"
                              placeholder="e.g., 750"
                              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Documentation */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-yellow-400">
                    Documentation
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="taxReturns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Tax Returns</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="2-years">2 Years Available</SelectItem>
                              <SelectItem value="1-year">1 Year Available</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="not-available">Not Available</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankStatements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Bank Statements</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="3-months">3 Months</SelectItem>
                              <SelectItem value="6-months">6 Months</SelectItem>
                              <SelectItem value="12-months">12 Months</SelectItem>
                              <SelectItem value="not-available">Not Available</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="collateral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">Do you have collateral available? (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black border-white/20">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="maybe">Maybe</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Info */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Anything else we should know about your business or application?"
                            className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20 min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* DISCLOSURES & LEGAL ACKNOWLEDGMENT SECTION */}
                <div className="space-y-6 pt-6 border-t-2 border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-yellow-300 mb-2">
                        Disclosures & Legal Acknowledgment
                      </h3>
                      <p className="text-white/70 text-sm">Please read and acknowledge all disclosures below before submitting your application.</p>
                    </div>
                  </div>

                  {/* Disclosure Checkboxes */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-black/30 p-4 rounded-lg border border-yellow-400/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white text-sm font-medium cursor-pointer">
                              I acknowledge and agree to all loan terms and conditions *
                            </FormLabel>
                            <p className="text-xs text-white/60">
                              I understand the interest rates, fees, repayment terms, and other conditions of this loan.
                            </p>
                            <FormMessage className="text-red-400" />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmAccuracy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-black/30 p-4 rounded-lg border border-yellow-400/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white text-sm font-medium cursor-pointer">
                              I confirm that all information provided is accurate and complete *
                            </FormLabel>
                            <p className="text-xs text-white/60">
                              All details in this application are true and complete to the best of my knowledge.
                            </p>
                            <FormMessage className="text-red-400" />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="authorizeCredit"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-black/30 p-4 rounded-lg border border-yellow-400/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white text-sm font-medium cursor-pointer">
                              I authorize Saint Vision Group to run a soft credit inquiry *
                            </FormLabel>
                            <p className="text-xs text-white/60">
                              This will not impact your credit score. A hard pull will only occur with your explicit consent.
                            </p>
                            <FormMessage className="text-red-400" />
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeToPrivacy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-black/30 p-4 rounded-lg border border-yellow-400/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white text-sm font-medium cursor-pointer">
                              I agree to the Privacy Policy and Terms of Service *
                            </FormLabel>
                            <p className="text-xs text-white/60">
                              I have read and understand the privacy policy and agree to the terms of service.
                            </p>
                            <FormMessage className="text-red-400" />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* SIGNATURE & DATE SECTION */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold text-yellow-400">
                      Signature & Authorization
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="signature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Your Full Name (as Signature) *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <p className="text-xs text-white/50 mt-2">By entering your name, you electronically sign this application.</p>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="signatureDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm font-medium">Date of Signature *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20"
                            />
                          </FormControl>
                          <p className="text-xs text-white/50 mt-2">Today's date</p>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-black/50 border border-yellow-400/30 rounded-lg p-4">
                    <p className="text-xs text-white/70 leading-relaxed">
                      <span className="font-semibold text-yellow-300">Electronic Signature Statement:</span> I understand that by providing my name above, I am electronically signing this application and all attached disclosures. This electronic signature has the same legal effect as a handwritten signature and is binding under applicable law. I acknowledge that I have read and understand all disclosures and terms contained in this application.
                    </p>
                  </div>
                </div>

                {/* VISUAL SIGNATURE CAPTURE SECTION */}
                {!signatureData && (
                  <div className="pt-6 border-t border-white/10">
                    <Button
                      type="button"
                      onClick={() => setShowSignatureCapture(true)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      Add Digital Signature
                    </Button>
                    <p className="text-center text-xs text-yellow-400/70 mt-3">
                      You can sign with your finger or mouse • Typed signature also available
                    </p>
                  </div>
                )}

                {/* Signature Capture Modal */}
                {showSignatureCapture && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
                      <SignatureCapture
                        onSignatureComplete={(data) => {
                          setSignatureData(data);
                          setShowSignatureCapture(false);
                          form.setValue('signatureData', data.data);
                          form.setValue('signatureType', data.type);
                          toast({
                            title: 'Signature Captured',
                            description: 'Your digital signature has been securely captured.',
                          });
                        }}
                        onCancel={() => {
                          setShowSignatureCapture(false);
                        }}
                        loanAmount={form.watch('loanAmount') || ''}
                        applicantName={`${form.watch('firstName')} ${form.watch('lastName')}`}
                      />
                    </div>
                  </div>
                )}

                {/* Signature Confirmed Section */}
                {signatureData && (
                  <div className="pt-6 border-t border-white/10">
                    <div className="bg-gradient-to-r from-green-900/30 to-black/30 border border-green-400/30 rounded-lg p-6 mb-6">
                      <div className="flex items-start gap-3 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-bold text-green-300 mb-1">
                            Signature Captured ✓
                          </h3>
                          <p className="text-white/70 text-sm">
                            Your digital signature has been securely captured and will be included with your application.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSignatureData(null);
                            form.setValue('signatureData', '');
                            form.setValue('signatureType', undefined);
                          }}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Recapture Signature
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6 border-t border-white/10">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !signatureData}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Submitting Application...
                      </span>
                    ) : !signatureData ? (
                      'Complete Signature to Submit'
                    ) : (
                      'Submit Full Application'
                    )}
                  </Button>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    * Required fields. Digital signature required. We'll never share your information.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </>
  );
}
