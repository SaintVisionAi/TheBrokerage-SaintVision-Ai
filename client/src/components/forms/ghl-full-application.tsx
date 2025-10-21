import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useGHLSubmit, GHLFormType } from '@/hooks/useGHLSubmit';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const fullAppSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  businessName: z.string().min(2, 'Business name required'),
  businessStructure: z.string().min(1, 'Select business structure'),
  taxId: z.string().optional(),
  yearsInBusiness: z.string().min(1, 'Years required'),
  monthlyRevenue: z.string().min(1, 'Monthly revenue required'),
  businessAddress: z.string().min(5, 'Business address required'),
  loanAmount: z.string().min(1, 'Loan amount required'),
  loanPurpose: z.string().min(10, 'Loan purpose required'),
  creditScore: z.string().optional(),
  collateralType: z.string().optional(),
  collateralValue: z.string().optional(),
  businessDescription: z.string().optional(),
});

type FullAppFormData = z.infer<typeof fullAppSchema>;

interface FullApplicationProps {
  onSuccess?: (data: FullAppFormData) => void;
  onError?: (error: Error) => void;
}

export default function FullApplicationForm({ onSuccess, onError }: FullApplicationProps) {
  const { submit, isLoading, error } = useGHLSubmit();
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<FullAppFormData>({
    resolver: zodResolver(fullAppSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      businessStructure: '',
      taxId: '',
      yearsInBusiness: '',
      monthlyRevenue: '',
      businessAddress: '',
      loanAmount: '',
      loanPurpose: '',
      creditScore: '',
      collateralType: '',
      collateralValue: '',
      businessDescription: '',
    },
  });

  const onSubmit = async (data: FullAppFormData) => {
    setSubmitProgress(0);
    const progressInterval = setInterval(() => {
      setSubmitProgress((prev) => Math.min(prev + 10, 90));
    }, 150);

    const result = await submit(GHLFormType.FULL_APPLICATION, data, {
      showToast: true,
      onSuccess: () => {
        clearInterval(progressInterval);
        setSubmitProgress(100);
        setIsSubmitted(true);
        onSuccess?.(data);
      },
      onError: (err) => {
        clearInterval(progressInterval);
        onError?.(err);
      },
    });

    clearInterval(progressInterval);
  };

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Business Details' },
    { number: 3, title: 'Loan Information' },
    { number: 4, title: 'Credit & Collateral' },
  ];

  if (isSubmitted && !isLoading) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <CardTitle className="text-green-900">Application Submitted!</CardTitle>
              <CardDescription>Your full application has been received</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <p className="text-sm text-gray-700">
              ✓ Your application has been submitted and is being reviewed<br />
              ✓ You'll receive updates via email<br />
              ✓ Expected decision: 24-48 hours
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600">Application ID: APP-{Date.now().toString().slice(-8)}</p>
          </div>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
              setCurrentStep(1);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Full Lending Application</CardTitle>
        <CardDescription>Complete information for loan approval</CardDescription>

        {/* Progress Steps */}
        <div className="mt-6 flex gap-4 items-center">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(step.number)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number}
              </button>
              <span className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.title}
              </span>
              {idx < steps.length - 1 && (
                <div className={`h-1 w-8 mx-2 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Personal Information</h3>

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-4">
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Business Details</h3>

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

                <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="sole">Sole Proprietor</SelectItem>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="corp">Corporation</SelectItem>
                            <SelectItem value="s-corp">S-Corporation</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsInBusiness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years in Business</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="monthlyRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Revenue</FormLabel>
                      <FormControl>
                        <Input placeholder="$0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your business..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Loan Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Loan Information</h3>

                <FormField
                  control={form.control}
                  name="loanAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount Needed</FormLabel>
                      <FormControl>
                        <Input placeholder="$50,000" {...field} />
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
                      <FormLabel>Purpose of Funds</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe how you'll use the funds..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Credit & Collateral */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Credit & Collateral</h3>

                <FormField
                  control={form.control}
                  name="creditScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Score Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                  name="collateralType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collateral Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Equipment, Property, Inventory" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collateralValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collateral Value</FormLabel>
                      <FormControl>
                        <Input placeholder="$0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Progress Bar */}
            {isLoading && submitProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Submitting application...</span>
                  <span className="font-medium">{submitProgress}%</span>
                </div>
                <Progress value={submitProgress} className="h-2" />
              </div>
            )}

            {/* Error Display */}
            {error && !isLoading && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Submission Failed</p>
                  <p className="text-sm text-red-800 mt-1">{error.message}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1 || isLoading}
              >
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
