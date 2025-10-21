import { useEffect } from 'react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Lock, Zap, Shield } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SoftCreditPullPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Load MyScoreIQ widget if needed
    const script = document.createElement('script');
    script.src = 'https://www.myscoreiq.com/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const features = [
    {
      icon: CheckCircle,
      title: 'No Credit Impact',
      description: 'Soft inquiry won\'t affect your credit score'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get your credit information immediately'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected'
    },
    {
      icon: Lock,
      title: 'Confidential',
      description: 'Only you can see your credit information'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-green-100 text-green-800">Recommended</Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Your Credit Score - Soft Pull</h1>
            <p className="text-lg text-gray-600">Check your credit in minutes. No impact to your score.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {features.map((feature, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{feature.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Check Your Credit?</CardTitle>
              <CardDescription>Understanding your credit profile helps us match you with the best lending solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  Your credit score is one of the key factors in determining your eligibility for funding and the rates available to you. By checking your score now with our partner MyScoreIQ, you'll have a complete picture of your financial standing.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">See your actual credit score from major credit bureaus</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Get personalized recommendations to improve your score</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Receive credit monitoring for up to 12 months</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Ready to Check Your Credit?</CardTitle>
              <CardDescription className="text-blue-800">
                Click the button below to begin your soft credit pull with MyScoreIQ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href="https://www.myscoreiq.com/get-fico-max.aspx?offercode=4321396P" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
                  size="lg"
                >
                  Get Your Credit Score Now
                </Button>
              </a>
              <p className="text-sm text-gray-600 text-center mt-4">
                You'll be redirected to our secure partner MyScoreIQ to complete your soft credit pull
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">What Happens After?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600">1.</span>
                  <span className="text-green-800">Return to our application after checking your score</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600">2.</span>
                  <span className="text-green-800">We'll use your score to pre-qualify you for funding</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600">3.</span>
                  <span className="text-green-800">Receive a decision within 24-48 hours</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-600">4.</span>
                  <span className="text-green-800">Funding available upon closing</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="mt-8 flex gap-4">
            <a 
              href="https://www.myscoreiq.com/get-fico-max.aspx?offercode=4321396P" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Check My Credit Score
              </Button>
            </a>
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
