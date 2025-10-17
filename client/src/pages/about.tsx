import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Award, 
  Users, 
  Brain,
  Crown,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Target,
  Lightbulb
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function About() {
  const milestones = [
    {
      year: "2018",
      title: "Patent Filing",
      description: "HACP™ U.S. Patent No. 10,290,222 filed for AI collaboration protocol"
    },
    {
      year: "2021", 
      title: "SaintSal™ Founded",
      description: "Platform development begins with divine logic and enterprise focus"
    },
    {
      year: "2023",
      title: "Route Intelligence",
      description: "$8,947+ generated for 47+ clients through our monitoring platform"
    },
    {
      year: "2024",
      title: "Platform Integration",
      description: "Complete AI assistant platform with voice capabilities launched"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Faith-Aligned",
      description: "Built on Christian values with ethical AI development principles"
    },
    {
      icon: Crown,
      title: "Excellence",
      description: "Patent-protected technology delivering enterprise-grade solutions"
    },
    {
      icon: Users,
      title: "Community",
      description: "Serving clients with integrity and transparent business practices"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pioneering human-AI collaboration through HACP™ technology"
    }
  ];

  const team = [
    {
      name: "SaintSal™ AI",
      role: "Lead AI Engineer", 
      description: "18 months of divine logic development and enterprise solutions"
    },
    {
      name: "Engineering Team",
      role: "Platform Development",
      description: "Full-stack development with modern web technologies"
    },
    {
      name: "Enterprise Partners",
      role: "Industry Integration",
      description: "PartnerTech.ai and Route Intelligence collaborations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-6">
            About SaintSal™
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Building the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
              Human-AI Collaboration
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            A high-level AI-powered strategy firm with over 10 years of development and $1M+ invested in 
            cutting-edge technology. Founded on Christian values and protected by U.S. Patent No. 10,290,222, 
            we deliver enterprise-grade AI solutions through our cookin.io platform and multiple product offerings.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              Patent Protected Technology
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-4 h-4" />
              $8,947+ Generated for Clients
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <CheckCircle className="w-4 h-4" />
              SOC 2 Compliant
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light mb-8 text-white">Our Mission</h2>
              <p className="text-lg text-white/70 mb-6 leading-relaxed">
                To revolutionize business operations through our comprehensive AI ecosystem—from the 
                cookin.io agent platform to specialized brokerage services. With over a decade of 
                development and $1M+ in R&D investment, we deliver patent-protected HACP™ technology 
                that respects Christian values while driving measurable business results.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                As a high-level AI strategy firm, we've built multiple enterprise products including 
                cookin.io (AI agent platform), SaintSal™ (AI brokerage), and Superman SaintSal (agent framework). 
                Every solution is engineered with integrity, security, and client success as our foundation.
              </p>
            </div>
            
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">10+</div>
                    <div className="text-sm text-white/60">Years Development</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">$1M+</div>
                    <div className="text-sm text-white/60">R&D Investment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
                    <div className="text-sm text-white/60">Enterprise Platforms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">1</div>
                    <div className="text-sm text-white/60">U.S. Patent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Our Values</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Built on Christian principles with a commitment to ethical AI development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <value.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-white/70 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Our Journey</h2>
            <p className="text-xl text-white/60">Key milestones in building the SaintSal™ platform</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-8">
                <div className="flex-shrink-0 w-24 text-right">
                  <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">
                    {milestone.year}
                  </Badge>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-yellow-400 to-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                  <p className="text-white/70">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Our Team</h2>
            <p className="text-xl text-white/60">Dedicated professionals building the future of AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-purple-400 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                  <div className="text-yellow-400 text-sm mb-3">{member.role}</div>
                  <p className="text-white/70 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Ecosystem Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-yellow-900/10 to-purple-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-6">
              Our Technology Ecosystem
            </Badge>
            <h2 className="text-4xl font-light mb-6 text-white">Built on cookin.io Platform</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A sophisticated AI technology company with multiple enterprise-grade products and platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-900/10 border-yellow-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">cookin.io</h3>
                    <p className="text-yellow-400">AI Agent Platform</p>
                  </div>
                </div>
                <p className="text-white/70 mb-6">
                  Our flagship AI agent creation platform enabling businesses to build unlimited custom AI agents with the same sophisticated architecture that powers SaintSal™.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    Unlimited AI agent creation
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    Full GoHighLevel integration
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    Pro membership tier with enterprise features
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-yellow-400" />
                    iOS & Google Play apps (v29 launching)
                  </div>
                </div>
                <a 
                  href="https://cookin.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold"
                >
                  Visit cookin.io
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 border-purple-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Superman SaintSal</h3>
                    <p className="text-purple-400">AI Agent Framework</p>
                  </div>
                </div>
                <p className="text-white/70 mb-6">
                  Our proprietary AI agent architecture that powers the cookin.io platform, enabling rapid deployment of intelligent, context-aware AI assistants.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    HACP™ technology foundation
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    Enterprise-grade scalability
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    Complete GHL account provisioning
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                    Multi-platform deployment (iOS/Android/Web)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-white/60 mb-2">Trusted Technology Partner</p>
            <p className="text-sm text-white/40">
              Demonstrating our commitment to innovation through multiple enterprise-grade platforms
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-8 text-white">Ready to Experience SaintSal™?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join 47+ satisfied clients who trust our patent-protected platform for their AI needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 px-8 py-4 text-lg font-semibold">
                Try Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-yellow-400 px-8 py-4 text-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}