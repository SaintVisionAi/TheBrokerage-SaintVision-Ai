import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Zap, 
  Shield, 
  Globe,
  Database,
  Key,
  ArrowRight,
  CheckCircle,
  Copy,
  Book,
  Webhook,
  Settings,
  BarChart,
  Lock
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function API() {
  const apiFeatures = [
    {
      icon: Zap,
      title: "High Performance",
      description: "Sub-100ms response times with global CDN and smart caching"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "OAuth 2.0, API keys, rate limiting, and comprehensive audit logs"
    },
    {
      icon: Globe,
      title: "Global Availability",
      description: "99.9% uptime SLA with multi-region deployment and failover"
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "RESTful design, comprehensive docs, SDKs in multiple languages"
    }
  ];

  const endpoints = [
    {
      method: "POST",
      endpoint: "/api/v1/chat/completions",
      description: "Generate AI responses with conversation context",
      auth: "API Key"
    },
    {
      method: "POST", 
      endpoint: "/api/v1/speech/synthesize",
      description: "Convert text to speech using Azure Speech services",
      auth: "API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/speech/transcribe",
      description: "Convert audio to text with real-time processing",
      auth: "API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/knowledge/ingest",
      description: "Upload and process documents for knowledge base",
      auth: "API Key"
    },
    {
      method: "GET",
      endpoint: "/api/v1/analytics/usage",
      description: "Retrieve usage statistics and performance metrics",
      auth: "API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/crm/sync",
      description: "Synchronize data with PartnerTech CRM platform",
      auth: "OAuth 2.0"
    }
  ];

  const codeExample = `// Initialize SaintSal API client
import { SaintSalAPI } from '@saintvisionai/sdk';

const client = new SaintSalAPI({
  apiKey: process.env.SAINTVISION_API_KEY,
  baseURL: 'https://api.saintvisionai.com/v1'
});

// Generate AI response
const response = await client.chat.completions.create({
  messages: [
    { role: 'user', content: 'Explain HACP™ technology' }
  ],
  model: 'saintvision-gpt-4o',
  max_tokens: 500
});

console.log(response.choices[0].message.content);

// Convert text to speech
const audio = await client.speech.synthesize({
  text: 'Hello from SaintSal AI!',
  voice: 'neural-professional',
  format: 'mp3'
});

// Upload knowledge
const knowledge = await client.knowledge.ingest({
  file: fileBuffer,
  type: 'document',
  metadata: { category: 'product_docs' }
});`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 mb-6">
            <Code className="w-3 h-3 mr-2" />
            Developer API
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            SaintSal™
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              API Platform
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Integrate patent-protected HACP™ AI technology into your applications. 
            Enterprise-grade APIs for chat, voice processing, knowledge management, 
            and CRM integration with comprehensive developer tools.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              99.9% Uptime SLA
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-4 h-4" />
              Sub-100ms Latency
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <CheckCircle className="w-4 h-4" />
              Global CDN
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold">
                Get API Key
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-blue-400 px-8 py-4 text-lg">
              <Book className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">API Features</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Built for developers, optimized for production
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {apiFeatures.map((feature, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-blue-500/30 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg text-white mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-center text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Quick Start</h2>
            <p className="text-xl text-white/60">Get started with SaintSal API in minutes</p>
          </div>

          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Example Implementation</CardTitle>
              <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-white/80 overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">API Endpoints</h2>
            <p className="text-xl text-white/60">Comprehensive REST API for all SaintSal capabilities</p>
          </div>

          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className={`${
                        endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-400/30'
                      }`}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-white font-mono">{endpoint.endpoint}</code>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                      <Lock className="w-3 h-3 mr-1" />
                      {endpoint.auth}
                    </Badge>
                  </div>
                  <p className="text-white/70 mt-3 ml-20">{endpoint.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Rate Limits */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-400" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Free Tier</span>
                  <span className="text-white">1,000 requests/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Pro Tier</span>
                  <span className="text-white">10,000 requests/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Enterprise</span>
                  <span className="text-white">Custom limits</span>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-white/60 text-sm">
                    Rate limits reset daily at midnight UTC. Enterprise customers can request custom rate limits.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Authentication */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-white font-medium">API Key Authentication</div>
                  <code className="text-sm text-blue-400 block bg-slate-900/50 p-2 rounded">
                    Authorization: Bearer sk-saintvision-...
                  </code>
                </div>
                <div className="space-y-2">
                  <div className="text-white font-medium">OAuth 2.0 (Enterprise)</div>
                  <p className="text-white/60 text-sm">
                    For advanced integrations with user consent flows and granular permissions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-8 text-white">Ready to Build?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join developers building the next generation of AI-powered applications with SaintSal™ API.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-blue-400 px-8 py-4 text-lg">
              Read Documentation
            </Button>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}