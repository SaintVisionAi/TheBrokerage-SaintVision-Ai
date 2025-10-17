import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Crown, 
  Shield, 
  Users,
  Database,
  Lock,
  ArrowRight,
  CheckCircle,
  Phone,
  Clock,
  Award,
  Zap,
  Globe,
  Headphones
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Enterprise() {
  const enterpriseFeatures = [
    {
      icon: Lock,
      title: "On-Premise Deployment",
      description: "Deploy SaintSal™ in your own infrastructure with complete data sovereignty"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "SOC 2 Type II, GDPR compliance, custom security policies and audit controls"
    },
    {
      icon: Users,
      title: "Unlimited Users",
      description: "Scale to thousands of users with role-based access and SSO integration"
    },
    {
      icon: Database,
      title: "Custom Integrations",
      description: "White-glove integration with your existing systems and workflows"
    },
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "24/7 priority support with dedicated customer success manager"
    },
    {
      icon: Award,
      title: "SLA Guarantees",
      description: "99.9% uptime SLA with performance guarantees and compensation"
    }
  ];

  const supportLevels = [
    {
      title: "Dedicated Success Manager",
      description: "Personal point of contact for strategic guidance",
      availability: "Business hours"
    },
    {
      title: "Priority Technical Support",
      description: "Direct access to senior engineers",
      availability: "24/7"
    },
    {
      title: "Custom Implementation",
      description: "Hands-on deployment and configuration",
      availability: "Project-based"
    },
    {
      title: "Training & Onboarding",
      description: "Comprehensive team training programs",
      availability: "Scheduled"
    }
  ];

  const industries = [
    { name: "Financial Services", icon: "🏦", description: "Banks, investment firms, fintech companies" },
    { name: "Healthcare", icon: "🏥", description: "Hospitals, pharmaceutical, medical research" },
    { name: "Government", icon: "🏛️", description: "Federal agencies, state governments, municipalities" },
    { name: "Technology", icon: "💻", description: "Software companies, cloud providers, startups" },
    { name: "Manufacturing", icon: "🏭", description: "Industrial, automotive, aerospace, defense" },
    { name: "Education", icon: "🎓", description: "Universities, research institutions, K-12 districts" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30 mb-6">
            <Building2 className="w-3 h-3 mr-2" />
            Enterprise Solutions
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Enterprise-Grade
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              AI Platform
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Deploy SaintSal™ at scale with custom implementations, dedicated support, 
            and enterprise-grade security. Built for organizations that demand the highest 
            levels of performance, security, and compliance.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              SOC 2 Type II Certified
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-4 h-4" />
              99.9% Uptime SLA
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <CheckCircle className="w-4 h-4" />
              On-Premise Available
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold">
                Contact Enterprise Sales
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-purple-400 px-8 py-4 text-lg">
              <Phone className="w-4 h-4 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Enterprise Features</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Everything you need for large-scale AI deployment and management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-purple-500/30 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <feature.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Levels */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Enterprise Support</h2>
            <p className="text-xl text-white/60">White-glove service from day one through ongoing operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportLevels.map((support, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{support.title}</h3>
                      <p className="text-white/70 mb-3">{support.description}</p>
                      <Badge className="bg-green-400/20 text-green-400 border-green-400/30 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {support.availability}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Trusted by Industries</h2>
            <p className="text-xl text-white/60">Serving organizations across sectors with specialized compliance requirements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{industry.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{industry.name}</h3>
                  <p className="text-white/60 text-sm">{industry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
            <CardContent className="p-12 text-center">
              <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h2 className="text-3xl font-light mb-4 text-white">Proven Enterprise ROI</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Our enterprise customers report average productivity gains of 40% and 
                cost savings of $2.3M annually through AI automation and optimization.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/30 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">40%</div>
                  <div className="text-white font-medium mb-1">Productivity Increase</div>
                  <div className="text-white/60 text-sm">Average across all deployments</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">$2.3M</div>
                  <div className="text-white font-medium mb-1">Annual Savings</div>
                  <div className="text-white/60 text-sm">Through automation and efficiency</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">6mo</div>
                  <div className="text-white font-medium mb-1">Payback Period</div>
                  <div className="text-white/60 text-sm">Average time to ROI</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold">
                    Get ROI Analysis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-purple-400 px-8 py-4 text-lg">
                  Download Case Studies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}