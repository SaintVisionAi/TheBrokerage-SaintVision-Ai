import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Crown, 
  ArrowRight, 
  CheckCircle,
  Lock,
  Award,
  Building2,
  Users,
  Brain,
  Globe,
  Cpu,
  Eye,
  FileText,
  TrendingUp,
  Star,
  Play
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [showSaintBroker, setShowSaintBroker] = useState(true); // Show immediately on load

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Auto-show SaintBroker with lending message after 2 seconds
    const timer = setTimeout(() => {
      setShowSaintBroker(true);
    }, 2000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const brokerageServices = [
    {
      icon: Building2,
      title: "Real Estate Services",
      description: "AI-powered property solutions for buying, selling, and financing with expert guidance and market insights",
      link: "/real-estate"
    },
    {
      icon: TrendingUp, 
      title: "Business Lending",
      description: "Competitive capital solutions from $50K to $5M with fast approval and flexible terms starting at 9%",
      link: "/lending"
    },
    {
      icon: Award,
      title: "Investment Suite",
      description: "Fixed 9-12% annual returns with faith-aligned strategies and HACP™-powered portfolio management",
      link: "/investments"
    }
  ];

  const eliteTech = [
    {
      icon: Crown,
      title: "SaintSal™ AI",
      description: "HACP™-powered companion with advanced reasoning",
      status: "Enterprise"
    },
    {
      icon: Cpu,
      title: "Route Intelligence", 
      description: "Real-time website monitoring & optimization",
      status: "+$47 Add-On"
    },
    {
      icon: Users,
      title: "PartnerTech.ai",
      description: "Integrated CRM with AI-powered insights",
      status: "Platform"
    }
  ];

  const ecosystemPartners = [
    {
      name: "Athena Legacy Care",
      description: "AI-powered legacy system modernization",
      icon: "🏛️",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      name: "EbyTech Finance", 
      description: "Advanced financial technology solutions",
      icon: "💎", 
      color: "from-yellow-500 to-yellow-600"
    },
    {
      name: "SVTLegal.ai",
      description: "Legal technology and compliance automation", 
      icon: "⚖️",
      color: "from-red-500 to-rose-600"
    },
    {
      name: "SBVG Institute",
      description: "Research and development excellence",
      icon: "🎓",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white overflow-hidden">
      {/* Parallax Background - Fixed Throughout Scroll */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2F446d6f0fa2c34f478f99f49fc6ba7f85?format=webp&width=800')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.7)',
          transform: 'scale(1)',
          WebkitTransform: 'scale(1)'
        }}
      />

      {/* Clean Overlay */}
      <div className="fixed inset-0 z-0 bg-neutral-900/20" />

      {/* Navigation */}
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-start justify-center pt-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* TOP CTAs - Just the two buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/apply">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 px-12 py-6 text-xl font-bold shadow-lg shadow-emerald-500/30 min-w-[250px]" data-testid="button-apply-top">
                💰 Get Funded Now
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-12 py-6 text-xl font-bold border-0 shadow-lg shadow-blue-500/30 min-w-[250px]" data-testid="button-create-account-top">
                🚀 Create Account
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-7xl md:text-8xl font-light tracking-tight mb-4 leading-none">
            <span className="text-white">
              "The Brokerage"
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-white/80 mb-3">
            By Saint Vision Technologies
          </p>

          {/* Responsible Intelligence - Royal Blue */}
          <p className="text-3xl md:text-4xl font-semibold mb-3 tracking-wide bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 bg-clip-text text-transparent" style={{
            textShadow: '0 0 40px rgba(59, 130, 246, 0.5)'
          }}>
            Responsible Intelligence
          </p>

          {/* by cookin.io - Clickable */}
          <p className="text-lg md:text-xl text-white/60 mb-3">
            by{' '}
            <a 
              href="https://cookin.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors underline decoration-white/30 hover:decoration-white"
              data-testid="link-cookin"
            >
              cookin.io
            </a>
          </p>

          {/* SaintSal™ - Beautiful Gold, Clickable */}
          <div className="mb-8">
            <a 
              href="https://cookin.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105"
              data-testid="link-saintsal"
            >
              <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent" style={{
                textShadow: '0 0 30px rgba(234, 179, 8, 0.3)'
              }}>
                SaintSal™
              </span>
            </a>
          </div>

          {/* AI Brokerage Platform Subheadline */}
          <div className="mb-8">
            <p className="text-xl md:text-2xl text-yellow-400/90 font-medium italic tracking-wide">
              AI Brokerage Platform
            </p>
            <p className="text-lg md:text-xl text-yellow-400/70 font-light italic tracking-wide mt-2">
              Real Estate • Business Lending • Investments
            </p>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform opportunities into success with innovative strategies, technology, and<br />
            unparalleled expertise. Faith-aligned. Patent-protected. GHL integrated.
          </p>

          {/* Trusted Tech Stack */}
          <div className="flex justify-center items-center gap-8 mb-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white/60">Azure Cognitive Services</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white/60">SaintSal™ HACP™</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white/60">Patent No. 10,290,222</span>
            </div>
          </div>

          {/* CTA Buttons - LENDING FOCUSED */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/apply">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 px-10 py-6 text-xl font-bold shadow-lg shadow-emerald-500/30 animate-pulse" data-testid="button-apply-funding">
                💰 Apply for Funding Now
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-6 text-xl font-semibold border-0 shadow-lg shadow-blue-500/30"
              data-testid="button-chat-saintbroker"
              onClick={() => {
                setShowSaintBroker(true);
                // Send a lending-focused message to SaintBroker
                window.postMessage({ type: 'SAINTBROKER_MESSAGE', message: 'I need funding for my business' }, '*');
              }}
            >
              💬 Chat with SaintBroker AI
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>

          {/* Patent Badge - Moved Below Buttons */}
          <div className="mb-8">
            <Badge className="bg-white/10 text-white backdrop-blur-sm px-6 py-2 border-0">
              🛡️ Protected by U.S. Patent No. 10,290,222
            </Badge>
          </div>
        </div>
      </section>

      {/* SaintBroker AI Engagement Section */}
      <section className="relative z-10 py-16 border-y border-white/10 bg-gradient-to-r from-blue-900/20 via-neutral-900/40 to-blue-900/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                  Meet SaintBroker AI™
                </h3>
              </div>
              <p className="text-xl text-white/80 mb-4 leading-relaxed">
                Your 24/7 AI brokerage assistant powered by Azure Cognitive Services and SaintSal™ HACP™ technology. 
                <span className="text-blue-400 font-medium"> Ask anything. Get instant answers. No red tape.</span>
              </p>
              <p className="text-lg text-white/60">
                Explore our services, get real-time quotes, or start your pre-qualification - all through intelligent conversation.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/apply">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 px-10 py-6 text-xl font-bold shadow-lg shadow-emerald-500/30"
                  data-testid="button-prequal-hero"
                >
                  Apply Now - Pre-Qualify
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <p className="text-sm text-white/50 text-center">No commitment • Instant approval • 100% automated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brokerage Services Section */}
      <section id="services" className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light mb-6 text-white">Full-Service AI Brokerage</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Automated solutions powered by HACP™ technology and GHL integration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {brokerageServices.map((service, index) => (
              <Link key={index} href={service.link}>
                <div className="text-center cursor-pointer hover:scale-105 transition-transform" data-testid={`service-card-${index}`}>
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors">
                    <service.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-4 text-white">{service.title}</h3>
                  <p className="text-white/70 leading-relaxed">{service.description}</p>
                  <div className="mt-4 text-yellow-400 font-medium flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Section - Technology Showcase */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-yellow-900/10 to-purple-900/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-6">
              Powered By
            </Badge>
            <h2 className="text-5xl font-light mb-6 text-white">
              HACP™ Technology & <a href="https://cookin.io" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors">cookin.io</a> AI Platform
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Enterprise-grade AI infrastructure powering unlimited agent creation and sophisticated business automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-neutral-900/50 border-yellow-400/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">cookin.io Platform</h3>
                    <p className="text-sm text-yellow-400">Unlimited AI Agents</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    Superman SaintSal agent framework
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    Full GHL integration on every agent
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    iOS & Google Play apps (v29 launching)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    Pro tier with enterprise features
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900/50 border-purple-400/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">HACP™ Technology</h3>
                    <p className="text-sm text-purple-400">Patent No. 10,290,222</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    10+ years of R&D investment
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    $1M+ in platform development
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    Multi-platform deployment ready
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    Enterprise-grade scalability
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-white/50 text-sm mb-2">A Sophisticated Technology Company</p>
            <div className="flex items-center justify-center gap-4 text-xs text-white/40">
              <span>Multiple Enterprise Platforms</span>
              <span>•</span>
              <span>Patent-Protected Innovation</span>
              <span>•</span>
              <span>Faith-Aligned Values</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative z-10 py-24 bg-neutral-900/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light mb-6 text-white">Why Saint Vision Group</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Fully automated AI brokerage with faith-aligned values</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-white/5">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">HACP™ Patent Protected</h3>
              <p className="text-white/70 leading-relaxed">U.S. Patent No. 10,290,222 - Legally protected AI automation technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-white/5">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">GHL Automation</h3>
              <p className="text-white/70 leading-relaxed">Fully integrated with GoHighLevel for seamless lead capture and CRM sync</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-white/5">
                <Brain className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-medium mb-4 text-white">AI-First Approach</h3>
              <p className="text-white/70 leading-relaxed">SaintSal™ HACP™ + Azure Cognitive Services powering every transaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Ecosystem - Apple Style */}
      <section className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light mb-6 text-white">Partner Ecosystem</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Integrated solutions across industries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {ecosystemPartners.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-6">{partner.icon}</div>
                <h3 className="text-lg font-medium text-white mb-3">{partner.name}</h3>
                <p className="text-sm text-white/60">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join The Movement - Apple Style */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-light mb-8 text-white">Join The Movement</h2>
          <p className="text-xl text-white/70 mb-16 leading-relaxed max-w-2xl mx-auto">
            We're building the future of human-AI collaboration with patent-protected technology and enterprise-proven results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 px-8 py-4 text-lg font-semibold" data-testid="button-apply-now">
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-yellow-400 px-8 py-4 text-lg" data-testid="button-contact-sales">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Powered by Advanced AI & Enterprise Security */}
      <section className="relative z-10 py-16 bg-black/95 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Powered by Advanced AI & Enterprise Security
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* AI Technology Stack */}
            <div>
              <h3 className="text-sm font-semibold text-yellow-400 mb-6 uppercase tracking-wide">AI Technology Stack</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-bold">
                  SaintSal™ AI
                </span>
                <span className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-bold">
                  HACP™ Protocol
                </span>
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full text-blue-400 text-sm font-medium">
                  Azure Cognitive
                </span>
              </div>
            </div>
            
            {/* Security & Compliance */}
            <div>
              <h3 className="text-sm font-semibold text-yellow-400 mb-6 uppercase tracking-wide">Security & Compliance</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-green-500/10 border border-green-400/30 rounded-full text-green-400 text-sm font-medium">
                  HIPAA Compliant
                </span>
                <span className="px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full text-blue-400 text-sm font-medium">
                  SOC 2 Type II
                </span>
                <span className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-bold">
                  Patented Technology
                </span>
              </div>
              <p className="text-xs text-white/60 mt-6">
                HACP™ (Human AI Connection Protocol) is a registered trademark and patented technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Saint Vision Group - Stats */}
      <section className="relative z-10 py-16 bg-black/95 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            Why Choose Saint Vision Group
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-6xl font-bold text-yellow-400 mb-3">$500M+</div>
              <p className="text-white/70 text-lg">Total Loans Funded</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-yellow-400 mb-3">2,500+</div>
              <p className="text-white/70 text-lg">Businesses Financed</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-yellow-400 mb-3">24 Hours</div>
              <p className="text-white/70 text-lg">Average Decision Time</p>
            </div>
          </div>
          
          {/* Let's Go CTA */}
          <div className="text-center mt-12">
            <Link href="/apply">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 px-12 py-6 text-xl font-bold shadow-lg shadow-yellow-400/30"
                data-testid="button-lets-go"
              >
                Let's Go! 🚀
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <GlobalFooter />
      
    </div>
  );
}
