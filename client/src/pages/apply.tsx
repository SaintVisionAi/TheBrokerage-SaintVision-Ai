import { FileText, Zap, Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GHLPreQualForm from '@/components/forms/ghl-prequal-form';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function PreQualForm() {
  return (
    <>
      <GlobalHeader />
      <div className="relative min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
        {/* Animated gradient background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center justify-center mb-6">
                <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/50 hover:bg-yellow-400/30">
                  ⚡ Get Pre-Qualified in Minutes
                </Badge>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
                Business Lending
                <br />
                Pre-Qualification
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/80 mb-4 leading-relaxed">
                Complete our quick application and receive a pre-qualification decision within 24 hours.
              </p>

              {/* Key Benefits */}
              <p className="text-base text-white/60 mb-12">
                No impact to your credit score
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
                  <Clock className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-sm md:text-base font-semibold text-white mb-2">24-48 Hour Decision</h3>
                  <p className="text-xs text-white/60">AI-powered pre-qualification with fast approval</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
                  <Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-sm md:text-base font-semibold text-white mb-2">$50K - $5M Available</h3>
                  <p className="text-xs text-white/60">Flexible loan amounts for any business need</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-sm md:text-base font-semibold text-white mb-2">No Collateral Required</h3>
                  <p className="text-xs text-white/60">Unsecured options for qualified borrowers</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-yellow-400/30 transition-all">
                  <FileText className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-sm md:text-base font-semibold text-white mb-2">Rates from 9%</h3>
                  <p className="text-xs text-white/60">Competitive rates with transparent terms</p>
                </div>
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-8 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <GHLPreQualForm />
            </div>
          </section>
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
