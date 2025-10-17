import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { FileText, Home, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function REBrokerageIntakeForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Client Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mailingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Transaction Type
    transactionType: '', // buying, selling, both
    serviceType: '', // residential, commercial, investment
    
    // Property Information (for sellers)
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    propertyType: '', // single-family, multi-family, condo, commercial, land
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    lotSize: '',
    yearBuilt: '',
    currentListingPrice: '',
    currentMortgageBalance: '',
    
    // Buyer Information (for buyers)
    priceRangeMin: '',
    priceRangeMax: '',
    preferredLocations: '',
    mustHaveFeatures: '',
    niceToHaveFeatures: '',
    preApprovalStatus: '', // yes, no, in-progress
    preApprovalAmount: '',
    downPaymentAmount: '',
    
    // Timeline & Urgency
    desiredClosingDate: '',
    timelineFlexibility: '', // flexible, firm, urgent
    reasonForTransaction: '',
    
    // Financial Information
    cashBuyer: false,
    needsFinancing: false,
    workingWithLender: '',
    estimatedBudget: '',
    
    // Commission & Agreement Terms
    commissionStructure: '', // standard, negotiable, flat-fee
    exclusivityPeriod: '', // 30, 60, 90, 180 days
    additionalServicesNeeded: [] as string[],
    
    // Legal & Disclosure
    currentlyWorkingWithAgent: '',
    previousRealEstateTransactions: '',
    specialCircumstances: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ghl/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: 'real-estate-brokerage',
          type: `${formData.transactionType} - ${formData.serviceType}`,
          source: 'brokerage-intake-form',
          formType: 'broker-client-agreement-intake'
        })
      });

      const result = await response.json();

      if (result.success || response.ok) {
        toast({
          title: "Intake Form Submitted!",
          description: "Your brokerage agreement will be prepared and sent to you within 24 hours for e-signature.",
        });
        
        // Redirect to agreement preview/signing page
        window.location.href = '/real-estate/agreement-preview';
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Please try again or call us at (800) 555-HOME",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const additionalServices = [
    "Home Staging Consultation",
    "Professional Photography",
    "Drone/Aerial Photography",
    "Virtual Tours",
    "Open House Coordination",
    "Renovation/Repair Recommendations",
    "Property Management Services",
    "Investment Analysis",
    "1031 Exchange Assistance",
    "Commercial Lease Negotiation"
  ];

  return (
    <Card className="bg-black/60 border-blue-400/30 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-blue-400/10 flex items-center justify-center">
            <Home className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-3xl text-white">Real Estate Brokerage Intake</CardTitle>
        <CardDescription className="text-white/70 text-lg">
          Complete this form to begin your broker-client agreement • All information is confidential
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Information */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" />
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
                <Label htmlFor="email" className="text-white">Email Address *</Label>
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
                <Label htmlFor="phone" className="text-white">Phone Number *</Label>
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
              <div className="md:col-span-2">
                <Label htmlFor="mailingAddress" className="text-white">Mailing Address *</Label>
                <Input
                  id="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={(e) => setFormData({ ...formData, mailingAddress: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-mailing-address"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-white">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-city"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-white">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-state"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-white">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white"
                  data-testid="input-zip"
                />
              </div>
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-400" />
              Transaction Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transactionType" className="text-white">Transaction Type *</Label>
                <Select value={formData.transactionType} onValueChange={(value) => setFormData({ ...formData, transactionType: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-transaction-type">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buying">Buying</SelectItem>
                    <SelectItem value="selling">Selling</SelectItem>
                    <SelectItem value="both">Buying & Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serviceType" className="text-white">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-service-type">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="investment">Investment Property</SelectItem>
                    <SelectItem value="land">Land/Vacant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Conditional: Property Information (for sellers) */}
          {(formData.transactionType === 'selling' || formData.transactionType === 'both') && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Property Information (Selling)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="propertyAddress" className="text-white">Property Address *</Label>
                  <Input
                    id="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    data-testid="input-property-address"
                  />
                </div>
                <div>
                  <Label htmlFor="propertyType" className="text-white">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family</SelectItem>
                      <SelectItem value="multi-family">Multi-Family</SelectItem>
                      <SelectItem value="condo">Condo/Townhouse</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentListingPrice" className="text-white">Desired Listing Price</Label>
                  <Input
                    id="currentListingPrice"
                    value={formData.currentListingPrice}
                    onChange={(e) => setFormData({ ...formData, currentListingPrice: e.target.value })}
                    placeholder="$"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditional: Buyer Information */}
          {(formData.transactionType === 'buying' || formData.transactionType === 'both') && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Buyer Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceRangeMin" className="text-white">Price Range Min</Label>
                  <Input
                    id="priceRangeMin"
                    value={formData.priceRangeMin}
                    onChange={(e) => setFormData({ ...formData, priceRangeMin: e.target.value })}
                    placeholder="$"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="priceRangeMax" className="text-white">Price Range Max</Label>
                  <Input
                    id="priceRangeMax"
                    value={formData.priceRangeMax}
                    onChange={(e) => setFormData({ ...formData, priceRangeMax: e.target.value })}
                    placeholder="$"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="preApprovalStatus" className="text-white">Pre-Approval Status</Label>
                  <Select value={formData.preApprovalStatus} onValueChange={(value) => setFormData({ ...formData, preApprovalStatus: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes - Pre-Approved</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="no">Not Yet</SelectItem>
                      <SelectItem value="cash">Cash Buyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="downPaymentAmount" className="text-white">Down Payment Amount</Label>
                  <Input
                    id="downPaymentAmount"
                    value={formData.downPaymentAmount}
                    onChange={(e) => setFormData({ ...formData, downPaymentAmount: e.target.value })}
                    placeholder="$"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Timeline & Terms
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="desiredClosingDate" className="text-white">Desired Closing Date</Label>
                <Input
                  id="desiredClosingDate"
                  type="date"
                  value={formData.desiredClosingDate}
                  onChange={(e) => setFormData({ ...formData, desiredClosingDate: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="exclusivityPeriod" className="text-white">Agreement Period *</Label>
                <Select value={formData.exclusivityPeriod} onValueChange={(value) => setFormData({ ...formData, exclusivityPeriod: value })}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days (Recommended)</SelectItem>
                    <SelectItem value="180">180 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Additional Services Needed</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {additionalServices.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.additionalServicesNeeded.includes(service)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          additionalServicesNeeded: [...formData.additionalServicesNeeded, service]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          additionalServicesNeeded: formData.additionalServicesNeeded.filter(s => s !== service)
                        });
                      }
                    }}
                    className="border-white/30"
                  />
                  <label htmlFor={service} className="text-sm text-white/80 cursor-pointer">
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes" className="text-white">Additional Notes or Special Requirements</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              rows={4}
              className="bg-white/10 border-white/20 text-white resize-none"
              placeholder="Any special circumstances, requirements, or questions..."
            />
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1 border-white/30"
              data-testid="checkbox-agree-terms"
            />
            <label htmlFor="terms" className="text-sm text-white/90 cursor-pointer">
              I authorize Saint Vision Group to prepare a Broker-Client Agreement based on the information provided above. 
              I understand this intake form does not constitute a binding agreement and that I will review and sign the 
              official agreement via DocuSign. All information provided is accurate to the best of my knowledge.
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !agreedToTerms}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-black font-bold text-lg py-6"
            data-testid="button-submit-brokerage-intake"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Submit & Generate Agreement
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
