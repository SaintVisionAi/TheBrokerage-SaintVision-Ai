import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cookie,
  Settings,
  Shield,
  BarChart,
  CheckCircle,
  XCircle,
  Calendar,
  Info
} from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Cookies() {
  const lastUpdated = "January 15, 2025";

  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "Required for basic website functionality and security",
      icon: Shield,
      required: true,
      examples: ["Authentication tokens", "Session management", "Security preferences", "Load balancing"],
      retention: "Session or up to 1 year"
    },
    {
      name: "Analytics Cookies",
      description: "Help us understand how visitors interact with our website",
      icon: BarChart,
      required: false,
      examples: ["Page views", "Click tracking", "Performance metrics", "Error reporting"],
      retention: "Up to 2 years"
    },
    {
      name: "Preference Cookies",
      description: "Remember your settings and preferences for better experience",
      icon: Settings,
      required: false,
      examples: ["Theme selection", "Language preferences", "Dashboard layout", "Notification settings"],
      retention: "Up to 1 year"
    }
  ];

  const thirdPartyServices = [
    {
      service: "Google Analytics",
      purpose: "Website traffic analysis and user behavior insights",
      dataTypes: ["Page views", "Session duration", "Geographic location", "Device information"],
      optOut: "Available via browser settings or Google Ads Settings"
    },
    {
      service: "Stripe",
      purpose: "Payment processing and fraud prevention",
      dataTypes: ["Payment information", "Transaction data", "Device fingerprinting"],
      optOut: "Required for payment processing, cannot opt out"
    },
    {
      service: "Intercom",
      purpose: "Customer support and chat functionality",
      dataTypes: ["Contact information", "Conversation history", "Usage patterns"],
      optOut: "Available in chat widget settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30 mb-6">
            <Cookie className="w-3 h-3 mr-2" />
            Cookie Policy
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Cookie
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
              Policy
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed">
            This policy explains how SaintSal™ uses cookies and similar technologies 
            to enhance your experience and improve our services while respecting your privacy.
          </p>

          <div className="flex items-center justify-center gap-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Cookies are small text files stored on your device when you visit a website. 
                    They help websites remember information about your visit, such as your preferred 
                    language and other settings, which can make your next visit easier and the site 
                    more useful to you.
                  </p>
                  <p className="text-white/80 leading-relaxed">
                    At SaintSal™, we use cookies responsibly and in accordance with our faith-aligned 
                    values to provide you with the best possible experience while protecting your privacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Types of Cookies We Use</h2>
            <p className="text-xl text-white/60">Understanding different categories and their purposes</p>
          </div>

          <div className="space-y-8">
            {cookieTypes.map((type, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <type.icon className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">{type.name}</CardTitle>
                        <p className="text-white/60">{type.description}</p>
                      </div>
                    </div>
                    {type.required ? (
                      <Badge className="bg-red-500/20 text-red-400 border-red-400/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Required
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Optional
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">Examples:</h4>
                      <ul className="space-y-2">
                        {type.examples.map((example, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span className="text-white/80 text-sm">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">Retention Period:</h4>
                      <p className="text-white/80 text-sm">{type.retention}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Third-Party Services */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Third-Party Services</h2>
            <p className="text-xl text-white/60">External services that may set cookies on our website</p>
          </div>

          <div className="space-y-6">
            {thirdPartyServices.map((service, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{service.service}</h3>
                      <p className="text-white/70 mb-4">{service.purpose}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">Data Types Collected:</h4>
                      <ul className="space-y-2">
                        {service.dataTypes.map((dataType, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Info className="w-3 h-3 text-blue-400 flex-shrink-0" />
                            <span className="text-white/80 text-sm">{dataType}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">Opt-Out Options:</h4>
                      <p className="text-white/80 text-sm">{service.optOut}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Managing Your Cookie Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Browser Settings</h3>
                  <p className="text-white/80 mb-4">
                    You can control cookie settings through your browser preferences. Most browsers allow you to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-white/80">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">SaintSal™ Cookie Preferences</h3>
                  <p className="text-white/80 mb-4">
                    You can manage your cookie preferences for our website using the controls below:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Preferences
                    </Button>
                    <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                      Accept All Cookies
                    </Button>
                    <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      Reject Optional Cookies
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Impact of Disabling Cookies</h3>
                  <p className="text-white/80 mb-4">
                    Please note that disabling certain cookies may impact your experience:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-white/80">
                    <li>Essential cookies: May prevent basic website functionality</li>
                    <li>Preference cookies: Settings and customizations may not be saved</li>
                    <li>Analytics cookies: We cannot improve our services based on usage data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
                  <p className="text-white/80 mb-4">
                    If you have questions about our cookie policy or need help managing your preferences:
                  </p>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="text-white/80">
                      <strong>Email:</strong> privacy@saintvisionai.com<br />
                      <strong>Subject:</strong> Cookie Policy Inquiry
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}