import React, { useState } from 'react';
import { useLocation, useNavigate } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GlobalHeader } from '@/components/layout/global-header';
import { GlobalFooter } from '@/components/layout/global-footer';
import { useToast } from '@/hooks/use-toast';

interface InvestmentApplicationProps {
  applicationId?: string;
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export default function InvestmentApplication({ applicationId, userInfo }: InvestmentApplicationProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    // Investment Type
    investmentTypes: [] as string[],
    primaryFocus: '',
    targetInvestmentAmount: '',
    investmentAmountMin: '',
    investmentAmountMax: '',
    
    // Goals
    investmentGoals: [] as string[],
    otherGoal: '',
    
    // Timeline
    investmentTimeline: '',
    exitTimeframe: '',
    
    // Risk Profile
    riskTolerance: '',
    
    // Current Situation
    currentPortfolioValue: '',
    hasExistingInvestments: '',
    numberOfProperties: '',
    
    // Experience
    experienceLevel: '',
    yearsInvesting: '',
    
    // Preferences
    preferredInvestmentType: '',
    geographicPreference: '',
    propertyCondition: '',
    
    // Additional Info
    specificOpportunities: '',
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

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/intake/investment', {
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
              Investment Services Application
            </h1>
            <p className="text-slate-300">
              Tell us about your investment goals and preferences. JR Taber will review this and schedule a consultation with you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Investment Type */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">What Types of Investments Interest You? *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { value: 'real-estate', label: 'Real Estate (Residential)' },
                  { value: 'commercial-real-estate', label: 'Commercial Real Estate' },
                  { value: 'multifamily', label: 'Multifamily Properties' },
                  { value: 'private-equity', label: 'Private Equity' },
                  { value: 'stock-market', label: 'Stock Market / Public Markets' },
                  { value: 'cryptocurrency', label: 'Cryptocurrency / Digital Assets' },
                  { value: 'fixed-income', label: 'Fixed Income / Bonds' },
                  { value: 'hedge-funds', label: 'Hedge Funds' },
                  { value: 'startups', label: 'Startups / Venture Capital' },
                  { value: 'other', label: 'Other' },
                ].map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={formData.investmentTypes.includes(type.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('investmentTypes', type.value, checked as boolean)
                      }
                      className="bg-slate-700/50 border-slate-600"
                    />
                    <Label htmlFor={type.value} className="font-normal">{type.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Investment Amount */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Investment Amount *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="targetInvestmentAmount">How much are you looking to invest? *</Label>
                  <Select value={formData.targetInvestmentAmount} onValueChange={(val) => handleInputChange('targetInvestmentAmount', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select investment range..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="1m-plus">$1,000,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Investment Goals */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">What Are Your Investment Goals? *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { value: 'passive-income', label: 'Generate Passive Income' },
                  { value: 'capital-appreciation', label: 'Capital Appreciation / Growth' },
                  { value: 'tax-benefits', label: 'Tax Optimization / Tax Benefits' },
                  { value: 'diversification', label: 'Portfolio Diversification' },
                  { value: 'legacy', label: 'Build Legacy / Generational Wealth' },
                  { value: 'hedge', label: 'Hedge Against Inflation' },
                ].map((goal) => (
                  <div key={goal.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal.value}
                      checked={formData.investmentGoals.includes(goal.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('investmentGoals', goal.value, checked as boolean)
                      }
                      className="bg-slate-700/50 border-slate-600"
                    />
                    <Label htmlFor={goal.value} className="font-normal">{goal.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Investment Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="investmentTimeline">When are you looking to start investing? *</Label>
                  <Select value={formData.investmentTimeline} onValueChange={(val) => handleInputChange('investmentTimeline', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select timeline..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="immediately">Immediately (0-30 days)</SelectItem>
                      <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                      <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                      <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                      <SelectItem value="exploring">Just Exploring (No timeline)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exitTimeframe">Expected holding period / exit timeframe? *</Label>
                  <Select value={formData.exitTimeframe} onValueChange={(val) => handleInputChange('exitTimeframe', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select timeframe..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="short-1-2-years">Short-term (1-2 years)</SelectItem>
                      <SelectItem value="medium-3-5-years">Medium-term (3-5 years)</SelectItem>
                      <SelectItem value="long-5-10-years">Long-term (5-10 years)</SelectItem>
                      <SelectItem value="very-long-10-plus">Very Long-term (10+ years)</SelectItem>
                      <SelectItem value="perpetual">Perpetual / Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Risk Profile */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Risk Tolerance *</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.riskTolerance} onValueChange={(val) => handleInputChange('riskTolerance', val)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conservative" id="conservative" />
                    <Label htmlFor="conservative">Conservative (Low risk, stable returns)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (Balanced risk/reward)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <Label htmlFor="aggressive">Aggressive (Higher risk for potential higher returns)</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Current Situation */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Current Investment Situation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hasExistingInvestments">Do you currently have investments? *</Label>
                  <Select value={formData.hasExistingInvestments} onValueChange={(val) => handleInputChange('hasExistingInvestments', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="some">Yes, but looking to diversify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currentPortfolioValue">Approximate current portfolio value</Label>
                  <Input
                    id="currentPortfolioValue"
                    placeholder="$500,000"
                    value={formData.currentPortfolioValue}
                    onChange={(e) => handleInputChange('currentPortfolioValue', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="numberOfProperties">Number of investment properties owned</Label>
                  <Input
                    id="numberOfProperties"
                    type="number"
                    placeholder="0"
                    value={formData.numberOfProperties}
                    onChange={(e) => handleInputChange('numberOfProperties', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Investment Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="experienceLevel">What's your investment experience level? *</Label>
                  <Select value={formData.experienceLevel} onValueChange={(val) => handleInputChange('experienceLevel', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="beginner">Beginner (New to investing)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Some experience)</SelectItem>
                      <SelectItem value="advanced">Advanced (Seasoned investor)</SelectItem>
                      <SelectItem value="professional">Professional (Full-time investor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="yearsInvesting">Years of investing experience</Label>
                  <Input
                    id="yearsInvesting"
                    type="number"
                    placeholder="0"
                    value={formData.yearsInvesting}
                    onChange={(e) => handleInputChange('yearsInvesting', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Investment Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preferredInvestmentType">Preferred investment approach *</Label>
                  <Select value={formData.preferredInvestmentType} onValueChange={(val) => handleInputChange('preferredInvestmentType', val)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="hands-off">Hands-off (Passive)</SelectItem>
                      <SelectItem value="moderate-involvement">Moderate Involvement</SelectItem>
                      <SelectItem value="hands-on">Hands-on (Active Management)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="geographicPreference">Geographic preference</Label>
                  <Input
                    id="geographicPreference"
                    placeholder="e.g., Southern California, National, No preference"
                    value={formData.geographicPreference}
                    onChange={(e) => handleInputChange('geographicPreference', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="specificOpportunities">Are you looking at any specific opportunities?</Label>
                  <Textarea
                    id="specificOpportunities"
                    value={formData.specificOpportunities}
                    onChange={(e) => handleInputChange('specificOpportunities', e.target.value)}
                    placeholder="Tell us about any specific investments you're considering..."
                    rows={3}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional notes or questions</Label>
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

            {/* Consultation Preferences */}
            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Consultation Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredContactMethod">Preferred contact method *</Label>
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
                    <Label htmlFor="preferredTimeOfDay">Preferred time of day *</Label>
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
