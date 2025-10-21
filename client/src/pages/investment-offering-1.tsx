import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, CheckCircle, Lock, Building2 } from 'lucide-react';
import { useLocation } from 'wouter';

export default function InvestmentOffering1Page() {
  const [, setLocation] = useLocation();

  const highlights = [
    {
      icon: TrendingUp,
      title: 'Fixed Returns',
      description: 'Predictable 9-12% annual returns'
    },
    {
      icon: DollarSign,
      title: 'Low Minimums',
      description: 'Start with as little as $25K'
    },
    {
      icon: Lock,
      title: 'Secure Investment',
      description: 'Asset-backed real estate & lending deals'
    },
    {
      icon: Building2,
      title: 'Diversified',
      description: 'Mix of real estate and lending portfolio'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">9-12% Fixed Return Investment</h1>
            <p className="text-lg text-gray-600">Diversified real estate & lending portfolio with predictable returns</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {highlights.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-green-900">Expected Annual Return</CardTitle>
                  <CardDescription className="text-green-800">Conservative to high-yield options available</CardDescription>
                </div>
                <Badge className="bg-green-600 text-white text-lg px-4 py-2">9-12%</Badge>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Portfolio Structure</CardTitle>
              <CardDescription>How your investment is allocated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Real Estate (Fix & Flips)</span>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Business Lending</span>
                  <span className="text-sm text-gray-600">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Bridge Loans & Lines of Credit</span>
                  <span className="text-sm text-gray-600">20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Investment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Minimum Investment</p>
                  <p className="text-2xl font-bold text-gray-900">$25K</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lock-In Period</p>
                  <p className="text-2xl font-bold text-gray-900">12 Months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Distribution</p>
                  <p className="text-2xl font-bold text-gray-900">Quarterly</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Why Invest with Saint Vision Group?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-blue-900">Experienced management team with 20+ years in real estate and lending</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-blue-900">Transparent quarterly reporting and investor updates</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-blue-900">Asset-backed investments secured by real property</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-blue-900">Diversified portfolio to reduce risk</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => setLocation('/client-hub')}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Learn More & Invest
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => setLocation('/contact')}
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
