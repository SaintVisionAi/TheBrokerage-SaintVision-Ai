import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Book,
  Code,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Search,
  FileText,
  Video,
  Download,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Documentation() {
  const quickStart = [
    {
      title: "Getting Started",
      description: "Set up your SaintSal™ account and get your first API key",
      time: "5 minutes",
      link: "#getting-started"
    },
    {
      title: "Authentication",
      description: "Learn how to authenticate with our API using keys or OAuth",
      time: "10 minutes", 
      link: "#authentication"
    },
    {
      title: "First API Call",
      description: "Make your first successful API call and understand responses",
      time: "15 minutes",
      link: "#first-call"
    },
    {
      title: "Error Handling",
      description: "Implement proper error handling and debugging techniques",
      time: "20 minutes",
      link: "#error-handling"
    }
  ];

  const apiSections = [
    {
      icon: Code,
      title: "API Reference",
      description: "Complete API documentation with examples",
      items: ["Chat Completions", "Speech Synthesis", "Knowledge Management", "Analytics"]
    },
    {
      icon: Shield,
      title: "Security Guide",
      description: "Best practices for secure implementation",
      items: ["Authentication", "Rate Limiting", "Data Protection", "Compliance"]
    },
    {
      icon: Zap,
      title: "SDKs & Libraries",
      description: "Official libraries for popular programming languages",
      items: ["JavaScript/TypeScript", "Python", "Java", "C#/.NET"]
    },
    {
      icon: Globe,
      title: "Integration Guides",
      description: "Step-by-step integration with popular platforms",
      items: ["CRM Systems", "Chat Platforms", "Mobile Apps", "Web Applications"]
    }
  ];

  const resources = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Visual guides for common implementation patterns",
      count: "24 videos"
    },
    {
      icon: Download,
      title: "Sample Code",
      description: "Download working examples and starter templates",
      count: "15 examples"
    },
    {
      icon: FileText,
      title: "Case Studies",
      description: "Real-world implementations and success stories",
      count: "8 studies"
    },
    {
      icon: Book,
      title: "Best Practices",
      description: "Guidelines for optimal performance and reliability",
      count: "12 guides"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 mb-6">
            <Book className="w-3 h-3 mr-2" />
            Documentation
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Developer
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Documentation
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Everything you need to integrate SaintSal™ AI technology into your applications. 
            Comprehensive guides, API references, and examples to get you building quickly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-blue-400 px-8 py-4 text-lg">
              <Search className="w-4 h-4 mr-2" />
              Search Docs
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              Always Up-to-Date
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-4 h-4" />
              Interactive Examples
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <CheckCircle className="w-4 h-4" />
              Community Supported
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Quick Start Guide</h2>
            <p className="text-xl text-white/60">Get up and running in under 30 minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((step, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-blue-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                      {step.time}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{step.description}</p>
                  
                  <Button variant="outline" size="sm" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    Start Step {index + 1}
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Sections */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">API Documentation</h2>
            <p className="text-xl text-white/60">Comprehensive reference for all SaintSal™ APIs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {apiSections.map((section, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">{section.title}</CardTitle>
                      <p className="text-white/60 text-sm">{section.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer transition-colors">
                        <span className="text-white/80">{item}</span>
                        <ExternalLink className="w-4 h-4 text-blue-400" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Additional Resources</h2>
            <p className="text-xl text-white/60">Tools and guides to accelerate your development</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-purple-500/30 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <resource.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{resource.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{resource.description}</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                    {resource.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl text-white">Example: Chat Completion</CardTitle>
              <p className="text-white/60">Generate AI responses with conversation context</p>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-white/80 overflow-x-auto">
                <code>{`// Initialize SaintSal API client
import { SaintSalAPI } from '@saintvisionai/sdk';

const client = new SaintSalAPI({
  apiKey: process.env.SAINTVISION_API_KEY
});

// Generate AI response
const response = await client.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are a helpful AI assistant.' },
    { role: 'user', content: 'Explain HACP™ technology' }
  ],
  model: 'saintvision-gpt-4o',
  max_tokens: 500,
  temperature: 0.7
});

console.log(response.choices[0].message.content);`}</code>
              </pre>
              
              <div className="mt-6 flex gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700">
                  Try in Playground
                </Button>
                <Button variant="outline" className="border-blue-500/30 text-blue-400">
                  View Full Example
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-8 text-white">Ready to Start Building?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of developers building the next generation of AI applications with SaintSal™.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold">
                Get API Key
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-blue-400 px-8 py-4 text-lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}