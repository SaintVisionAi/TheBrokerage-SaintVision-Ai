import { FileText, Zap, Shield, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import GHLPreQualForm from '@/components/forms/ghl-prequal-form';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function PreQualForm() {
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
          {/* Hero Section - Full Viewport Height */}
          <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="w-full max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left Column - Hero Content */}
                <div className="text-center lg:text-left space-y-8">
                  {/* Premium Badge */}
                  <div className="inline-flex items-center justify-center lg:justify-start">
                    <Badge className="bg-yellow-400/25 text-yellow-300 border border-yellow-400/60 hover:bg-yellow-400/35 text-sm md:text-base px-4 py-2 font-semibold">
                      ⚡ Get Pre-Qualified in Minutes
                    </Badge>
                  </div>

                  {/* Hero Title - Extra Large */}
                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                      <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                        Business
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        Lending
                      </span>
                    </h1>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/90">
                      Pre-Qualification
                    </h2>
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-3">
                    <p className="text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed font-light">
                      Get approved in <span className="font-semibold text-yellow-400">24-48 hours</span> with our AI-powered pre-qualification
                    </p>
                    <p className="text-base md:text-lg text-white/60">
                      No credit impact • $50K - $5M available • Completely free assessment
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <button className="group relative inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg md:text-xl rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl shadow-yellow-400/30 hover:shadow-yellow-400/50">
                      <span>Start Application</span>
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Column - Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                    <Clock className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base md:text-lg font-bold text-white mb-3">24-48 Hour Decision</h3>
                    <p className="text-sm text-white/70 leading-relaxed">AI-powered assessment with fast approval</p>
                  </div>

                  <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                    <Zap className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base md:text-lg font-bold text-white mb-3">$50K - $5M Available</h3>
                    <p className="text-sm text-white/70 leading-relaxed">Flexible amounts for any business need</p>
                  </div>

                  <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                    <Shield className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base md:text-lg font-bold text-white mb-3">No Collateral Required</h3>
                    <p className="text-sm text-white/70 leading-relaxed">Unsecured loans for qualified borrowers</p>
                  </div>

                  <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                    <FileText className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base md:text-lg font-bold text-white mb-3">Rates from 9%</h3>
                    <p className="text-sm text-white/70 leading-relaxed">Competitive rates with transparent terms</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-black/50 to-black">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Quick Pre-Qualification Form</h2>
                <p className="text-white/60 text-lg">Complete in 5 minutes • No documents required</p>
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
