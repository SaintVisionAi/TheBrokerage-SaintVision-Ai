import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, TrendingUp, Shield, Users, DollarSign, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function ComprehensiveSolutionsPage() {
  const [, setLocation] = useLocation();

  const solutions = [
    {
      icon: Crown,
      title: 'Private Client Suite',
      description: 'Exclusive wealth strategies & access',
      features: ['Dedicated account manager', 'Priority processing', 'Customized solutions']
    },
    {
      icon: TrendingUp,
      title: 'Portfolio Advisory',
      description: 'Custom investment strategies for you',
      features: ['Market analysis', 'Asset allocation', 'Tax optimization']
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Protect your investments',
      features: ['Portfolio diversification', 'Hedging strategies', 'Insurance planning']
    },
    {
      icon: Users,
      title: 'Family Office Services',
      description: 'Multi-generational wealth planning',
      features: ['Estate planning', 'Succession strategy', 'Family governance']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Comprehensive Solutions</h1>
            <p className="text-lg text-gray-600">Integrated wealth management, lending, and investment solutions for your complete financial picture</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {solutions.map((solution, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <solution.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>{solution.title}</CardTitle>
                      <CardDescription>{solution.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {solution.features.map((feature, fidx) => (
                      <li key={fidx} className="flex gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold mb-2">The Comprehensive Difference</h3>
              <p className="mb-6 text-blue-100">
                Instead of managing multiple vendors, get everything from one trusted partner. Our integrated approach means better coordination, more efficient processes, and superior results.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Unified reporting & analytics</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>One point of contact</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span>Coordinated strategies</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Saint Vision Comprehensive Fund</CardTitle>
              <CardDescription>Multi-strategy fund combining real estate, lending, and alternative investments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Target Return</p>
                  <p className="text-2xl font-bold text-blue-600">12-15%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Minimum Investment</p>
                  <p className="text-2xl font-bold text-green-600">$50K</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fund Size</p>
                  <p className="text-2xl font-bold text-purple-600">$125M+</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Expense Ratio</p>
                  <p className="text-2xl font-bold text-orange-600">1.2%</p>
                </div>
              </div>

              <p className="text-gray-700">
                The Saint Vision Comprehensive Fund offers institutional-quality investments with the flexibility of private capital. Diversified across multiple asset classes and strategies, our fund is designed to deliver consistent returns regardless of market conditions.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => setLocation('/contact')}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Schedule a Consultation
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => setLocation('/client-hub')}
            >
              Back to Client Hub
            </Button>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
