import { Button } from "@/components/ui/button";
import { Building2, Home, DollarSign, TrendingUp, CheckCircle, ArrowRight, MapPin, Hammer } from "lucide-react";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";
import { Link } from "wouter";

export default function RealEstate() {
  const services = [
    {
      icon: <Home className="w-8 h-8 text-yellow-400" />,
      title: "Residential Buy & Sell",
      description: "Expert guidance for buying or selling your home with AI-powered market analysis",
      features: ["Market Analysis", "Property Valuation", "Negotiation Support", "Quick Closings"]
    },
    {
      icon: <Building2 className="w-8 h-8 text-yellow-400" />,
      title: "Commercial Real Estate",
      description: "Strategic commercial property solutions for investors and businesses",
      features: ["Portfolio Management", "Investment Analysis", "Lease Negotiations", "Asset Optimization"]
    },
    {
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
      title: "Real Estate Financing",
      description: "Comprehensive financing solutions tailored to your property needs",
      features: ["Purchase Loans", "Refinancing", "Bridge Loans", "Fix & Flip Financing"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
      title: "Investment Properties",
      description: "Build wealth through strategic real estate investments",
      features: ["ROI Analysis", "Market Insights", "Property Management", "Portfolio Diversification"]
    }
  ];

  const handleGHLCapture = (formType: string) => {
    // GHL integration placeholder - will be connected to actual webhook
    console.log(`GHL Lead Capture: ${formType}`);
    window.location.href = `/contact?service=real-estate&type=${formType}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-transparent to-yellow-600/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
            <Building2 className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">Saint Vision Real Estate Services</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-400 to-white bg-clip-text text-transparent">
            Buy, Sell & Finance
            <br />
            <span className="text-yellow-400">Smarter Real Estate</span>
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8">
            Experience the future of real estate with AI-powered insights, strategic financing, 
            and faith-aligned business practices. Your success is our mission.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => handleGHLCapture('consultation')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold px-8 py-6 text-lg"
              data-testid="button-consultation"
            >
              Schedule Free Consultation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/apply">
              <Button 
                variant="outline" 
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg"
                data-testid="button-apply-lending"
              >
                Apply for Lending
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Nationwide Coverage Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-yellow-900/20 to-yellow-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-yellow-400/10 border-2 border-yellow-400/50 rounded-full px-8 py-4 mb-6">
              <MapPin className="w-6 h-6 text-yellow-400" />
              <span className="text-2xl text-yellow-400 font-bold">All 50 States Coverage</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Nationwide Real Estate Services</h2>
            <p className="text-white/60 text-lg max-w-3xl mx-auto">
              From coast to coast, Saint Vision Group provides comprehensive real estate solutions in every state. 
              Whether you're buying in California, selling in Texas, or investing in Florida, we've got you covered.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">50</div>
              <p className="text-white/70">States Covered</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
              <p className="text-white/70">Nationwide Reach</p>
            </div>
            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
              <p className="text-white/70">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Strategies Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Hammer className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h2 className="text-4xl font-bold mb-4">Real Estate Investment Strategies</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Build wealth with proven real estate investment strategies tailored to your goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all" data-testid="strategy-brrrr">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">BRRRR Method</h3>
              <p className="text-sm text-white/50 mb-3">Buy, Rehab, Rent, Refinance, Repeat</p>
              <p className="text-white/70 mb-4">
                Build a rental portfolio with recycled capital. Purchase undervalued properties, renovate, rent out, refinance, and repeat the process.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Leverage equity repeatedly</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Build passive income</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Tax advantages</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all" data-testid="strategy-str">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">STR (Short-Term Rentals)</h3>
              <p className="text-sm text-white/50 mb-3">High-yield vacation properties</p>
              <p className="text-white/70 mb-4">
                Maximize income with short-term vacation rentals. Higher returns than traditional rentals in prime locations.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Premium nightly rates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Flexible personal use</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Location advantages</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all" data-testid="strategy-airbnb">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">AirBnB Investment</h3>
              <p className="text-sm text-white/50 mb-3">Platform-optimized properties</p>
              <p className="text-white/70 mb-4">
                Strategic properties designed for AirBnB success with professional management and optimization.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Property optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Management services</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Market analysis</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all" data-testid="strategy-fix-flip">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Fix & Flip</h3>
              <p className="text-sm text-white/50 mb-3">Quick profit opportunities</p>
              <p className="text-white/70 mb-4">
                Purchase distressed properties, renovate strategically, and sell for profit in 6-12 months.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Fast returns</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">80-100% financing available</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Expert guidance</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all" data-testid="strategy-ground-up">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Ground-Up Construction</h3>
              <p className="text-sm text-white/50 mb-3">Build from scratch</p>
              <p className="text-white/70 mb-4">
                Develop new properties from the ground up with comprehensive construction financing and project management.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Maximum customization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Construction financing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Project oversight</span>
                </li>
              </ul>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-6 hover:border-yellow-400/50 transition-all" data-testid="strategy-build-to-rent">
              <h3 className="text-xl font-bold mb-3 text-yellow-400">Build to Rent</h3>
              <p className="text-sm text-white/50 mb-3">New construction rentals</p>
              <p className="text-white/70 mb-4">
                Develop new rental properties with modern amenities that command premium rents and attract quality tenants.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Premium rent potential</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Lower maintenance costs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Long-term appreciation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Real Estate Services</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Comprehensive solutions powered by AI technology and decades of experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-8 hover:border-yellow-400/50 transition-all"
                data-testid={`card-service-${index}`}
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-white/60 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <CheckCircle className="w-4 h-4 text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-600/10 to-yellow-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Real Estate Journey?
          </h2>
          <p className="text-xl text-white/60 mb-8">
            Connect with our expert team today and discover how Saint Vision Group can help you achieve your property goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => handleGHLCapture('apply-now')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold px-8 py-6 text-lg"
              data-testid="button-apply-now"
            >
              Apply Now
            </Button>
            <Button 
              onClick={() => handleGHLCapture('speak-advisor')}
              variant="outline" 
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg"
              data-testid="button-speak-advisor"
            >
              Speak to an Advisor
            </Button>
          </div>
        </div>
      </section>

      <GlobalFooter />
      
      {/* AI Concierge */}
      <SaintBrokerEnhanced />
    </div>
  );
}
