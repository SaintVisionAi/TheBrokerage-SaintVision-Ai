import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Phone, Mail, Sparkles, Clock, Shield, Zap } from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function ApplicationCompletePage() {
  const [, setLocation] = useLocation();
  
  const params = new URLSearchParams(window.location.search);
  const loanAmount = parseFloat(params.get('amount') || '0');
  const loanPurpose = params.get('purpose') || 'Working Capital';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      <GlobalHeader />
      
      <div className="flex items-center justify-center min-h-[80vh] px-6 py-16">
        <Card className="bg-black/80 border-yellow-400/30 backdrop-blur-xl max-w-3xl w-full">
          <CardHeader className="text-center border-b border-neutral-800 pb-6">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-yellow-400" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-white mb-2">
              🎉 Application Received!
            </CardTitle>
            <p className="text-white/70 text-lg">
              Your application is being processed by our AI-powered underwriting team
            </p>
          </CardHeader>
          
          <CardContent className="pt-8 pb-8">
            <div className="space-y-8">
              {/* SaintBroker AI Processing */}
              <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-xl font-bold text-yellow-400">
                    🤖 SaintBroker™ AI Is Analyzing Your Application
                  </h3>
                </div>
                <p className="text-white/80 mb-4">
                  Our proprietary AI platform is analyzing your request for <span className="text-yellow-400 font-semibold">${loanAmount.toLocaleString()}</span> in <span className="text-yellow-400 font-semibold">{loanPurpose}</span> funding.
                </p>
                <div className="bg-black/40 rounded-lg p-4 border border-yellow-400/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <p className="text-white/90 font-medium">Saint Vision Group Underwriting Team - Active</p>
                  </div>
                  <p className="text-white/70 text-sm">
                    Our elite lending network is being matched to your specific requirements using advanced AI analysis.
                  </p>
                </div>
              </div>
              
              {/* What Happens Next */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white">What Happens Next:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/80">
                      <strong className="text-yellow-400">AI Analysis Complete:</strong> SaintBroker™ has matched you with the optimal funding solution from our network
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/80">
                      <strong className="text-yellow-400">Underwriting Review:</strong> Our team will review your application within 24 hours
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/80">
                      <strong className="text-yellow-400">Dedicated Specialist:</strong> Your loan officer will contact you to finalize details
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/80">
                      <strong className="text-yellow-400">Fast Funding:</strong> Approval and funding in as little as 24-72 hours! 🎉
                    </p>
                  </div>
                </div>
              </div>

              {/* Why Saint Vision Group */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
                <h4 className="text-lg font-bold text-white mb-4">Why Saint Vision Group?</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-1">AI-Powered Speed</h5>
                      <p className="text-white/60 text-sm">Fastest approvals in the industry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-1">Elite Network</h5>
                      <p className="text-white/60 text-sm">Access to premier lenders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-white mb-1">24/7 Service</h5>
                      <p className="text-white/60 text-sm">Always here when you need us</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 text-center space-y-4">
                <p className="text-white/70">
                  Want to track your application status in real-time?
                </p>
                <Button
                  onClick={() => setLocation('/dashboard')}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40"
                  data-testid="button-go-to-dashboard"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="text-center pt-4 border-t border-neutral-800">
                <p className="text-white/60 mb-3">Questions? Our team is here to help!</p>
                <div className="flex flex-col gap-2 items-center">
                  <a 
                    href="tel:+19497550720"
                    className="text-yellow-400 hover:text-yellow-500 font-medium flex items-center gap-2"
                    data-testid="link-contact-phone"
                  >
                    <Phone className="h-4 w-4" />
                    +1 (949) 755-0720
                  </a>
                  <a 
                    href="mailto:saints@hacp.ai"
                    className="text-yellow-400 hover:text-yellow-500 font-medium flex items-center gap-2"
                    data-testid="link-contact-email"
                  >
                    <Mail className="h-4 w-4" />
                    saints@hacp.ai
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <GlobalFooter />
    </div>
  );
}
