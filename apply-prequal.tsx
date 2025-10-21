import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Loader2, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useGHLSubmit, GHL_FORMS } from '@/hooks/useGHLSubmit';

// Pre-Qualification Form Schema
const preQualSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  loanAmount: z.string().min(1, 'Loan amount is required'),
  loanPurpose: z.enum(['working-capital', 'equipment', 'expansion', 'refinance', 'other'], {
    required_error: 'Please select a loan purpose'
  }),
  consentSMS: z.boolean().refine(val => val === true, {
    message: 'You must consent to receive SMS notifications'
  })
});

type PreQualFormValues = z.infer<typeof preQualSchema>;

export default function ApplyPreQual() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { submitToGHL } = useGHLSubmit();

  const form = useForm<PreQualFormValues>({
    resolver: zodResolver(preQualSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      loanAmount: '',
      loanPurpose: undefined,
      consentSMS: false
    }
  });

  const onSubmit = async (data: PreQualFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Map your form fields to GHL field names
      const ghlData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        loan_amount: data.loanAmount,
        loan_purpose: data.loanPurpose,
        consent_sms: data.consentSMS ? 'yes' : 'no',
        source: 'pre-qualification-form'
      };

      // Submit DIRECTLY to GHL
      const result = await submitToGHL(GHL_FORMS.PRE_QUAL, ghlData);

      if (result.success) {
        setIsSuccess(true);
        
        toast({
          title: "Application Submitted! 🎉",
          description: "We've received your pre-qualification request. Check your email for next steps!",
          duration: 5000
        });
        
        // Optional: redirect after delay
        setTimeout(() => {
          setLocation('/');
        }, 3000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : 'Please try again',
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-800/90 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
                <p className="text-slate-300">
                  Thank you for applying with Saint Vision Group. We'll review your information and contact you shortly.
                </p>
                <Button 
                  onClick={() => setLocation('/')}
                  className="w-full"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <GlobalFooter />
      </>
    );
  }

  return (
    <>
      <GlobalHeader />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Pre-Qualification Application</h1>
            <p className="text-xl text-slate-300">
              Start your journey with Saint Vision Group
            </p>
          </div>

          {/* Form Card */}
          <Card className="bg-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Business Loan Pre-Qualification</CardTitle>
              <CardDescription className="text-slate-400">
                Complete this form to get pre-qualified for a business loan. We'll review your information and get back to you within 24 hours.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Your Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">First Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="John"
                                className="bg-slate-800 border-slate-700 text-white"
                              />
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
                            <FormLabel className="text-white">Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Doe"
                                className="bg-slate-800 border-slate-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="email"
                                placeholder="john@example.com"
                                className="bg-slate-800 border-slate-700 text-white"
                              />
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
                            <FormLabel className="text-white">Phone</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="tel"
                                placeholder="(555) 123-4567"
                                className="bg-slate-800 border-slate-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Loan Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Loan Details</h3>

                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Desired Loan Amount</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="$50,000"
                              className="bg-slate-800 border-slate-700 text-white"
                            />
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
                          <FormLabel className="text-white">Loan Purpose</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue placeholder="Select loan purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="working-capital">Working Capital</SelectItem>
                              <SelectItem value="equipment">Equipment Purchase</SelectItem>
                              <SelectItem value="expansion">Business Expansion</SelectItem>
                              <SelectItem value="refinance">Refinance</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Consent */}
                  <FormField
                    control={form.control}
                    name="consentSMS"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white">
                            I consent to receive SMS notifications about my application *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Pre-Qualification'
                    )}
                  </Button>

                  <p className="text-xs text-center text-slate-400">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="text-center mt-6">
            <Button
              variant="link"
              onClick={() => setLocation('/')}
              disabled={isSubmitting}
              className="text-white"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
