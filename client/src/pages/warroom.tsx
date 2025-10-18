import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Crown, 
  Zap, 
  Brain,
  Users,
  Lock,
  ArrowRight,
  CheckCircle,
  Target,
  Monitor,
  Bot,
  Mic,
  Database,
  AlertTriangle,
  Building2,
  TrendingUp
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function WarRoom() {
  const features = [
    {
      icon: Brain,
      title: "AI Command Center",
      description: "Central hub for all AI operations with real-time monitoring and control"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with military-grade encryption and access controls"
    },
    {
      icon: Monitor,
      title: "Real-time Analytics",
      description: "Live dashboards showing AI performance, usage metrics, and system health"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user workspace with role-based permissions and audit trails"
    },
    {
      icon: Bot,
      title: "Godmode Controls",
      description: "Advanced administrative controls for power users and system administrators"
    },
    {
      icon: Database,
      title: "Knowledge Management",
      description: "Centralized repository for all organizational knowledge and AI training data"
    }
  ];

  const capabilities = [
    {
      title: "Strategic AI Operations",
      items: ["Multi-model AI orchestration", "Performance optimization", "Cost monitoring", "Usage analytics"]
    },
    {
      title: "Security & Compliance",
      items: ["Access control management", "Audit trail monitoring", "Compliance reporting", "Data governance"]
    },
    {
      title: "Enterprise Integration",
      items: ["CRM synchronization", "API management", "Custom workflows", "Third-party connectors"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-red-500/20 text-red-400 border-red-400/30 mb-6">
            <AlertTriangle className="w-3 h-3 mr-2" />
            Mission Critical
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            SaintBroker™
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-400">
              Workspace
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Your AI-powered brokerage command center. Access SaintBroker AI chat, lending tools, 
            real estate services, and complete portfolio management from a single unified dashboard.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <div className="flex items-center gap-2 text-red-400">
              <Shield className="w-4 h-4" />
              Military-Grade Security
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Crown className="w-4 h-4" />
              Enterprise Exclusive
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              Real-time Monitoring
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 px-8 py-4 text-lg font-semibold" data-testid="button-request-access">
                Request Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-red-400 px-8 py-4 text-lg" data-testid="button-view-demo">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">SaintBroker Workspace Capabilities</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Complete brokerage operations powered by SaintSal™ HACP™ technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-red-500/30 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-yellow-500/20">
                    <feature.icon className="w-8 h-8 text-red-400" />
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

      {/* Capabilities Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Strategic Operations</h2>
            <p className="text-xl text-white/60">Comprehensive AI management and control systems</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {capability.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Access Requirements */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-red-900/20 to-yellow-900/20 border-red-500/30">
            <CardContent className="p-12 text-center">
              <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h2 className="text-3xl font-light mb-4 text-white">Access Your SaintBroker Workspace</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Sign up or log in to access your complete brokerage dashboard with SaintBroker AI chat, 
                lending tools, real estate services, and portfolio management.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <div className="text-white font-medium">SaintBroker AI Chat</div>
                  <div className="text-white/60 text-sm">24/7 AI assistant</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  <div className="text-white font-medium">Lending Tools</div>
                  <div className="text-white/60 text-sm">$50K-$5M capital access</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-white font-medium">Real Estate Services</div>
                  <div className="text-white/60 text-sm">Full brokerage platform</div>
                </div>
              </div>

              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold" data-testid="button-access-workspace">
                  Access Workspace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}