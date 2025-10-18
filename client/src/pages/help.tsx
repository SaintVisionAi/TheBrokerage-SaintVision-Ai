import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle,
  Search,
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  Shield,
  Zap,
  Book,
  Video,
  FileText
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function HelpCenter() {
  const popularTopics = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "Set up your account and make your first API call",
      articles: 12
    },
    {
      icon: Shield,
      title: "Authentication",
      description: "API keys, OAuth, and security best practices",
      articles: 8
    },
    {
      icon: MessageCircle,
      title: "Chat API",
      description: "Using the chat completions endpoint effectively",
      articles: 15
    },
    {
      icon: Phone,
      title: "Voice Processing",
      description: "Speech-to-text and text-to-speech integration",
      articles: 10
    }
  ];

  const faqItems = [
    {
      question: "How do I get started with SaintSal™ API?",
      answer: "Sign up for an account, get your API key, and follow our Quick Start guide. You can make your first API call in under 5 minutes."
    },
    {
      question: "What makes HACP™ technology different?",
      answer: "HACP™ is our patent-protected AI collaboration protocol (U.S. Patent No. 10,290,222) that enables more natural and effective human-AI interactions."
    },
    {
      question: "Is there a free tier available?",
      answer: "Yes, we offer a free tier with 1,000 API calls per day. Perfect for development and testing before upgrading to a paid plan."
    },
    {
      question: "How secure is my data?",
      answer: "We're SOC 2 Type II compliant with AES-256 encryption. Your data is never used to train models and we maintain strict privacy controls."
    },
    {
      question: "Can I use SaintSal™ for commercial projects?",
      answer: "Absolutely! Our API is designed for production use. We offer enterprise plans with SLA guarantees and dedicated support."
    },
    {
      question: "What programming languages are supported?",
      answer: "We provide official SDKs for JavaScript/TypeScript, Python, Java, and C#. You can also use our REST API with any language."
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      availability: "9 AM - 6 PM EST",
      responseTime: "< 5 minutes"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed questions via email",
      availability: "24/7",
      responseTime: "< 4 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our engineers",
      availability: "Enterprise only",
      responseTime: "Immediate"
    }
  ];

  const resourceTypes = [
    {
      icon: Book,
      title: "Documentation",
      description: "Comprehensive API reference and guides",
      count: "200+ articles"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step visual guides",
      count: "50+ videos"
    },
    {
      icon: FileText,
      title: "Sample Code",
      description: "Working examples and templates",
      count: "30+ examples"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-green-500/20 text-green-400 border-green-400/30 mb-6">
            <HelpCircle className="w-3 h-3 mr-2" />
            Help Center
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            How can we
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              help you?
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Find answers to your questions, get help with integration, 
            and learn how to make the most of SaintSal™ AI technology.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search for help articles, guides, or tutorials..."
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" data-testid="button-search-help">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              24/7 Support Available
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-4 h-4" />
              Expert Technical Team
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <CheckCircle className="w-4 h-4" />
              Comprehensive Documentation
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Popular Topics</h2>
            <p className="text-xl text-white/60">Most searched help topics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTopics.map((topic, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-green-500/30 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <topic.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{topic.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{topic.description}</p>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                    {topic.articles} articles
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-white/60">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Get Personal Support</h2>
            <p className="text-xl text-white/60">Choose the best way to reach our team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <channel.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{channel.title}</h3>
                  <p className="text-white/70 mb-4">{channel.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-white/60">
                      <Clock className="w-3 h-3" />
                      {channel.availability}
                    </div>
                    <div className="text-sm text-green-400">
                      Response: {channel.responseTime}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700" data-testid={`button-contact-${channel.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    Contact Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
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
            <h2 className="text-4xl font-light mb-6 text-white">Self-Help Resources</h2>
            <p className="text-xl text-white/60">Comprehensive learning materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resourceTypes.map((resource, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-blue-500/30 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <resource.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">{resource.title}</CardTitle>
                  <p className="text-white/60">{resource.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30 mb-4">
                    {resource.count}
                  </Badge>
                  <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10" data-testid={`button-browse-${resource.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    Browse {resource.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-6 text-green-400" />
              <h2 className="text-3xl font-light mb-4 text-white">Still Need Help?</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Our technical support team is standing by to help you succeed with SaintSal™. 
                Get personalized assistance from AI experts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 px-8 py-4 text-lg font-semibold" data-testid="button-contact-support-help">
                    Contact Support
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-green-400 px-8 py-4 text-lg" data-testid="button-schedule-call">
                  Schedule Call
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