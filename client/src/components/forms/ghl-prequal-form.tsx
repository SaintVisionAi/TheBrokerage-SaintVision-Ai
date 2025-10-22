import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGHLSubmit, createCommonValidation } from '@/hooks/useGHLSubmit';
import { GHLFormType } from '@/config/ghl-forms';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const preQualSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  industry: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  annualRevenue: z.string().optional(),
  loanAmount: z.string().min(1, 'Loan amount is required'),
  loanPurpose: z.string().optional(),
  creditScore: z.string().optional(),
  hasCollateral: z.string().optional(),
  serviceType: z.enum(['lending', 'real-estate', 'investments']),
  additionalNotes: z.string().optional(),
});

type PreQualFormData = z.infer<typeof preQualSchema>;

interface GHLPreQualFormProps {
  onSuccess?: (data: PreQualFormData) => void;
  onError?: (error: Error) => void;
  initialData?: Partial<PreQualFormData>;
  embedded?: boolean;
}

export default function GHLPreQualForm({
  onSuccess,
  onError,
  initialData,
  embedded = false,
}: GHLPreQualFormProps) {
  const { submit, isLoading, error } = useGHLSubmit();
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<PreQualFormData>({
    resolver: zodResolver(preQualSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      businessName: initialData?.businessName || '',
      businessType: initialData?.businessType || '',
      industry: initialData?.industry || '',
      yearsInBusiness: initialData?.yearsInBusiness || '',
      annualRevenue: initialData?.annualRevenue || '',
      loanAmount: initialData?.loanAmount || '',
      loanPurpose: initialData?.loanPurpose || '',
      creditScore: initialData?.creditScore || '',
      hasCollateral: initialData?.hasCollateral || '',
      serviceType: initialData?.serviceType || 'lending',
      additionalNotes: initialData?.additionalNotes || '',
    },
  });

  const onSubmit = async (data: PreQualFormData) => {
    setSubmitProgress(0);
    const progressInterval = setInterval(() => {
      setSubmitProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    const result = await submit(GHLFormType.PRE_QUAL, data, {
      showToast: true,
      onSuccess: (response) => {
        clearInterval(progressInterval);
        setSubmitProgress(100);
        setIsSubmitted(true);
        onSuccess?.(data);
      },
      onError: (error) => {
        clearInterval(progressInterval);
        onError?.(error);
      },
    });

    clearInterval(progressInterval);
  };

  if (isSubmitted && !isLoading) {
    return (
      <Card className="bg-gradient-to-b from-emerald-500/10 to-emerald-600/10 border-emerald-400/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-400/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-emerald-400">Pre-Qualification Submitted!</CardTitle>
              <CardDescription>Your application has been submitted to our system</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-black/20 rounded-lg">
              <p className="text-sm text-gray-300 mb-3">
                ✅ Your pre-qualification has been successfully submitted. Here's what happens next:
              </p>
              <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
                <li>Our team will review your information within 24 hours</li>
                <li>You'll receive an email confirmation with your application ID</li>
                <li>We'll contact you to schedule a discovery call if additional information is needed</li>
                <li>You'll get a preliminary approval decision within 48 hours</li>
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-black/40 rounded-lg border border-emerald-400/20">
                <p className="text-xs text-emerald-400">Application ID</p>
                <p className="text-sm font-mono text-white mt-1">PRE-{Date.now().toString().slice(-8)}</p>
              </div>
              <div className="p-3 bg-black/40 rounded-lg border border-emerald-400/20">
                <p className="text-xs text-emerald-400">Status</p>
                <p className="text-sm font-semibold text-white mt-1">Under Review</p>
              </div>
            </div>

            <Button
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
                setSubmitProgress(0);
              }}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-semibold"
            >
              Submit Another Application
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'bg-black/40 border-yellow-400/20',
      embedded && 'border-0 bg-transparent'
    )}>
      <CardHeader>
        <CardTitle className="text-yellow-400">Pre-Qualification Form</CardTitle>
        <CardDescription>Quick assessment to determine your eligibility</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">1</Badge>
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
                          className="bg-black/50 border-yellow-400/30 text-white"
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
                          className="bg-black/50 border-yellow-400/30 text-white"
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
                          className="bg-black/50 border-yellow-400/30 text-white"
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
                          type="tel"
                          placeholder="(555) 123-4567"
                          className="bg-black/50 border-yellow-400/30 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Business Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">2</Badge>
                <h3 className="font-semibold text-white">Business Information</h3>
              </div>

              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Business Name"
                        className="bg-black/50 border-yellow-400/30 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/50 border-yellow-400/30 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-yellow-400/30 text-white">
                          <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="corp">Corporation</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Industry</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Restaurant, Technology"
                          className="bg-black/50 border-yellow-400/30 text-white"
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
                  name="yearsInBusiness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Years in Business</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-black/50 border-yellow-400/30 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annualRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Annual Revenue</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="$0"
                          className="bg-black/50 border-yellow-400/30 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Funding Request Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">3</Badge>
                <h3 className="font-semibold text-white">Funding Request</h3>
              </div>

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">What are you looking to fund? *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/50 border-yellow-400/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-yellow-400/30 text-white">
                        <SelectItem value="lending">Business Lending</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="investments">Investments</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Loan Amount Needed *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$50,000"
                        className="bg-black/50 border-yellow-400/30 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      We offer loans from $50K to $5M
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loanPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Purpose of Funds</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Equipment purchase, working capital, etc."
                        className="bg-black/50 border-yellow-400/30 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Credit & Collateral Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">4</Badge>
                <h3 className="font-semibold text-white">Credit & Collateral</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="creditScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Credit Score Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/50 border-yellow-400/30 text-white">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-yellow-400/30 text-white">
                          <SelectItem value="excellent">Excellent (750+)</SelectItem>
                          <SelectItem value="good">Good (700-749)</SelectItem>
                          <SelectItem value="fair">Fair (650-699)</SelectItem>
                          <SelectItem value="poor">Poor (Below 650)</SelectItem>
                          <SelectItem value="unknown">Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasCollateral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Do you have collateral?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/50 border-yellow-400/30 text-white">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-yellow-400/30 text-white">
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="maybe">Maybe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Additional Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us anything else that might help with your application..."
                        className="bg-black/50 border-yellow-400/30 text-white min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Progress Bar */}
            {isLoading && submitProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Submitting your application...</span>
                  <span className="text-yellow-400 font-medium">{submitProgress}%</span>
                </div>
                <Progress value={submitProgress} className="h-2" />
              </div>
            )}

            {/* Error Display */}
            {error && !isLoading && (
              <div className="p-3 bg-red-400/10 border border-red-400/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Submission Failed</p>
                  <p className="text-sm text-red-300 mt-1">{error.message}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Pre-Qualification'
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              Your information is secure and will never be shared without your permission.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
