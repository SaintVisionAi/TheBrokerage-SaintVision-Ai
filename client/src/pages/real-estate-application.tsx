import React, { useState } from 'react';
import { useLocation, useNavigate } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GlobalHeader } from '@/components/layout/global-header';
import { GlobalFooter } from '@/components/layout/global-footer';
import { useToast } from '@/hooks/use-toast';

interface RealEstateApplicationProps {
  applicationId?: string;
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function RealEstateApplication({ applicationId, userInfo }: RealEstateApplicationProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Property Details
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    propertyType: '',
    propertySubType: '',
    
    // Transaction Type
    transactionType: '',
    
    // Buying Details
    buyingTimeline: '',
    buyingBudgetMin: '',
    buyingBudgetMax: '',
    buyingPreApproved: '',
    buyingDownPayment: '',
    
    // Selling Details
    sellingTimeline: '',
    sellingAskingPrice: '',
    sellingCurrentMortgage: '',
    sellingPropertyCondition: '',
    
    // Client Situation
    clientType: '',
    experienceLevel: '',
    
    // Services Needed
    servicesNeeded: [] as string[],
    
    // Additional Info
    howDidYouHear: '',
    additionalNotes: '',
    
    // Appointment Preferences
    preferredContactMethod: '',
    preferredTimeOfDay: '',
    urgencyLevel: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServicesChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      servicesNeeded: checked
        ? [...prev.servicesNeeded, service]
        : prev.servicesNeeded.filter(s => s !== service)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/intake/real-estate-broker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          userInfo,
          intakeData: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      toast({
        title: "Success! ✅",
        description: "Your application has been submitted. JR will reach out soon.",
      });

      setTimeout(() => {
        navigate('/application-complete');
      }, 2000);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <GlobalHeader />
      
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-6 space-y-6 pb-20">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
              Real Estate Services Application
            </h1>
            <p className="text-slate-300">
              Let's get to know your real estate needs. JR Taber will review this and schedule a consultation with you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Property Details */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyAddress">Property Address</Label>
                    <Input
                      id="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      placeholder="123 Main Street"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyCity">City</Label>
                    <Input
                      id="propertyCity"
                      value={formData.propertyCity}
                      onChange={(e) => handleInputChange('propertyCity', e.target.value)}
                      placeholder="Huntington Beach"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyState">State</Label>
                    <Input
                      id="propertyState"
                      value={formData.propertyState}
                      onChange={(e) => handleInputChange('propertyState', e.target.value)}
                      placeholder="CA"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyZip">Zip Code</Label>
                    <Input
                      id="propertyZip"
                      value={formData.propertyZip}
                      onChange={(e) => handleInputChange('propertyZip', e.target.value)}
                      placeholder="92648"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(val) => handleInputChange('propertyType', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select property type..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="propertySubType">Specific Type</Label>
                    <Select value={formData.propertySubType} onValueChange={(val) => handleInputChange('propertySubType', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select specific type..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="single-family">Single Family Home</SelectItem>
                        <SelectItem value="multi-family">Multi-Family (2-4 units)</SelectItem>
                        <SelectItem value="condo">Condo/Townhouse</SelectItem>
                        <SelectItem value="apartment">Apartment Building (5+ units)</SelectItem>
                        <SelectItem value="office">Office Building</SelectItem>
                        <SelectItem value="retail">Retail/Shopping Center</SelectItem>
                        <SelectItem value="industrial">Industrial/Warehouse</SelectItem>
                        <SelectItem value="vacant-land">Vacant Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Type */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">What Are You Looking To Do? *</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.transactionType} onValueChange={(val) => handleInputChange('transactionType', val)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buying" id="buying" />
                    <Label htmlFor="buying">Buying a property</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="selling" id="selling" />
                    <Label htmlFor="selling">Selling a property</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both buying and selling</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Buying Details */}
            {(formData.transactionType === 'buying' || formData.transactionType === 'both') && (
              <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Buying Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="buyingTimeline">Timeline *</Label>
                    <Select value={formData.buyingTimeline} onValueChange={(val) => handleInputChange('buyingTimeline', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="When do you want to buy?" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="asap">ASAP (0-30 days)</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="12-plus-months">12+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buyingBudgetMin">Budget Min</Label>
                      <Input
                        id="buyingBudgetMin"
                        type="number"
                        value={formData.buyingBudgetMin}
                        onChange={(e) => handleInputChange('buyingBudgetMin', e.target.value)}
                        placeholder="500000"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="buyingBudgetMax">Budget Max</Label>
                      <Input
                        id="buyingBudgetMax"
                        type="number"
                        value={formData.buyingBudgetMax}
                        onChange={(e) => handleInputChange('buyingBudgetMax', e.target.value)}
                        placeholder="750000"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="buyingPreApproved">Are you pre-approved for financing?</Label>
                    <Select value={formData.buyingPreApproved} onValueChange={(val) => handleInputChange('buyingPreApproved', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="yes">Yes, pre-approved</SelectItem>
                        <SelectItem value="no">No, not yet</SelectItem>
                        <SelectItem value="cash">Paying cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="buyingDownPayment">Down Payment Available</Label>
                    <Input
                      id="buyingDownPayment"
                      type="number"
                      value={formData.buyingDownPayment}
                      onChange={(e) => handleInputChange('buyingDownPayment', e.target.value)}
                      placeholder="100000"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selling Details */}
            {(formData.transactionType === 'selling' || formData.transactionType === 'both') && (
              <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Selling Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sellingTimeline">Timeline *</Label>
                    <Select value={formData.sellingTimeline} onValueChange={(val) => handleInputChange('sellingTimeline', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="When do you want to sell?" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="asap">ASAP (0-30 days)</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="12-plus-months">12+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="sellingAskingPrice">Desired Asking Price</Label>
                    <Input
                      id="sellingAskingPrice"
                      type="number"
                      value={formData.sellingAskingPrice}
                      onChange={(e) => handleInputChange('sellingAskingPrice', e.target.value)}
                      placeholder="850000"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sellingCurrentMortgage">Current Mortgage Balance (if any)</Label>
                    <Input
                      id="sellingCurrentMortgage"
                      type="number"
                      value={formData.sellingCurrentMortgage}
                      onChange={(e) => handleInputChange('sellingCurrentMortgage', e.target.value)}
                      placeholder="400000"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sellingPropertyCondition">Property Condition</Label>
                    <Select value={formData.sellingPropertyCondition} onValueChange={(val) => handleInputChange('sellingPropertyCondition', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select condition..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="excellent">Excellent (Move-in ready)</SelectItem>
                        <SelectItem value="good">Good (Minor repairs needed)</SelectItem>
                        <SelectItem value="fair">Fair (Some work needed)</SelectItem>
                        <SelectItem value="needs-work">Needs Work (Major repairs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Client Situation */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Your Situation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clientType">Which best describes you? *</Label>
                  <Select value={formData.clientType} onValueChange={(val) => handleInputChange('clientType', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="first-time-buyer">First-Time Home Buyer</SelectItem>
                      <SelectItem value="investor">Real Estate Investor</SelectItem>
                      <SelectItem value="relocating">Relocating</SelectItem>
                      <SelectItem value="downsizing">Downsizing</SelectItem>
                      <SelectItem value="upsizing">Upsizing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="experienceLevel">Real Estate Experience Level *</Label>
                  <Select value={formData.experienceLevel} onValueChange={(val) => handleInputChange('experienceLevel', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="first-time">First Time (Never bought/sold before)</SelectItem>
                      <SelectItem value="experienced">Experienced (1-3 transactions)</SelectItem>
                      <SelectItem value="professional-investor">Professional Investor (4+ transactions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Services Needed */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Services Needed (Check all that apply)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { value: 'buyer-representation', label: 'Buyer Representation' },
                  { value: 'seller-representation', label: 'Seller Representation' },
                  { value: 'property-valuation', label: 'Property Valuation/CMA' },
                  { value: 'market-analysis', label: 'Market Analysis' },
                  { value: 'staging-consultation', label: 'Staging Consultation' },
                  { value: 'negotiation-support', label: 'Negotiation Support' },
                  { value: 'investment-analysis', label: 'Investment Property Analysis' },
                  { value: 'relocation-assistance', label: 'Relocation Assistance' },
                ].map((service) => (
                  <div key={service.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={service.value}
                      checked={formData.servicesNeeded.includes(service.value)}
                      onChange={(e) => handleServicesChange(service.value, e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700/50 text-yellow-500"
                    />
                    <Label htmlFor={service.value} className="font-normal">{service.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                  <Select value={formData.howDidYouHear} onValueChange={(val) => handleInputChange('howDidYouHear', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="additionalNotes">Additional Notes or Questions</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Tell us anything else that might help JR prepare for your consultation..."
                    rows={4}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appointment Preferences */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Consultation Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredContactMethod">Preferred Contact Method *</Label>
                    <Select value={formData.preferredContactMethod} onValueChange={(val) => handleInputChange('preferredContactMethod', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="preferredTimeOfDay">Preferred Time of Day *</Label>
                    <Select value={formData.preferredTimeOfDay} onValueChange={(val) => handleInputChange('preferredTimeOfDay', val)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                        <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="urgencyLevel">How urgent is your need? *</Label>
                  <Select value={formData.urgencyLevel} onValueChange={(val) => handleInputChange('urgencyLevel', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="very-urgent">Very Urgent (Need to talk ASAP)</SelectItem>
                      <SelectItem value="urgent">Urgent (Within 1-2 days)</SelectItem>
                      <SelectItem value="normal">Normal (Within a week)</SelectItem>
                      <SelectItem value="flexible">Flexible (No rush)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="bg-red-900/30 border-red-500/50">
                <CardContent className="pt-6">
                  <p className="text-red-300">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-6 text-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '⏳ Submitting...' : '✅ Submit & Schedule Consultation with JR →'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
