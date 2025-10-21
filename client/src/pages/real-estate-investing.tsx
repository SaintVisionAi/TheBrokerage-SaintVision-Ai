import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, DollarSign, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function RealEstateInvestingPage() {
  const [, setLocation] = useLocation();

  const products = [
    {
      icon: Home,
      title: 'Fix & Flip Loans',
      description: 'Quick capital for real estate projects',
      amount: '$100K - $10M+',
      terms: '6-24 months',
      color: 'bg-orange-100'
    },
    {
      icon: DollarSign,
      title: 'DSCR Loans',
      description: 'No income verification required',
      amount: '$100K - $5M+',
      terms: 'Investment properties',
      color: 'bg-green-100'
    },
    {
      icon: TrendingUp,
      title: 'Bridge Loans',
      description: 'Short-term transition financing',
      amount: '$100K - $10M+',
      terms: '48-72 hour closing',
      color: 'bg-blue-100'
    },
    {
      icon: Home,
      title: 'Cash-Out Refi',
      description: 'Leverage existing equity',
      amount: 'Up to 80% LTV',
      terms: 'Any purpose',
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Real Estate Investing Solutions</h1>
            <p className="text-lg text-gray-600">Fix & flips, DSCR loans, bridge financing, and investment properties</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {products.map((product, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${product.color}`}>
                    <product.icon className="w-6 h-6 text-gray-800" />
                  </div>
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Loan Amount</p>
                      <p className="font-semibold text-gray-900">{product.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Terms</p>
                      <p className="font-semibold text-gray-900">{product.terms}</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setLocation('/apply')}
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Why Choose Saint Vision Group?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Fast Funding</p>
                    <p className="text-sm text-blue-800">24-72 hour closing available</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Flexible Terms</p>
                    <p className="text-sm text-blue-800">Customized to your project</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Expert Support</p>
                    <p className="text-sm text-blue-800">Dedicated account managers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="mb-4 text-blue-100">Complete your pre-qualification in just 5 minutes. Fast decision in 24-48 hours.</p>
              <Button 
                onClick={() => setLocation('/apply')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Start Pre-Qualification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
