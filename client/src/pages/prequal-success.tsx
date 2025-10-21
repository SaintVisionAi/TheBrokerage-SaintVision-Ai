import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function PrequalSuccessPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-24 h-24 text-green-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          🚀 You're Pre-Qualified!
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Secure Your Funding Now ✅
        </h2>
        <p className="text-blue-100 text-sm">
          (Soft Credit Pull - Won't Affect Your Score)
        </p>
      </div>

      <Card className="w-full max-w-md mb-8 shadow-2xl">
        <CardContent className="pt-8">
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Great News! 🎉</h3>
              <p className="text-sm text-green-800">
                Based on our quick pre-qualification assessment, you're eligible for funding from $50K to $5M+
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Soft Credit Pull Complete</p>
                  <p className="text-xs text-gray-600">No hard inquiry impact</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">24-48 Hour Decision</p>
                  <p className="text-xs text-gray-600">Fast funding timeline</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Competitive Rates</p>
                  <p className="text-xs text-gray-600">Starting at 9%</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Button 
                onClick={() => setLocation('/full-lending-application-1')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 text-lg"
              >
                Move Forward 🎯
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <p className="text-xs text-gray-600 text-center">
              Proceed to complete your full application to unlock your funding
            </p>
          </div>
        </CardContent>
      </Card>

      <Button 
        variant="outline"
        onClick={() => setLocation('/client-hub')}
        className="text-white border-white hover:bg-blue-700"
      >
        Return to Client Hub
      </Button>
    </div>
  );
}
