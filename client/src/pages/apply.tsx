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
      // Post to your GHL lead-capture endpoint
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
          loanAmount: data.loanAmount,
          type: data.loanPurpose,
          source: 'pre-qualification-form',
          notes: `Loan Purpose: ${data.loanPurpose}`
        })
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        
        toast({
          title: "Application Submitted! 🎉",
          description: "We've received your pre-qualification request. Check your email for next steps!",
          duration: 5000
        });

        // Redirect to client portal or success page after 2 seconds
        setTimeout(() => {
          setLocation('/client-portal');
        }, 2000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again or contact support.",
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-emerald-500/20 bg-slate-900/50 backdrop-blur">
            <CardContent className="pt-12 text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
              <p className="text-slate-300 mb-6">
                Thank you for your interest! We've received your pre-qualification request and will contact you within 24 hours.
              </p>
              <p className="text-sm text-slate-400">
                Check your email for next steps and your portal login information.
              </p>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-3xl text-white">Business Loan Pre-Qualification</CardTitle>
              <CardDescription className="text-slate-300 text-lg">
                Get pre-qualified in 60 seconds. No impact to your credit score.
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
                                placeholder="Smith"
                                className="bg-slate-800 border-slate-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              placeholder="john@company.com"
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
                          <FormLabel className="text-white">Phone Number</FormLabel>
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

                  {/* Loan Details */}
                  <div className="space-y-4 pt-4 border-t border-slate-700">
                    <h3 className="text-xl font-semibold text-white">Loan Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">How much do you need?</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="text"
                              placeholder="$100,000"
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
                          <FormLabel className="text-white">What will you use it for?</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue placeholder="Select purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="working-capital">Working Capital</SelectItem>
                              <SelectItem value="equipment">Equipment Purchase</SelectItem>
                              <SelectItem value="expansion">Business Expansion</SelectItem>
                              <SelectItem value="refinance">Refinance Existing Debt</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Consent */}
                  <div className="space-y-4 pt-4 border-t border-slate-700">
                    <FormField
                      control={form.control}
                      name="consentSMS"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-slate-300">
                              I consent to receive SMS notifications, alerts & occasional marketing communication from Saint Vision Group LLC. 
                              Message frequency varies. Message & data rates may apply. 
                              Text HELP to 949-546-1123 for assistance. You can reply STOP to unsubscribe at any time.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Get Pre-Qualified'
                    )}
                  </Button>

                  <Alert className="bg-slate-800/50 border-slate-700">
                    <AlertDescription className="text-slate-300 text-sm">
                      🔒 Your information is secure and confidential. This pre-qualification will not affect your credit score.
                    </AlertDescription>
                  </Alert>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
