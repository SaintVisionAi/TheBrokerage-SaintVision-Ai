import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGHLSubmit, GHLFormType } from '@/hooks/useGHLSubmit';
import { Loader2, CheckCircle } from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

const investmentSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  investmentAmount: z.string().min(1, 'Investment amount required'),
  investmentType: z.string().min(1, 'Select investment type'),
  timeframe: z.string().optional(),
  experience: z.string().optional(),
  objectives: z.string().optional(),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

export default function InvestmentIntakeForm() {
  const { submit, isLoading } = useGHLSubmit();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      investmentAmount: '',
      investmentType: '',
      timeframe: '',
      experience: '',
      objectives: '',
    },
  });

  const onSubmit = async (data: InvestmentFormData) => {
    await submit(GHLFormType.INVESTMENT, data, {
      showToast: true,
      onSuccess: () => {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          form.reset();
        }, 3000);
      },
    });
  };

  if (isSubmitted) {
    return (
      <>
        <GlobalHeader />
        <div className="bg-black min-h-screen px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-b from-blue-500/10 to-blue-600/10 border-blue-400/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-400/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-blue-400">Investment Application Submitted!</CardTitle>
                    <CardDescription>Thank you for your interest</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Our investment team will review your application and contact you shortly.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <GlobalFooter />
      </>
    );
  }

  return (
    <>
      <GlobalHeader />
      <div className="bg-black min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">Investment Opportunity</h1>
            <p className="text-lg text-gray-400">
              Join our exclusive investment community and grow your wealth
            </p>
          </div>

          <Card className="bg-black/40 border-blue-400/20">
            <CardHeader>
              <CardTitle className="text-blue-400">Investment Application</CardTitle>
              <CardDescription>Tell us about your investment interests</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">1</Badge>
                      <h3 className="font-semibold text-white">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">First Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                className="bg-black/50 border-blue-400/30 text-white"
                                {...field}
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
                            <FormLabel className="text-gray-300">Last Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                className="bg-black/50 border-blue-400/30 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="bg-black/50 border-blue-400/30 text-white"
                                {...field}
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
                            <FormLabel className="text-gray-300">Phone *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(555) 123-4567"
                                className="bg-black/50 border-blue-400/30 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">2</Badge>
                      <h3 className="font-semibold text-white">Investment Details</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="investmentAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Investment Amount *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="$50,000"
                              className="bg-black/50 border-blue-400/30 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Investment Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-blue-400/30 text-white">
                                <SelectValue placeholder="Select investment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-blue-400/30">
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="business">Business Venture</SelectItem>
                              <SelectItem value="debt">Debt Investment</SelectItem>
                              <SelectItem value="equity">Equity Investment</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Investment Timeframe</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-black/50 border-blue-400/30 text-white">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-black border-blue-400/30">
                              <SelectItem value="1-year">1 Year</SelectItem>
                              <SelectItem value="3-year">3 Years</SelectItem>
                              <SelectItem value="5-year">5 Years</SelectItem>
                              <SelectItem value="10-year">10+ Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">3</Badge>
                      <h3 className="font-semibold text-white">Additional Information</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Investment Experience</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your investment experience..."
                              className="bg-black/50 border-blue-400/30 text-white min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="objectives"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Investment Objectives</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What are your investment goals?"
                              className="bg-black/50 border-blue-400/30 text-white min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Submitting...
                        </span>
                      ) : (
                        'Submit Investment Application'
                      )}
                    </Button>
                    <p className="text-center text-sm text-gray-400 mt-4">
                      * Required fields. We'll review your application promptly.
                    </p>
                  </div>
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
