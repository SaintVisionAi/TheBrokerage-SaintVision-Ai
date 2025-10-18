import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Shield,
  Scale,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Terms() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: [
        "By accessing or using SaintSal™ services, you agree to these terms",
        "You must be at least 18 years old or have legal guardian consent",
        "These terms constitute a legally binding agreement",
        "Continued use implies acceptance of any term updates"
      ]
    },
    {
      id: "services",
      title: "Description of Services",
      icon: FileText,
      content: [
        "AI-powered chat and conversation services",
        "Speech-to-text and text-to-speech processing",
        "Knowledge management and document processing",
        "API access and developer tools",
        "Enterprise integration and support services"
      ]
    },
    {
      id: "usage",
      title: "Acceptable Use",
      icon: Shield,
      content: [
        "Comply with all applicable laws and regulations",
        "Respect intellectual property rights of others",
        "Do not attempt to reverse engineer our services",
        "Prohibited: harmful, illegal, or fraudulent activities",
        "No violation of third-party rights or privacy"
      ]
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: Scale,
      content: [
        "Services provided on an 'as is' basis",
        "No warranties regarding availability or performance",
        "Limited liability for indirect or consequential damages",
        "Maximum liability capped at fees paid in prior 12 months",
        "Force majeure events excluded from liability"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30 mb-6">
            <FileText className="w-3 h-3 mr-2" />
            Terms of Service
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Terms of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Service
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8 leading-relaxed">
            These terms govern your use of SaintSal™ services. By using our platform, 
            you agree to these terms and our commitment to providing reliable, 
            faith-aligned AI technology.
          </p>

          <div className="flex items-center justify-center gap-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Key Terms Overview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Key Terms</h2>
            <p className="text-xl text-white/60">Essential points about using SaintSal™ services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section: typeof sections[0], index: number) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <section.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
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

      {/* Detailed Terms */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/30 border-slate-700/50">
            <CardContent className="p-8">
              <div className="space-y-8 text-white/80">
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">1. Account Registration</h3>
                  <p className="mb-4">
                    To access certain features of our services, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Provide accurate and complete registration information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Promptly update your account information as needed</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">2. API Usage and Restrictions</h3>
                  <p className="mb-4">
                    When using our API services, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Comply with rate limits and usage quotas</li>
                    <li>Not circumvent security measures or access controls</li>
                    <li>Not use services to compete with or replicate our offerings</li>
                    <li>Implement appropriate security measures in your applications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">3. Payment and Billing</h3>
                  <p className="mb-4">
                    For paid services:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Fees are charged in advance for subscription plans</li>
                    <li>Usage-based charges are billed monthly in arrears</li>
                    <li>All fees are non-refundable except as required by law</li>
                    <li>We may suspend services for non-payment after notice</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">4. Intellectual Property</h3>
                  <p className="mb-4">
                    SaintSal™ and our technology, including HACP™ (U.S. Patent No. 10,290,222), 
                    are protected by intellectual property laws. You acknowledge that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>We retain all rights to our technology and services</li>
                    <li>You receive only a limited license to use our services</li>
                    <li>You may not copy, modify, or create derivative works</li>
                    <li>Your content remains your property, subject to our usage rights</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">5. Data Processing and Privacy</h3>
                  <p className="mb-4">
                    Your use of our services is also governed by our Privacy Policy. Key points:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>We process data only as necessary to provide services</li>
                    <li>Your content is not used to train our AI models</li>
                    <li>We implement industry-standard security measures</li>
                    <li>You retain ownership of your data and content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">6. Service Availability</h3>
                  <p className="mb-4">
                    While we strive for high availability:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Services may be temporarily unavailable for maintenance</li>
                    <li>We target 99.9% uptime but do not guarantee absolute availability</li>
                    <li>Enterprise customers receive SLA guarantees per their agreements</li>
                    <li>We will provide advance notice of planned maintenance when possible</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">7. Termination</h3>
                  <p className="mb-4">
                    Either party may terminate these terms:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>You may terminate by closing your account</li>
                    <li>We may terminate for violations of these terms</li>
                    <li>We may discontinue services with reasonable notice</li>
                    <li>Certain provisions survive termination</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">8. Governing Law</h3>
                  <p className="mb-4">
                    These terms are governed by the laws of [State/Country], without regard to 
                    conflict of law principles. Any disputes will be resolved through binding 
                    arbitration in accordance with the rules of the American Arbitration Association.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h3>
                  <p className="mb-4">
                    We may update these terms from time to time. We will notify you of material 
                    changes by email and by posting the updated terms on our website. Your 
                    continued use of our services after such changes constitutes acceptance 
                    of the new terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">10. Lending Services Disclosure</h3>
                  <p className="mb-4">
                    <strong>Not a Direct Lender:</strong> Saint Vision Group LLC is not a direct lender. 
                    We are a technology platform that connects borrowers with our network of trusted lending 
                    partners. All loan products and financing options are provided by third-party lenders.
                  </p>
                  <p className="mb-4">
                    <strong>Loan Approval Subject to Lender Criteria:</strong> All loan applications are 
                    subject to approval by our lending partners based on their individual underwriting 
                    criteria. Saint Vision Group LLC does not guarantee loan approval or specific loan terms. 
                    Final loan terms, interest rates, and fees are determined by the lender.
                  </p>
                  <p className="mb-4">
                    <strong>Fair Lending Practices:</strong> We are committed to fair lending practices and 
                    equal opportunity lending. We do not discriminate based on race, color, religion, national 
                    origin, sex, marital status, age, or any other protected characteristic. All lending 
                    decisions are made by our partner lenders in accordance with applicable fair lending laws 
                    including the Equal Credit Opportunity Act (ECOA) and Fair Housing Act (FHA).
                  </p>
                  <p className="mb-4">
                    <strong>Application Process:</strong> When you submit a loan application through our 
                    platform, your information is shared with one or more lending partners for evaluation. 
                    Each lender will independently assess your application. You may be contacted by multiple 
                    lenders regarding your application. You are under no obligation to accept any loan offer.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Loan terms vary by lender and borrower qualifications</li>
                    <li>APRs typically range from 9% to 35% depending on creditworthiness</li>
                    <li>Loan amounts from $50,000 to $5,000,000 for qualified borrowers</li>
                    <li>Repayment terms from 6 months to 25 years depending on loan type</li>
                    <li>All loans subject to state and federal regulations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">11. Contact Information</h3>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <p className="mb-2">
                      If you have questions about these terms, please contact us:
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong> support@cookin.io
                    </p>
                    <p>
                      <strong>Address:</strong> Saint Vision Group LLC<br />
                      Legal Department<br />
                      [Address to be provided]
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-8">
                  <div className="flex items-start gap-3 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/30">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-200 font-medium mb-2">Important Notice</p>
                      <p className="text-yellow-100/80 text-sm">
                        These terms are effective as of {lastUpdated}. By using SaintSal™ services, 
                        you acknowledge that you have read, understood, and agree to be bound by these terms.
                      </p>
                    </div>
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