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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGHLSubmit } from '@/hooks/useGHLSubmit';
import { GHLFormType } from '@/config/ghl-forms';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const realEstateSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  propertyType: z.string().min(1, 'Select property type'),
  propertyAddress: z.string().min(5, 'Property address required'),
  propertyValue: z.string().min(1, 'Property value required'),
  loanAmount: z.string().min(1, 'Loan amount required'),
  projectType: z.string().optional(),
  timeline: z.string().optional(),
  exitStrategy: z.string().optional(),
  creditScore: z.string().optional(),
  experience: z.string().optional(),
});

type RealEstateFormData = z.infer<typeof realEstateSchema>;

interface RealEstateFormProps {
  onSuccess?: (data: RealEstateFormData) => void;
  onError?: (error: Error) => void;
}

export default function RealEstateForm({ onSuccess, onError }: RealEstateFormProps) {
  const { submit, isLoading, error } = useGHLSubmit();
  const [submitProgress, setSubmitProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<RealEstateFormData>({
    resolver: zodResolver(realEstateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      propertyType: '',
      propertyAddress: '',
      propertyValue: '',
      loanAmount: '',
      projectType: '',
      timeline: '',
      exitStrategy: '',
      creditScore: '',
      experience: '',
    },
  });

  const onSubmit = async (data: RealEstateFormData) => {
    setSubmitProgress(0);
    const progressInterval = setInterval(() => {
      setSubmitProgress((prev) => Math.min(prev + 10, 90));
    }, 150);

    const result = await submit(GHLFormType.REAL_ESTATE, data, {
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

  if (isSubmitted && !isLoading) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <CardTitle className="text-green-900">Application Submitted!</CardTitle>
              <CardDescription>Your real estate financing request received</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <p className="text-sm text-gray-700">
              ✓ Your application has been reviewed by our team<br />
              ✓ Expect to hear from us within 24 hours<br />
              ✓ We'll discuss your project and next steps
            </p>
          </div>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
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
        <CardTitle>Real Estate Financing Application</CardTitle>
        <CardDescription>Let's discuss your real estate project and financing needs</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
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

            {/* Property Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>

              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="multi-family">Multi-Family</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, State ZIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Property Value</FormLabel>
                    <FormControl>
                      <Input placeholder="$500,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Financing Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Financing Details</h3>

              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Loan Amount Needed</FormLabel>
                    <FormControl>
                      <Input placeholder="$250,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fix-flip">Fix & Flip</SelectItem>
                        <SelectItem value="buy-hold">Buy & Hold</SelectItem>
                        <SelectItem value="new-construction">New Construction</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="When do you need funding?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (within 30 days)</SelectItem>
                        <SelectItem value="60-days">60 days</SelectItem>
                        <SelectItem value="90-days">90 days</SelectItem>
                        <SelectItem value="6-months">6 months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Additional Information</h3>

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Real Estate Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="first-time">First-time investor</SelectItem>
                        <SelectItem value="some-experience">1-3 properties</SelectItem>
                        <SelectItem value="experienced">4-10 properties</SelectItem>
                        <SelectItem value="very-experienced">10+ properties</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exitStrategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Strategy</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="How do you plan to exit this investment? (e.g., sell, refinance, hold for rent)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Progress & Errors */}
            {isLoading && submitProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Submitting application...</span>
                  <span className="font-medium">{submitProgress}%</span>
                </div>
                <Progress value={submitProgress} className="h-2" />
              </div>
            )}

            {error && !isLoading && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Submission Failed</p>
                  <p className="text-sm text-red-800 mt-1">{error.message}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
