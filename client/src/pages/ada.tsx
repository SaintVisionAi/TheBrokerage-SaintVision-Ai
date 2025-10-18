import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accessibility,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Eye,
  Keyboard,
  Volume2,
  MousePointer
} from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function ADA() {
  const lastUpdated = "January 15, 2025";

  const accessibilityFeatures = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard accessibility with logical tab order and visible focus indicators"
    },
    {
      icon: Eye,
      title: "Screen Reader Support",
      description: "ARIA labels and semantic HTML for optimal screen reader compatibility"
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Compatible with major text-to-speech software and browser extensions"
    },
    {
      icon: MousePointer,
      title: "Alternative Input Methods",
      description: "Support for voice control, eye tracking, and assistive pointing devices"
    }
  ];

  const complianceStandards = [
    {
      standard: "WCAG 2.1 Level AA",
      description: "We meet or exceed Web Content Accessibility Guidelines 2.1 at Level AA conformance",
      items: [
        "Perceivable: Content is presented in ways all users can perceive",
        "Operable: Interface components and navigation are operable by all users",
        "Understandable: Information and operation are understandable",
        "Robust: Content works with current and future assistive technologies"
      ]
    },
    {
      standard: "Section 508",
      description: "Compliant with Section 508 of the Rehabilitation Act for federal accessibility",
      items: [
        "Electronic and Information Technology accessibility",
        "Software applications and operating systems",
        "Web-based internet and intranet information",
        "Telecommunications products"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-green-500/20 text-green-400 border-green-400/30 mb-6" data-testid="badge-ada">
            <Accessibility className="w-3 h-3 mr-2" />
            ADA Accessibility Statement
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Accessibility
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Commitment
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed">
            Saint Vision Group LLC is committed to ensuring digital accessibility for people with disabilities. 
            We continually improve the user experience for everyone and apply relevant accessibility standards.
          </p>

          <div className="flex items-center justify-center gap-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Accessibility Features</h2>
            <p className="text-xl text-white/60">Built-in support for assistive technologies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessibilityFeatures.map((feature: typeof accessibilityFeatures[0], index: number) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50" data-testid={`feature-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <feature.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Compliance Standards</h2>
            <p className="text-xl text-white/60">Meeting and exceeding accessibility requirements</p>
          </div>

          <div className="space-y-8">
            {complianceStandards.map((item: typeof complianceStandards[0], index: number) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50" data-testid={`standard-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    {item.standard}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">{item.description}</p>
                  <ul className="space-y-3">
                    {item.items.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/70">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Efforts */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <div className="space-y-8 text-white/80">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Our Commitment</h3>
                  <p className="mb-4">
                    Saint Vision Group LLC strives to ensure that our services are accessible to people with 
                    disabilities. We have invested significant resources to help ensure our platform, services, 
                    and applications are easier to use and more accessible for people with disabilities.
                  </p>
                  <p>
                    Our ongoing accessibility efforts work toward conforming to WCAG 2.1 Level AA and Section 508 
                    standards. We believe in providing an accessible digital experience for all users.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Continuous Improvement</h3>
                  <p className="mb-4">We are continuously working to improve accessibility by:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Regular accessibility audits and testing with assistive technologies</li>
                    <li>Training our development team on accessibility best practices</li>
                    <li>Incorporating user feedback into our design and development process</li>
                    <li>Monitoring and updating content to maintain compliance</li>
                    <li>Working with accessibility consultants and advocacy groups</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Third-Party Content</h3>
                  <p className="mb-4">
                    While we strive to ensure accessibility throughout our platform, some content may be provided 
                    by third parties. We are not responsible for the accessibility of third-party content, but we 
                    encourage our partners to maintain accessibility standards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600/10 to-blue-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Accessibility Feedback
          </h2>
          <p className="text-xl text-white/60 mb-8">
            We welcome your feedback on the accessibility of our platform. Please let us know if you 
            encounter any accessibility barriers.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <Mail className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                <a 
                  href="mailto:saints@hacp.ai" 
                  className="text-green-400 hover:text-green-300 transition-colors"
                  data-testid="link-email-accessibility"
                >
                  saints@hacp.ai
                </a>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-6">
                <Phone className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                <a 
                  href="tel:+18005558008" 
                  className="text-green-400 hover:text-green-300 transition-colors"
                  data-testid="link-phone-accessibility"
                >
                  (800) 555-8008
                </a>
                <p className="text-white/60 text-sm mt-2">TTY: (800) 555-8009</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-white/60 text-sm mt-8">
            We aim to respond to accessibility feedback within 2 business days and to propose a solution 
            within 10 business days.
          </p>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}
