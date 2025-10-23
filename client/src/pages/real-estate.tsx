import { Badge } from '@/components/ui/badge';
import { Building2, Home, TrendingUp, ArrowRight, DollarSign, CheckCircle, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { useLocation } from 'wouter';

export default function RealEstateLeadForm() {
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
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-400/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIEwgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="w-full max-w-4xl text-center space-y-12">
              {/* Premium Badge */}
              <div className="inline-flex items-center justify-center">
                <Badge className="bg-yellow-400/25 text-yellow-300 border border-yellow-400/60 hover:bg-yellow-400/35 text-sm md:text-base px-4 py-2 font-semibold">
                  🏠 Real Estate & Investment Solutions
                </Badge>
              </div>

              {/* Hero Title */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter">
                  <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    Real Estate
                  </span>
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Financing
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/85 leading-relaxed font-light">
                  Investment properties, commercial real estate, and home financing <span className="font-semibold text-yellow-400">tailored to your needs</span>
                </p>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 py-8">
                <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                  <Home className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2">Investment Properties</h3>
                  <p className="text-xs text-white/60 leading-snug">Multi-unit & commercial</p>
                </div>

                <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                  <Building2 className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2">Commercial Real Estate</h3>
                  <p className="text-xs text-white/60 leading-snug">Business property loans</p>
                </div>

                <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-yellow-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
                  <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xs md:text-sm font-bold text-white mb-2">Quick Funding</h3>
                  <p className="text-xs text-white/60 leading-snug">Fast closing times</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={scrollToForm}
                  className="group relative inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg md:text-2xl rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105"
                >
                  <span>Get Your Quote</span>
                  <ArrowRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
                </button>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Real Estate Inquiry Form</h2>
                <p className="text-white/60 text-base md:text-lg">Tell us about your property and financing needs</p>
              </div>
              <RealEstateForm />
            </div>
          </section>
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
