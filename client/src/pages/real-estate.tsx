import { Button } from "@/components/ui/button";
import { Building2, Home, DollarSign, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";
import { Link } from "wouter";
import SaintBrokerEnhanced from "@/components/ai/saint-broker-enhanced";

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
