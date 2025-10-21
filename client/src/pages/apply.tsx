import { useRef } from 'react';
import { FileText, Zap, Shield, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GHLPreQualForm from '@/components/forms/ghl-prequal-form';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function PreQualForm() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <GlobalHeader />
      <div className="relative bg-black overflow-hidden">
        {/* Premium background with enhanced gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-400/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px]" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIEwgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        </div>

        <div className="relative z-10">
          {/* Hero Section - Centered Vertical Layout */}
          <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="w-full max-w-4xl text-center space-y-12">
              {/* Premium Badge */}
              <div className="inline-flex items-center justify-center">
                <Badge className="bg-yellow-400/25 text-yellow-300 border border-yellow-400/60 hover:bg-yellow-400/35 text-sm md:text-base px-4 py-2 font-semibold">
                  ⚡ Get Pre-Qualified in Minutes
                </Badge>
              </div>

              {/* Hero Title - Massive & Viewport Optimized */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter">
                  <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    Business
                  </span>
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Lending
                  </span>
                </h1>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/90">
                  Pre-Qualification
                </h2>
              </div>

              {/* Subtitle & Benefits */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/85 leading-relaxed font-light">
                  Complete our quick application and receive a <span className="font-semibold text-yellow-400">pre-qualification decision within 24 hours</span>
                </p>
                <p className="text-base sm:text-lg md:text-xl text-white/70 font-light">
                  No impact to your credit score
                </p>
              </div>

              {/* Feature Cards Grid - 4 Column */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-8">
                <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                  <Clock className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2">24-48 Hour Decision</h3>
                  <p className="text-xs text-white/60 leading-snug">AI-powered with fast approval</p>
                </div>

                <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                  <Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2">$50K - $5M</h3>
                  <p className="text-xs text-white/60 leading-snug">Flexible loan amounts</p>
                </div>

                <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2">No Collateral</h3>
                  <p className="text-xs text-white/60 leading-snug">Unsecured options</p>
                </div>

                <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                  <FileText className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2">Rates from 9%</h3>
                  <p className="text-xs text-white/60 leading-snug">Competitive & transparent</p>
                </div>
              </div>

            </div>
          </section>

          {/* Form Section */}
          <section
            ref={formRef}
            className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-black/50 to-black"
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Pre-Qualification Form</h2>
                <p className="text-white/60 text-base md:text-lg">Complete in 5 minutes • No documents required</p>
              </div>
              <GHLPreQualForm />
            </div>
          </section>
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
