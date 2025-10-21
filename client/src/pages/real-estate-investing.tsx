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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-yellow-300 mb-2">Real Estate Investing Solutions</h1>
            <p className="text-lg text-white/70">Fix & flips, DSCR loans, bridge financing, and investment properties</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {products.map((product, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow bg-neutral-900/80 border border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-yellow-300">{product.title}</CardTitle>
                  <CardDescription className="text-white/60">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-yellow-400/20">
                    <product.icon className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-white/60">Loan Amount</p>
                      <p className="font-semibold text-yellow-300">{product.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Terms</p>
                      <p className="font-semibold text-yellow-300">{product.terms}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                    onClick={() => setLocation('/apply')}
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8 bg-gradient-to-r from-yellow-900/30 to-black/30 border border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-yellow-300">Why Choose Saint Vision Group?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-300">Fast Funding</p>
                    <p className="text-sm text-white/60">24-72 hour closing available</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-300">Flexible Terms</p>
                    <p className="text-sm text-white/60">Customized to your project</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-300">Expert Support</p>
                    <p className="text-sm text-white/60">Dedicated account managers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-900/30 to-black/30 border border-yellow-400/30 text-white">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-2 text-yellow-300">Ready to Get Started?</h3>
              <p className="mb-4 text-yellow-400/70">Complete your pre-qualification in just 5 minutes. Fast decision in 24-48 hours.</p>
              <Button
                onClick={() => setLocation('/apply')}
                className="bg-yellow-400 text-black hover:bg-yellow-300"
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
