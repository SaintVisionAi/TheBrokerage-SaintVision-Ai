import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Loader2, FileText, User, Building2, DollarSign } from 'lucide-react';
import { useLocation } from 'wouter';

// 🔥 EXACT FORM SCHEMA FROM YOUR GHL FORM
const preQualSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  businessName: z.string().min(2, 'Business name is required'),
  businessStructure: z.string().min(1, 'Please select business structure'),
  industry: z.string().min(2, 'Industry is required'),
  yearsInBusiness: z.string().min(1, 'Please select years in business'),
  annualRevenue: z.string().min(1, 'Please select annual revenue range'),
  loanAmount: z.string().min(1, 'Please select loan amount'),
  loanPurpose: z.string().min(1, 'Please select loan purpose'),
  fundingTimeframe: z.string().min(1, 'Please select funding timeframe'),
  creditScore: z.string().optional(),
  additionalInfo: z.string().optional()
});

type PreQualFormValues = z.infer<typeof preQualSchema>;

export default function Apply() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<PreQualFormValues>({
    resolver: zodResolver(preQualSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      businessStructure: '',
      industry: '',
      yearsInBusiness: '',
      annualRevenue: '',
      loanAmount: '',
      loanPurpose: '',
      fundingTimeframe: '',
      creditScore: '',
      additionalInfo: ''
    }
  });

  const onSubmit = async (data: PreQualFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 🔥 POST TO CORRECT ENDPOINT
      const response = await fetch('/api/ghl/lead-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          businessName: data.businessName,
          loanAmount: data.loanAmount,
          type: data.loanPurpose,
          source: 'pre-qualification-form',
          notes: `Business: ${data.businessName} | Structure: ${data.businessStructure} | Industry: ${data.industry} | Years: ${data.yearsInBusiness} | Revenue: ${data.annualRevenue} | Timeframe: ${data.fundingTimeframe} | Credit: ${data.creditScore || 'Not provided'} | Additional: ${data.additionalInfo || 'None'}`
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        
        toast({
          title: "Application Submitted! 🎉",
          description: "You'll receive a text message within minutes. Check your email for next steps!",
          duration: 5000
        });

        setTimeout(() => {
          setLocation('/client-portal');
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
              <FileText className="w-12 h-12 text-yellow-400" />
            </div>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold text-white mb-6 leading-tight">
              Application Submitted Successfully
            </h1>
            <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-300 mb-8 max-w-xl mx-auto">
              Your pre-qualification is being processed. You'll receive a text message within minutes and an email with your next steps.
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
      
      {/* Hero Section */}
      <div className="bg-black text-white pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-6 py-2 mb-8">
            <span className="text-yellow-400 text-sm font-medium">🚀 Get Pre-Qualified in Minutes</span>
          </div>
          
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-semibold mb-6 leading-[1.1] tracking-tight">
            Business Lending<br />
            <span className="text-yellow-400">Pre-Qualification</span>
          </h1>
          
          <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-300 mb-4 max-w-3xl mx-auto">
            Complete our quick application and receive a pre-qualification decision within 24 hours.
          </p>
          <p className="text-[clamp(0.875rem,1.5vw,1.125rem)] text-yellow-400 font-medium">
            No impact to your credit score.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mt-16">
          {[
            { icon: '⚡', title: '24-48 Hour Decision', desc: 'AI-powered pre-qualification with fast approval' },
            { icon: '💰', title: '$50K - $5M Available', desc: 'Flexible loan amounts for any business need' },
            { icon: '🔓', title: 'No Collateral Required', desc: 'Unsecured options for qualified borrowers' },
            { icon: '📈', title: 'Rates from 9%', desc: 'Competitive rates with transparent terms' }
          ].map((benefit, i) => (
            <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-400">{benefit.desc}</p>
            </div>
          ))}
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
                Lending Pre-Qualification Application
              </h2>
              <p className="text-[clamp(0.875rem,1.5vw,1rem)] text-gray-400">
                Get pre-approved in 24 hours • No credit score impact • 100% secure
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
                                <SelectValue placeholder="Select annual revenue range" />
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
                </div>

                {/* Loan Requirements */}
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
                              <SelectItem value="$2,000,000+">$2,000,000+</SelectItem>
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
                              <SelectItem value="refinance">Refinance Debt</SelectItem>
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
                                <SelectValue placeholder="When do you need funds?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="asap">ASAP (Within 1 week)</SelectItem>
                              <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                              <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                              <SelectItem value="1-3-months">1-3 months</SelectItem>
                              <SelectItem value="3-6-months">3-6 months</SelectItem>
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
                          <FormLabel className="text-white text-sm font-medium">Credit Score Range</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-white/20 text-white h-12 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20">
                                <SelectValue placeholder="Select range (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-white/20">
                              <SelectItem value="excellent">Excellent (720+)</SelectItem>
                              <SelectItem value="good">Good (680-719)</SelectItem>
                              <SelectItem value="fair">Fair (640-679)</SelectItem>
                              <SelectItem value="poor">Poor (Below 640)</SelectItem>
                              <SelectItem value="not-sure">Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm font-medium">Additional Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Tell us more about your business and financing needs..."
                            rows={5}
                            className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 rounded-xl focus:border-yellow-400 focus:ring-yellow-400/20 resize-none"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-8 rounded-xl shadow-lg shadow-yellow-400/20 transition-all hover:shadow-yellow-400/40 hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Processing Your Application...
                    </>
                  ) : (
                    <>
                      ✓ Submit Pre-Qualification Application
                    </>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-400">
                    🔒 Your information is secure and will only be used for your loan application.<br />
                    <span className="text-yellow-400">Submitting this form does not impact your credit score.</span>
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
