import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Loader2, CheckCircle2 } from 'lucide-react';

const applicationSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  businessName: z.string().min(2, 'Business name is required'),
  businessStructure: z.string().min(1, 'Please select business structure'),
  yearsInBusiness: z.string().min(1, 'Please select years in business'),
  annualRevenue: z.string().min(1, 'Please select annual revenue'),
  loanAmount: z.string().min(1, 'Please enter desired loan amount'),
  loanPurpose: z.string().min(1, 'Please select loan purpose'),
  fundingTimeframe: z.string().min(1, 'Please select funding timeframe'),
  creditScore: z.string().optional(),
  businessDescription: z.string().optional(),
  additionalInfo: z.string().optional()
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function FullLendingApplicationPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      annualRevenue: '',
      loanAmount: '',
      loanPurpose: '',
      fundingTimeframe: '',
      creditScore: '',
      businessDescription: '',
      additionalInfo: ''
    }
  });

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
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
          source: 'full-lending-application',
          notes: `Structure: ${data.businessStructure} | Years: ${data.yearsInBusiness} | Revenue: ${data.annualRevenue} | Timeframe: ${data.fundingTimeframe} | Credit: ${data.creditScore || 'Not provided'} | Business: ${data.businessDescription || 'Not provided'} | Additional: ${data.additionalInfo || 'None'}`
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Application Submitted! 🎉",
          description: "You'll receive a text message within minutes with next steps.",
          duration: 5000
        });

        setTimeout(() => {
          setLocation('/prequal-success');
        }, 1500);
      } else {
        throw new Error(result.error || result.message || 'Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit application",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Full Lending Application</h1>
            <p className="text-lg text-gray-600">Complete this application for funding consideration. Takes 15-20 minutes.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <hr />

                  <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Business Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessStructure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Structure</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select structure" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sole-proprietor">Sole Proprietorship</SelectItem>
                              <SelectItem value="llc">LLC</SelectItem>
                              <SelectItem value="corp">Corporation</SelectItem>
                              <SelectItem value="partnership">Partnership</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsInBusiness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years in Business</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select years" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-1">Under 1 year</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10plus">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="annualRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Revenue</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select revenue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-250k">Under $250K</SelectItem>
                              <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                              <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                              <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                              <SelectItem value="5m-plus">$5M+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your business" 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <hr />

                  <h3 className="text-lg font-semibold text-gray-900">Loan Details</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Loan Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="$" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="loanPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Purpose</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="working-capital">Working Capital</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="expansion">Expansion</SelectItem>
                              <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fundingTimeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>When do you need funding?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="asap">ASAP</SelectItem>
                              <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                              <SelectItem value="1-month">1 month</SelectItem>
                              <SelectItem value="3-months">3 months</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="creditScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credit Score (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Approximate score" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional details we should know?" 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What Happens Next?</h3>
            <ol className="space-y-2 text-blue-800">
              <li className="flex gap-3">
                <span className="font-semibold">1.</span>
                <span>Your application is reviewed by our team</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">2.</span>
                <span>You'll receive a text message within 1 hour with updates</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">3.</span>
                <span>Decision provided within 24-48 hours</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold">4.</span>
                <span>Funding available as soon as closing</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
