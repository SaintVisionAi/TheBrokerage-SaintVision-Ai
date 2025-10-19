import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SignatureCapture from '@/components/signature/signature-capture';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Building,
  User,
  DollarSign,
  FileText,
  PenTool,
  Send
} from 'lucide-react';
import { useLocation } from 'wouter';

// Form validation schema
const applicationFormSchema = z.object({
  // Business Information
  businessName: z.string().min(2, 'Business name is required'),
  ein: z.string().optional(),
  businessType: z.string().min(1, 'Business type is required'),
  yearsInBusiness: z.string().min(1, 'Years in business is required'),
  monthlyRevenue: z.string().min(1, 'Monthly revenue is required'),
  
  // Personal Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  ssn: z.string().optional(),
  creditScore: z.string().optional(),
  
  // Loan Details
  loanProduct: z.string().min(1, 'Please select a loan product'),
  loanAmount: z.string().min(1, 'Loan amount is required'),
  loanPurpose: z.string().min(1, 'Loan purpose is required'),
  
  // Consents
  consentCreditCheck: z.boolean().refine(val => val === true, {
    message: 'You must consent to credit check'
  }),
  consentBusinessVerification: z.boolean().refine(val => val === true, {
    message: 'You must consent to business verification'
  }),
  consentTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to terms and conditions'
  }),
  consentPrivacy: z.boolean().refine(val => val === true, {
    message: 'You must agree to privacy policy'
  })
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

interface LoanProduct {
  id: string;
  name: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  minRate: string;
  maxRate: string;
}

export default function Apply() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [signatureData, setSignatureData] = useState<string>('');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 5;

  // Get query params for pre-selected product
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedProduct = urlParams.get('product');
  const preSelectedCategory = urlParams.get('category');

  // Fetch loan products
  const { data: loanProducts = [], isLoading: isLoadingProducts } = useQuery<LoanProduct[]>({
    queryKey: ['/api/loan-products']
  });

  // Initialize form
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      businessName: '',
      ein: '',
      businessType: '',
      yearsInBusiness: '',
      monthlyRevenue: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ssn: '',
      creditScore: '',
      loanProduct: '',
      loanAmount: '',
      loanPurpose: '',
      consentCreditCheck: false,
      consentBusinessVerification: false,
      consentTerms: false,
      consentPrivacy: false
    }
  });

  // Pre-select product if provided in URL
  useEffect(() => {
    if (preSelectedProduct && loanProducts.length > 0) {
      const product = loanProducts.find(p => 
        p.name === preSelectedProduct || p.category === preSelectedCategory
      );
      if (product) {
        form.setValue('loanProduct', product.id);
      }
    }
  }, [preSelectedProduct, preSelectedCategory, loanProducts, form]);

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step before proceeding
  const validateStep = async () => {
    let fieldsToValidate: (keyof ApplicationFormValues)[] = [];
    
    switch(currentStep) {
      case 1:
        fieldsToValidate = ['businessName', 'businessType', 'yearsInBusiness', 'monthlyRevenue'];
        break;
      case 2:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phone'];
        break;
      case 3:
        fieldsToValidate = ['loanProduct', 'loanAmount', 'loanPurpose'];
        break;
      case 4:
        fieldsToValidate = ['consentCreditCheck', 'consentBusinessVerification', 'consentTerms', 'consentPrivacy'];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleStepContinue = async () => {
    const isValid = await validateStep();
    if (isValid) {
      nextStep();
    }
  };

  // Submit application
  const handleSubmitApplication = async () => {
    if (!signatureData) {
      toast({
        title: "Signature Required",
        description: "Please provide your signature before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      
      // Submit application with all data
      const response = await apiRequest('POST', '/api/applications/submit', {
        ...formData,
        signature: signatureData,
        signatureType: 'electronic',
        signedAt: new Date().toISOString()
      });

      // Parse the JSON response
      const responseData = await response.json();

      if (responseData.success) {
        setApplicationId(responseData.applicationId);
        
        // Route to lender
        await apiRequest('POST', `/api/applications/${responseData.applicationId}/route`);

        toast({
          title: "Application Submitted Successfully!",
          description: `Your application ID is ${responseData.applicationId}. We'll contact you within 24 hours.`,
        });

        // Show success screen
        setCurrentStep(6); // Success step
      } else {
        throw new Error('Application submission failed');
      }
    } catch (error: any) {
      console.error('Application error:', error);
      toast({
        title: "Submission Error",
        description: error.message || "There was a problem submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disclosure text
  const disclosureText = `
    <h3 class="font-bold text-lg mb-3">Application Disclosures & Authorizations</h3>
    
    <div class="space-y-4 text-sm">
      <div>
        <h4 class="font-semibold">Credit Check Authorization</h4>
        <p class="text-gray-600">By signing below, you authorize Saint Vision Group and its lending partners to obtain consumer and business credit reports and other information to verify the accuracy of the information provided in this application. This authorization extends to any updates, renewals, extensions, or modifications of this credit request.</p>
      </div>
      
      <div>
        <h4 class="font-semibold">Business Information Accuracy</h4>
        <p class="text-gray-600">You certify that all information provided in this application is true, correct, and complete. You understand that any false statements or material misrepresentations may result in denial of credit and may be subject to penalties under applicable law.</p>
      </div>
      
      <div>
        <h4 class="font-semibold">Loan Terms Acknowledgment</h4>
        <p class="text-gray-600">You acknowledge that this application does not guarantee approval or specific loan terms. Final approval and terms are subject to underwriting review and verification of all provided information. Rates and terms may vary based on creditworthiness and business performance.</p>
      </div>
      
      <div>
        <h4 class="font-semibold">Communication Consent</h4>
        <p class="text-gray-600">You consent to receive communications regarding this application and any resulting loan via phone, email, text message, and mail at the contact information provided. Message and data rates may apply.</p>
      </div>
      
      <div>
        <h4 class="font-semibold">Data Sharing Authorization</h4>
        <p class="text-gray-600">You authorize Saint Vision Group to share your application information with its network of lending partners for the purpose of finding the best loan options for your business needs.</p>
      </div>
    </div>
  `;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Business Loan Application</h1>
              {currentStep <= totalSteps && (
                <span className="text-sm text-gray-600">
                  Step {currentStep} of {totalSteps}
                </span>
              )}
            </div>
            {currentStep <= totalSteps && (
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            )}
          </div>

          {/* Main Application Form */}
          {currentStep <= 5 && (
            <Form {...form}>
              <form className="space-y-6">
                {/* Step 1: Business Information */}
                {currentStep === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Business Information
                      </CardTitle>
                      <CardDescription>
                        Tell us about your business
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Legal Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="ABC Company Inc." 
                                {...field} 
                                data-testid="input-businessName"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ein"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EIN (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="XX-XXXXXXX" 
                                {...field} 
                                data-testid="input-ein"
                              />
                            </FormControl>
                            <FormDescription>
                              Employer Identification Number
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type/Industry *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-businessType">
                                  <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                                <SelectItem value="construction">Construction</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="professional">Professional Services</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="transportation">Transportation</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="realestate">Real Estate</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
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
                            <FormLabel>Years in Business *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-yearsInBusiness">
                                  <SelectValue placeholder="Select years" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-1">Less than 1 year</SelectItem>
                                <SelectItem value="1-2">1-2 years</SelectItem>
                                <SelectItem value="2-5">2-5 years</SelectItem>
                                <SelectItem value="5-10">5-10 years</SelectItem>
                                <SelectItem value="10+">10+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="monthlyRevenue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average Monthly Revenue *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-monthlyRevenue">
                                  <SelectValue placeholder="Select revenue range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-10k">Less than $10,000</SelectItem>
                                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                                <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                                <SelectItem value="250k+">$250,000+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Business owner details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-firstName" />
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
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="input-lastName" />
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
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                {...field} 
                                data-testid="input-email"
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
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="(555) 555-5555"
                                {...field} 
                                data-testid="input-phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ssn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Security Number (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="password"
                                placeholder="XXX-XX-XXXX" 
                                {...field} 
                                data-testid="input-ssn"
                              />
                            </FormControl>
                            <FormDescription>
                              May be required for certain loan products
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="creditScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Credit Score (Optional)</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-creditScore">
                                  <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="750+">Excellent (750+)</SelectItem>
                                <SelectItem value="700-749">Good (700-749)</SelectItem>
                                <SelectItem value="650-699">Fair (650-699)</SelectItem>
                                <SelectItem value="600-649">Below Average (600-649)</SelectItem>
                                <SelectItem value="550-599">Poor (550-599)</SelectItem>
                                <SelectItem value="500-549">Very Poor (500-549)</SelectItem>
                                <SelectItem value="<500">Below 500</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Helps us match you with the right lenders
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Loan Details */}
                {currentStep === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Loan Details
                      </CardTitle>
                      <CardDescription>
                        What type of funding do you need?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="loanProduct"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Product *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-loanProduct">
                                  <SelectValue placeholder="Select a loan product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isLoadingProducts ? (
                                  <SelectItem value="loading">Loading products...</SelectItem>
                                ) : (
                                  loanProducts.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      {product.name} ({product.category})
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose the loan type that best fits your needs
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="loanAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requested Loan Amount *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                placeholder="50000"
                                {...field} 
                                data-testid="input-loanAmount"
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the amount you want to borrow (in dollars)
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
                            <FormLabel>Loan Purpose *</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-loanPurpose">
                                  <SelectValue placeholder="Select purpose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="working-capital">Working Capital</SelectItem>
                                <SelectItem value="equipment">Equipment Purchase</SelectItem>
                                <SelectItem value="expansion">Business Expansion</SelectItem>
                                <SelectItem value="inventory">Inventory Purchase</SelectItem>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                                <SelectItem value="debt-refinance">Debt Refinancing</SelectItem>
                                <SelectItem value="marketing">Marketing/Advertising</SelectItem>
                                <SelectItem value="renovation">Renovation/Remodeling</SelectItem>
                                <SelectItem value="payroll">Payroll/Operating Expenses</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Step 4: Disclosures & Consent */}
                {currentStep === 4 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Disclosures & Consent
                      </CardTitle>
                      <CardDescription>
                        Please review and agree to the following terms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Disclosure Text */}
                      <div 
                        className="bg-gray-50 p-4 rounded-lg mb-6 max-h-64 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: disclosureText }}
                      />

                      {/* Consent Checkboxes */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="consentCreditCheck"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-consentCreditCheck"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I authorize credit checks *
                                </FormLabel>
                                <FormDescription>
                                  I authorize Saint Vision Group and its partners to obtain consumer and business credit reports.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consentBusinessVerification"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-consentBusinessVerification"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I certify business information accuracy *
                                </FormLabel>
                                <FormDescription>
                                  I certify that all information provided is true, correct, and complete.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consentTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-consentTerms"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the Terms and Conditions *
                                </FormLabel>
                                <FormDescription>
                                  I have read and agree to the <a href="/terms" className="underline">Terms and Conditions</a>.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consentPrivacy"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="checkbox-consentPrivacy"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the Privacy Policy *
                                </FormLabel>
                                <FormDescription>
                                  I have read and agree to the <a href="/privacy" className="underline">Privacy Policy</a>.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 5: Signature */}
                {currentStep === 5 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PenTool className="h-5 w-5" />
                        Electronic Signature
                      </CardTitle>
                      <CardDescription>
                        Please sign to complete your application
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          By providing your electronic signature below, you acknowledge that you have read, understood, 
                          and agree to all disclosures and authorizations in this application.
                        </AlertDescription>
                      </Alert>

                      <SignatureCapture
                        onSignatureComplete={(signature) => setSignatureData(signature.data)}
                      />

                      {signatureData && (
                        <Alert className="mt-4 border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Signature captured successfully
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                {currentStep <= 5 && (
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      data-testid="button-prev"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < 5 ? (
                      <Button
                        type="button"
                        onClick={handleStepContinue}
                        data-testid="button-next"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmitApplication}
                        disabled={!signatureData || isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                        data-testid="button-submit-application"
                      >
                        {isSubmitting ? (
                          <>Submitting...</>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </Form>
          )}

          {/* Step 6: Success Screen */}
          {currentStep === 6 && (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12 text-center">
                <div className="mb-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
                  <p className="text-gray-600 mb-4">
                    Thank you for choosing Saint Vision Group for your business funding needs.
                  </p>
                  {applicationId && (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Application ID: {applicationId}
                    </Badge>
                  )}
                </div>

                <Alert className="text-left mb-6">
                  <AlertDescription>
                    <strong>What happens next:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your application has been routed to our best-matched lender</li>
                      <li>A funding specialist will contact you within 24 hours</li>
                      <li>Check your email for application confirmation and next steps</li>
                      <li>You can track your application status in your client portal</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setLocation('/client-portal')}
                    data-testid="button-go-to-portal"
                  >
                    Go to Client Portal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocation('/')}
                    data-testid="button-back-to-home"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}