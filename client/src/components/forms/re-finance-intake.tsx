import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Home, FileText, Upload, Calculator, CheckCircle } from 'lucide-react';

export default function REFinanceIntakeForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Client Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Property Information
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    propertyType: '', // single-family, multi-family, commercial, mixed-use
    propertyUse: '', // primary-residence, investment, fix-flip, rental
    propertyCondition: '', // excellent, good, needs-work, major-rehab
    
    // Property Details
    purchasePrice: '',
    currentValue: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    yearBuilt: '',
    occupancyStatus: '', // occupied, vacant, tenant-occupied
    
    // Financial Details
    loanType: '', // purchase, refinance, cash-out-refi, bridge, fix-flip, dscr, commercial
    loanAmount: '',
    downPayment: '',
    creditScore: '',
    annualIncome: '',
    monthlyDebts: '',
    assetsAvailable: '',
    
    // Investment Details (from ROI Calculator)
    expectedRentalIncome: '',
    expectedExpenses: '',
    projectedCashFlow: '',
    projectedROI: '',
    holdingPeriod: '',
    exitStrategy: '', // sell, refinance, hold-long-term
    
    // Loan Purpose & Timeline
    loanPurpose: '',
    desiredClosingDate: '',
    urgencyLevel: '', // flexible, moderate, urgent
    
    // Experience & Background
    realEstateExperience: '', // first-time, 1-3-properties, 4-10-properties, 10+properties
    currentPropertiesOwned: '',
    workingWithRealtor: '',
    realtorName: '',
    
    // Additional Information
    additionalNotes: '',
    
    // File Uploads
    roiCalculatorFile: null as File | null,
    propertyPhotos: [] as File[],
    financialDocuments: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (files) {
      if (fieldName === 'roiCalculatorFile') {
        setFormData({ ...formData, roiCalculatorFile: files[0] });
      } else if (fieldName === 'propertyPhotos') {
        setFormData({ ...formData, propertyPhotos: Array.from(files) });
      } else if (fieldName === 'financialDocuments') {
        setFormData({ ...formData, financialDocuments: Array.from(files) });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, you'd upload files to cloud storage first
      // Then send the URLs along with form data to GHL
      
      const response = await fetch('/api/ghl/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: 'real-estate-finance',
          type: `${formData.loanType} - ${formData.propertyType}`,
          source: 'finance-intake-form',
          roiCalculatorAttached: !!formData.roiCalculatorFile,
          photosCount: formData.propertyPhotos.length,
          docsCount: formData.financialDocuments.length
        })
      });

      const result = await response.json();

      if (result.success || response.ok) {
        toast({
          title: "Finance Application Submitted!",
          description: "Our lending team will review your property and financing needs within 24 hours.",
        });
        
        // Reset form or redirect
        window.location.href = '/dashboard';
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Please try again or call us at (800) 555-LOAN",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black/60 border-green-400/30 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-400/10 flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <CardTitle className="text-3xl text-white">Real Estate Finance Application</CardTitle>
        <CardDescription className="text-white/70 text-lg">
          Complete financing application with property details and ROI analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Information */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              Client Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-last-name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-phone"
                />
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-green-400" />
              Property Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="propertyAddress" className="text-white">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-property-address"
                />
              </div>
              <div>
                <Label htmlFor="propertyType" className="text-white">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-property-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-family">Single Family</SelectItem>
                    <SelectItem value="multi-family">Multi-Family (2-4 units)</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="mixed-use">Mixed Use</SelectItem>
                    <SelectItem value="apartment">Apartment Building (5+ units)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="propertyUse" className="text-white">Property Use *</Label>
                <Select value={formData.propertyUse} onValueChange={(value) => setFormData({ ...formData, propertyUse: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select use" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary-residence">Primary Residence</SelectItem>
                    <SelectItem value="investment">Investment Property</SelectItem>
                    <SelectItem value="fix-flip">Fix & Flip</SelectItem>
                    <SelectItem value="rental">Long-Term Rental</SelectItem>
                    <SelectItem value="short-term-rental">Short-Term Rental (Airbnb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="purchasePrice" className="text-white">Purchase Price *</Label>
                <Input
                  id="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="$"
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-purchase-price"
                />
              </div>
              <div>
                <Label htmlFor="currentValue" className="text-white">Current/After Repair Value (ARV)</Label>
                <Input
                  id="currentValue"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  placeholder="$"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Loan Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanType" className="text-white">Loan Type *</Label>
                <Select value={formData.loanType} onValueChange={(value) => setFormData({ ...formData, loanType: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-loan-type">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase Loan</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                    <SelectItem value="cash-out-refi">Cash-Out Refinance</SelectItem>
                    <SelectItem value="bridge">Bridge Loan</SelectItem>
                    <SelectItem value="fix-flip">Fix & Flip Loan</SelectItem>
                    <SelectItem value="dscr">DSCR Loan (No Income Verification)</SelectItem>
                    <SelectItem value="commercial">Commercial Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="loanAmount" className="text-white">Loan Amount Needed *</Label>
                <Input
                  id="loanAmount"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  placeholder="$"
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-loan-amount"
                />
              </div>
              <div>
                <Label htmlFor="downPayment" className="text-white">Down Payment Available</Label>
                <Input
                  id="downPayment"
                  value={formData.downPayment}
                  onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                  placeholder="$"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="creditScore" className="text-white">Credit Score Range</Label>
                <Select value={formData.creditScore} onValueChange={(value) => setFormData({ ...formData, creditScore: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="750+">750+ (Excellent)</SelectItem>
                    <SelectItem value="700-749">700-749 (Good)</SelectItem>
                    <SelectItem value="650-699">650-699 (Fair)</SelectItem>
                    <SelectItem value="600-649">600-649 (Below Average)</SelectItem>
                    <SelectItem value="<600">Below 600</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ROI & Investment Details */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-green-400" />
              ROI & Investment Analysis
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedRentalIncome" className="text-white">Expected Monthly Rental Income</Label>
                <Input
                  id="expectedRentalIncome"
                  value={formData.expectedRentalIncome}
                  onChange={(e) => setFormData({ ...formData, expectedRentalIncome: e.target.value })}
                  placeholder="$"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="expectedExpenses" className="text-white">Expected Monthly Expenses</Label>
                <Input
                  id="expectedExpenses"
                  value={formData.expectedExpenses}
                  onChange={(e) => setFormData({ ...formData, expectedExpenses: e.target.value })}
                  placeholder="$"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="projectedROI" className="text-white">Projected Annual ROI %</Label>
                <Input
                  id="projectedROI"
                  value={formData.projectedROI}
                  onChange={(e) => setFormData({ ...formData, projectedROI: e.target.value })}
                  placeholder="%"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="exitStrategy" className="text-white">Exit Strategy</Label>
                <Select value={formData.exitStrategy} onValueChange={(value) => setFormData({ ...formData, exitStrategy: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sell">Sell After Renovation</SelectItem>
                    <SelectItem value="refinance">Refinance & Hold</SelectItem>
                    <SelectItem value="hold-long-term">Hold Long-Term Rental</SelectItem>
                    <SelectItem value="1031-exchange">1031 Exchange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-400" />
              Upload Documents
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roiCalculator" className="text-white flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  ROI Calculator Results (PDF/Excel) *
                </Label>
                <Input
                  id="roiCalculator"
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => handleFileUpload(e, 'roiCalculatorFile')}
                  className="bg-white/10 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-400/20 file:text-green-400"
                  data-testid="input-roi-calculator-file"
                />
                <p className="text-xs text-white/50 mt-1">Upload your ROI calculator from our Investments page</p>
              </div>
              
              <div>
                <Label htmlFor="propertyPhotos" className="text-white">Property Photos (Optional)</Label>
                <Input
                  id="propertyPhotos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'propertyPhotos')}
                  className="bg-white/10 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-400/20 file:text-green-400"
                />
              </div>

              <div>
                <Label htmlFor="financialDocs" className="text-white">Financial Documents (Optional)</Label>
                <Input
                  id="financialDocs"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'financialDocuments')}
                  className="bg-white/10 border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-400/20 file:text-green-400"
                />
                <p className="text-xs text-white/50 mt-1">Bank statements, tax returns, etc.</p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes" className="text-white">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={4}
              className="bg-white/10 border-white/20 text-white resize-none"
              placeholder="Timeline requirements, special circumstances, questions..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-bold text-lg py-6"
            data-testid="button-submit-finance-intake"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Submit Finance Application
              </>
            )}
          </Button>

          <p className="text-center text-sm text-white/50">
            You'll receive a decision within 24-48 hours • No obligation to proceed
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
