import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, DollarSign, Target, CheckCircle, ArrowRight, BarChart3 } from "lucide-react";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";
import InvestmentCalculator from "@/components/calculators/investment-calculator";
import { Link } from "wouter";
import SaintBrokerEnhanced from "@/components/ai/saint-broker-enhanced";

export default function Investments() {
  const offerings = [
    {
      icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
      title: "Fixed Income Investments",
      returns: "9-12% Annual Returns",
      description: "Secure, predictable returns with our fixed-income investment products",
      features: ["Guaranteed returns", "Monthly distributions", "Low risk profile", "Minimum $25K investment"]
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      title: "Real Estate Investment Trusts",
      returns: "10-14% Projected Returns",
      description: "Diversified real estate portfolio with professional management",
      features: ["Property diversification", "Passive income", "Tax advantages", "Quarterly reporting"]
    },
    {
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
      title: "Private Equity Opportunities",
      returns: "12-18% Target Returns",
      description: "Access exclusive private equity deals with strong growth potential",
      features: ["Vetted opportunities", "Co-investment options", "Expert due diligence", "5-7 year horizons"]
    },
    {
      icon: <Target className="w-8 h-8 text-yellow-400" />,
      title: "Portfolio Management",
      returns: "Customized Strategy",
      description: "Personalized investment strategy aligned with your financial goals",
      features: ["Risk assessment", "Asset allocation", "Rebalancing", "Performance tracking"]
    }
  ];

  const handleGHLCapture = (formType: string) => {
    // GHL integration placeholder - will be connected to actual webhook
    console.log(`GHL Lead Capture: ${formType}`);
    window.location.href = `/contact?service=investments&type=${formType}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-transparent to-yellow-600/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
            <BarChart3 className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">Investment Suite</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-400 to-white bg-clip-text text-transparent">
            Fixed 9-12% Returns
            <br />
            <span className="text-yellow-400">Faith-Aligned Investing</span>
          </h1>
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8">
            Institutional-grade investment opportunities backed by 10+ years of expertise and $1M+ in proven R&D. 
            Our HACP™-powered portfolio management delivers consistent returns while honoring Christian values.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => handleGHLCapture('invest-now')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold px-8 py-6 text-lg"
              data-testid="button-invest-now"
            >
              Start Investing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => handleGHLCapture('schedule-review')}
              variant="outline" 
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg"
              data-testid="button-schedule-review"
            >
              Schedule Portfolio Review
            </Button>
          </div>
        </div>
      </section>

      {/* Investment Offerings */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Premium Investment Portfolio</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Institutional-grade opportunities with AI-powered portfolio management and faith-aligned strategies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {offerings.map((offering, index) => (
              <div 
                key={index}
                className="bg-neutral-900/50 border border-neutral-900/50 rounded-xl p-8 hover:border-yellow-400/50 transition-all"
                data-testid={`card-offering-${index}`}
              >
                <div className="mb-4">{offering.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{offering.title}</h3>
                <p className="text-yellow-400 font-bold text-xl mb-3">{offering.returns}</p>
                <p className="text-white/60 mb-6">{offering.description}</p>
                <ul className="space-y-2">
                  {offering.features.map((feature, idx) => (
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

      {/* Investment ROI Calculator */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Calculate Your Investment Returns</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              See your potential earnings with our fixed 9-12% annual return investments
            </p>
          </div>
          <InvestmentCalculator />
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20 px-6 bg-neutral-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Institutional-Grade Performance</h2>
            <p className="text-white/60 text-lg">Backed by proven technology and decades of combined expertise</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "9-12%", label: "Fixed Annual Returns", icon: <TrendingUp className="w-6 h-6" /> },
              { value: "$450M+", label: "Assets Under Management", icon: <DollarSign className="w-6 h-6" /> },
              { value: "10+ Years", label: "Technology Development", icon: <Shield className="w-6 h-6" /> },
              { value: "$1M+", label: "R&D Investment", icon: <Target className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-neutral-900/50 rounded-xl border border-neutral-900/50"
                data-testid={`stat-${index}`}
              >
                <div className="text-yellow-400 flex justify-center mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                <p className="text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Invest With Us */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Premium Difference</h2>
              <div className="space-y-4">
                {[
                  { title: "Patent-Protected Technology", description: "HACP™ (U.S. Patent 10,290,222) powers our AI-driven portfolio optimization" },
                  { title: "Faith-Aligned Excellence", description: "Christian values guide every investment decision and business practice" },
                  { title: "Proven Track Record", description: "10+ years of development, $1M+ invested in cutting-edge infrastructure" },
                  { title: "Institutional Grade", description: "Enterprise-level security, compliance, and reporting standards" },
                  { title: "Fixed Returns", description: "Consistent 9-12% annual returns with transparent fee structure" }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4" data-testid={`benefit-${index}`}>
                    <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-white/60">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/20 rounded-2xl p-8 border border-yellow-400/30">
              <h3 className="text-2xl font-bold mb-6">Investment Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Initial Investment</label>
                  <input 
                    type="text" 
                    placeholder="$25,000" 
                    className="w-full bg-neutral-900 border border-neutral-900/50 rounded-lg px-4 py-3 text-white"
                    data-testid="input-investment-amount"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Expected Return Rate</label>
                  <select className="w-full bg-neutral-900 border border-neutral-900/50 rounded-lg px-4 py-3 text-white" data-testid="select-return-rate">
                    <option>9% (Conservative)</option>
                    <option>10.5% (Moderate)</option>
                    <option>12% (Aggressive)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">Investment Period</label>
                  <select className="w-full bg-neutral-900 border border-neutral-900/50 rounded-lg px-4 py-3 text-white" data-testid="select-period">
                    <option>3 Years</option>
                    <option>5 Years</option>
                    <option>7 Years</option>
                    <option>10 Years</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-neutral-900/50">
                  <p className="text-white/60 text-sm mb-2">Projected Value</p>
                  <p className="text-3xl font-bold text-yellow-400">$32,768</p>
                </div>
                <Button 
                  onClick={() => handleGHLCapture('detailed-projection')}
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
                  data-testid="button-get-projection"
                >
                  Get Detailed Projection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-600/10 to-yellow-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Invest with Confidence
          </h2>
          <p className="text-xl text-white/60 mb-8">
            Join a sophisticated investment platform backed by patent-protected AI technology and faith-aligned principles. Fixed 9-12% returns with institutional-grade security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => handleGHLCapture('open-account')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold px-8 py-6 text-lg"
              data-testid="button-open-account"
            >
              Open Investment Account
            </Button>
            <Button 
              onClick={() => handleGHLCapture('speak-advisor')}
              variant="outline" 
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg"
              data-testid="button-speak-financial-advisor"
            >
              Speak to a Financial Advisor
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
