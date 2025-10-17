import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award,
  Shield,
  FileText,
  Lightbulb,
  CheckCircle,
  ExternalLink,
  Calendar,
  User,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Patent() {
  const patentDetails = {
    number: "U.S. Patent No. 10,290,222",
    title: "Human-AI Collaboration Protocol (HACP™)",
    filingDate: "March 15, 2018",
    grantDate: "May 14, 2019",
    inventors: ["SaintSal AI Research Team"],
    assignee: "Saint Vision Group LLC"
  };

  const keyInnovations = [
    {
      title: "Adaptive Response Algorithms",
      description: "Dynamic AI behavior adjustment based on user interaction patterns and context",
      technicalDetails: "Novel machine learning algorithms that adapt response generation in real-time"
    },
    {
      title: "Context-Aware Processing",
      description: "Advanced context preservation across multi-turn conversations with memory integration",
      technicalDetails: "Proprietary memory architecture for maintaining conversational context"
    },
    {
      title: "Collaborative Interface Design",
      description: "Optimized human-AI interaction patterns for enhanced productivity and user satisfaction",
      technicalDetails: "User interface innovations that streamline AI collaboration workflows"
    },
    {
      title: "Security Integration",
      description: "Built-in security protocols ensuring safe and reliable AI interactions",
      technicalDetails: "Enterprise-grade security measures integrated at the protocol level"
    }
  ];

  const businessImpact = [
    {
      metric: "47+",
      description: "Companies using HACP™ technology",
      impact: "Proven market adoption"
    },
    {
      metric: "$2.3M",
      description: "Average annual savings per enterprise customer",
      impact: "Demonstrated ROI"
    },
    {
      metric: "40%",
      description: "Average productivity improvement",
      impact: "Measurable business value"
    },
    {
      metric: "99.9%",
      description: "System reliability and uptime",
      impact: "Enterprise-grade performance"
    }
  ];

  const intellectualProperty = [
    {
      title: "Core Patent Protection",
      description: "HACP™ technology is protected by U.S. Patent No. 10,290,222, covering our fundamental AI collaboration methods"
    },
    {
      title: "Trademark Rights",
      description: "SaintSal™, HACP™, and related marks are registered trademarks of Saint Vision Group LLC"
    },
    {
      title: "Trade Secrets",
      description: "Proprietary algorithms and implementation details protected as confidential trade secrets"
    },
    {
      title: "Licensing Program",
      description: "Technology licensing available for qualified partners and enterprise implementations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30 mb-6">
            <Award className="w-3 h-3 mr-2" />
            Patent Information
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Patent-Protected
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
              Innovation
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            SaintSal™ is built on patent-protected HACP™ technology, representing years of 
            research and development in human-AI collaboration. Our intellectual property 
            ensures unique capabilities and competitive advantages.
          </p>

          <div className="bg-slate-800/30 rounded-lg p-8 max-w-2xl mx-auto border border-yellow-400/30">
            <h2 className="text-2xl font-semibold text-white mb-4">{patentDetails.title}</h2>
            <div className="text-yellow-400 text-xl font-bold mb-4">{patentDetails.number}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
              <div>
                <span className="text-white/60">Filing Date:</span> {patentDetails.filingDate}
              </div>
              <div>
                <span className="text-white/60">Grant Date:</span> {patentDetails.grantDate}
              </div>
              <div>
                <span className="text-white/60">Assignee:</span> {patentDetails.assignee}
              </div>
              <div>
                <span className="text-white/60">Status:</span> Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Innovations */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Patented Innovations</h2>
            <p className="text-xl text-white/60">Core technologies that set SaintSal™ apart</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyInnovations.map((innovation, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                    </div>
                    <CardTitle className="text-xl text-white">{innovation.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">{innovation.description}</p>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-white/60 text-sm">
                      <strong>Technical Innovation:</strong> {innovation.technicalDetails}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Impact */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Proven Business Impact</h2>
            <p className="text-xl text-white/60">Real-world results from our patent-protected technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessImpact.map((item, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{item.metric}</div>
                  <div className="text-white font-medium mb-2">{item.description}</div>
                  <div className="text-white/60 text-sm">{item.impact}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Intellectual Property Portfolio */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Intellectual Property Portfolio</h2>
            <p className="text-xl text-white/60">Comprehensive protection of our innovations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {intellectualProperty.map((ip, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">{ip.title}</h3>
                      <p className="text-white/80">{ip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patent Details */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Patent Abstract</h2>
              
              <div className="space-y-6 text-white/80">
                <p className="leading-relaxed">
                  The present invention relates to systems and methods for Human-AI Collaboration Protocol (HACP™), 
                  providing enhanced interaction mechanisms between human users and artificial intelligence systems. 
                  The invention encompasses novel algorithms for adaptive response generation, context-aware processing, 
                  and collaborative interface design optimized for enterprise applications.
                </p>
                
                <p className="leading-relaxed">
                  Key aspects of the invention include: (1) adaptive algorithms that modify AI behavior based on 
                  user interaction patterns; (2) context preservation mechanisms that maintain conversational state 
                  across multi-turn interactions; (3) security protocols integrated at the protocol level; and 
                  (4) interface optimizations that enhance human-AI collaborative workflows.
                </p>
                
                <p className="leading-relaxed">
                  The invention has been successfully implemented in enterprise environments, demonstrating 
                  significant improvements in productivity, user satisfaction, and operational efficiency. 
                  Commercial applications include customer service automation, knowledge management systems, 
                  and enterprise decision support platforms.
                </p>

                <div className="bg-slate-700/30 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Patent Claims</h3>
                  <p className="text-white/80 text-sm mb-4">
                    The patent includes multiple claims covering various aspects of the HACP™ technology, 
                    including method claims, system claims, and computer-readable medium claims.
                  </p>
                  <Button variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                    <FileText className="w-4 h-4 mr-2" />
                    View Full Patent Document
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Licensing Information */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 border-yellow-500/30">
            <CardContent className="p-12 text-center">
              <Globe className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
              <h2 className="text-3xl font-light mb-4 text-white">Technology Licensing</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Interested in licensing HACP™ technology for your organization? 
                We offer flexible licensing arrangements for qualified partners and enterprise implementations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="text-white font-medium mb-2">Enterprise Licensing</div>
                  <div className="text-white/60 text-sm">For large-scale implementations</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="text-white font-medium mb-2">Partner Program</div>
                  <div className="text-white/60 text-sm">For technology integrators</div>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="text-white font-medium mb-2">Research Collaboration</div>
                  <div className="text-white/60 text-sm">For academic institutions</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 px-8 py-4 text-lg font-semibold">
                    Licensing Inquiry
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-yellow-400 px-8 py-4 text-lg">
                  Download Patent Summary
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