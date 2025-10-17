import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Lock,
  Eye,
  FileText,
  CheckCircle,
  Calendar
} from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Privacy() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Eye,
      content: [
        "Account information (name, email, company details)",
        "API usage data and request/response logs",
        "Payment and billing information",
        "Technical data (IP address, browser type, device information)",
        "Content you provide through our services"
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information", 
      icon: FileText,
      content: [
        "Provide and improve our AI services",
        "Process payments and manage accounts",
        "Communicate about service updates and support",
        "Ensure security and prevent fraud",
        "Comply with legal obligations"
      ]
    },
    {
      id: "data-sharing",
      title: "Information Sharing",
      icon: Shield,
      content: [
        "We do not sell your personal data to third parties",
        "Limited sharing with trusted service providers (payment processors, cloud infrastructure)",
        "Legal disclosure when required by law or to protect rights",
        "Business transfers (merger, acquisition) with continued privacy protection"
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        "SOC 2 Type II compliance with regular audits",
        "AES-256 encryption for data at rest and in transit",
        "Multi-factor authentication and access controls",
        "Regular security assessments and vulnerability testing",
        "Incident response procedures and breach notification"
      ]
    }
  ];

  const principles = [
    {
      title: "Faith-Aligned Values",
      description: "Our Christian values guide every privacy decision, ensuring ethical data handling"
    },
    {
      title: "Transparency First",
      description: "Clear, understandable policies about how your data is collected and used"
    },
    {
      title: "Minimal Collection",
      description: "We only collect data necessary to provide and improve our services"
    },
    {
      title: "User Control",
      description: "You have rights to access, modify, and delete your personal information"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 mb-6">
            <Shield className="w-3 h-3 mr-2" />
            Privacy Policy
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Your Privacy
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Matters to Us
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed">
            At SaintSal™, we're committed to protecting your privacy with the same integrity 
            that guides our faith-aligned business practices. This policy explains how we 
            collect, use, and safeguard your information.
          </p>

          <div className="flex items-center justify-center gap-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Our Privacy Principles</h2>
            <p className="text-xl text-white/60">Guiding values for how we handle your data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle: { title: string; description: string }, index: number) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{principle.title}</h3>
                  <p className="text-white/70 text-sm">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Privacy Sections */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((section: typeof sections[0], index: number) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <section.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Privacy Content */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto prose prose-invert max-w-none">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <div className="space-y-8 text-white/80">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Data Retention</h3>
                  <p className="mb-4">
                    We retain your personal information only as long as necessary to provide our services 
                    and fulfill the purposes outlined in this policy. API logs are retained for 90 days 
                    for security and debugging purposes, after which they are automatically deleted.
                  </p>
                  <p>
                    You may request deletion of your account and associated data at any time by 
                    contacting our support team.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Your Rights</h3>
                  <p className="mb-4">Under applicable privacy laws, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate or incomplete data</li>
                    <li>Delete your personal information</li>
                    <li>Port your data to another service</li>
                    <li>Opt out of certain data processing activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">International Transfers</h3>
                  <p className="mb-4">
                    Your data may be processed in the United States and other countries where we 
                    operate. We ensure appropriate safeguards are in place to protect your data 
                    according to this privacy policy and applicable laws.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Children's Privacy</h3>
                  <p className="mb-4">
                    Our services are not intended for children under 13 years of age. We do not 
                    knowingly collect personal information from children under 13. If we discover 
                    we have collected such information, we will delete it immediately.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Updates to This Policy</h3>
                  <p className="mb-4">
                    We may update this privacy policy from time to time. We will notify you of any 
                    material changes by email and by posting the updated policy on our website. 
                    Your continued use of our services after such updates constitutes acceptance 
                    of the revised policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">GLBA Compliance & Financial Data</h3>
                  <p className="mb-4">
                    In accordance with the Gramm-Leach-Bliley Act (GLBA), we implement strict safeguards 
                    to protect your financial information. This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Encryption of all financial data during transmission and storage</li>
                    <li>Limited access to financial information on a need-to-know basis</li>
                    <li>Regular security audits and compliance assessments</li>
                    <li>Strict vendor agreements requiring GLBA compliance</li>
                  </ul>
                  <p className="mb-4">
                    <strong>Credit Reporting Disclosure:</strong> When you apply for financing through our 
                    platform, we may share your information with credit bureaus and our lending partners. 
                    This information is used solely for credit evaluation and loan processing purposes.
                  </p>
                  <p className="mb-4">
                    <strong>Financial Data Handling:</strong> We collect and process financial information 
                    including income, assets, liabilities, and credit history to facilitate loan applications. 
                    This data is encrypted using industry-standard protocols and stored in secure, 
                    access-controlled environments.
                  </p>
                  <p className="mb-4">
                    <strong>Lender Data Sharing:</strong> We share your information with our trusted lending 
                    partners only when necessary to process your loan application. All partners are required 
                    to maintain the same level of data protection and comply with applicable privacy laws. 
                    We do not sell your financial information to third parties.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
                  <p className="mb-4">
                    If you have questions about this privacy policy or our data practices, 
                    please contact us at:
                  </p>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="mb-2">
                      <strong>Email:</strong> privacy@saintvisionai.com
                    </p>
                    <p className="mb-2">
                      <strong>Address:</strong> Saint Vision Group LLC<br />
                      Privacy Department<br />
                      [Address to be provided]
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-8">
                  <p className="text-sm text-white/60">
                    This privacy policy is effective as of {lastUpdated} and replaces any 
                    prior privacy policies. By using SaintSal™ services, you acknowledge 
                    that you have read and understood this policy.
                  </p>
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