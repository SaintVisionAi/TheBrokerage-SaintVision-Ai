import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Support() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: '🔒',
      content: `Last Updated: January 2025

SAINT VISION GROUP PRIVACY POLICY

1. INTRODUCTION
Saint Vision Group ("Company," "we," "us," "our") operates the Saint Vision Group platform and related services (the "Platform"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform.

This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Platform, use our services, and interact with our business.

2. INFORMATION WE COLLECT

A. Information You Voluntarily Provide:
- Account registration information (name, email, phone, address)
- Application information for loans and investments
- Financial information (income, credit details, bank accounts)
- Documents you upload (tax returns, bank statements, identification)
- Communication information when you contact us

B. Information Collected Automatically:
- Device information (IP address, browser type, operating system)
- Usage data (pages visited, time spent, clicks)
- Cookies and similar tracking technologies
- Location data (approximate, based on IP address)

C. Information from Third Parties:
- Credit bureaus (credit reports and scores)
- Financial institutions (account verification)
- Background check providers
- Mortgage/lending partners

3. HOW WE USE YOUR INFORMATION

We use your information to:
- Process your loan and investment applications
- Verify your identity and prevent fraud
- Communicate with you about your application status
- Provide customer support
- Improve our services and website
- Comply with legal and regulatory requirements
- Send marketing communications (with your consent)
- Analyze usage patterns and trends
- Detect and prevent fraudulent activity

4. HOW WE SHARE YOUR INFORMATION

We may share your information with:
- Lending partners and financial institutions
- Credit bureaus and background check providers
- Service providers (payment processors, document storage)
- Legal counsel and law enforcement (when required)
- Other companies involved in your loan/investment (with your consent)

We do NOT sell your personal information to third parties for marketing purposes.

5. DATA SECURITY

We implement industry-standard security measures including:
- SSL/TLS encryption for data transmission
- Secure password hashing and storage
- Regular security audits and testing
- Limited access to personal information
- Secure document storage and handling

However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.

6. YOUR RIGHTS

You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your data (subject to legal requirements)
- Opt-out of marketing communications
- Request a copy of your data in a portable format
- Lodge a complaint with relevant authorities

To exercise these rights, contact us at privacy@saintvisiongroup.com.

7. CALIFORNIA PRIVACY RIGHTS (CCPA)

If you are a California resident, you have specific rights under the California Consumer Privacy Act. You may request:
- The categories of information collected
- The purposes for collection
- The categories of sources
- Deletion of information (with exceptions)

8. COOKIES AND TRACKING

We use cookies to:
- Remember your preferences
- Track website usage
- Enable essential functions
- Personalize your experience

You can control cookie settings in your browser. Disabling cookies may affect Platform functionality.

9. THIRD-PARTY LINKS

Our Platform may contain links to third-party websites. We are not responsible for their privacy practices. Review their privacy policies before providing information.

10. CHILDREN'S PRIVACY

Our Platform is not intended for individuals under 18. We do not knowingly collect information from children. If we become aware of such collection, we will delete the information promptly.

11. CONTACT US

For privacy-related questions or concerns:
- Email: privacy@saintvisiongroup.com
- Phone: (949) 755-0720
- Address: Saint Vision Group, [Address]
- Mailing List: saints@hacp.ai

12. CHANGES TO THIS POLICY

We may update this Privacy Policy periodically. Continued use of the Platform constitutes acceptance of changes.`
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: '⚖️',
      content: `Last Updated: January 2025

SAINT VISION GROUP TERMS OF SERVICE

1. AGREEMENT TO TERMS
By accessing and using the Saint Vision Group Platform, you accept and agree to be bound by these Terms of Service. If you do not agree to abide by the above, please do not use this service.

2. USE LICENSE
Permission is granted to temporarily download one copy of the materials (information or software) on Saint Vision Group's Platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
- Modify or copy the materials
- Use the materials for commercial purposes or for any public display
- Attempt to reverse engineer, disassemble or decompile any software contained
- Transmit or "mirror" the materials to any other server
- Transfer the materials to another person or "mirror" the materials on any other server
- Violate any applicable laws or regulations
- Engage in any conduct that restricts or inhibits anyone's use or enjoyment

3. DISCLAIMER
The materials on Saint Vision Group's Platform are provided as is. Saint Vision Group makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. LIMITATIONS
In no event shall Saint Vision Group or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Saint Vision Group's Platform.

5. ACCURACY OF MATERIALS
The materials appearing on Saint Vision Group's Platform could include technical, typographical, or photographic errors. Saint Vision Group does not warrant that any of the materials on the Platform are accurate, complete, or current. Saint Vision Group may make changes to the materials contained on the Platform at any time without notice.

6. MATERIALS AND CONTENT
Saint Vision Group has not reviewed all of the sites linked to its Platform and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Saint Vision Group of the site. Use of any such linked website is at the user's own risk.

7. MODIFICATIONS
Saint Vision Group may revise these Terms of Service for the Platform at any time without notice. By using this Platform, you are agreeing to be bound by the then current version of these Terms of Service.

8. GOVERNING LAW
These terms and conditions are governed by and construed in accordance with the laws of the State of California, and you irrevocably submit to the exclusive jurisdiction of the courts located in California.

9. LOAN AND INVESTMENT DISCLOSURES
- Loan products involve risk and are not FDIC insured
- Past performance does not guarantee future results
- All investments carry risk of loss
- Some products require accredited investor status
- APR and terms vary based on qualification
- Applications are subject to verification and underwriting

10. USER RESPONSIBILITIES
You are responsible for:
- Maintaining confidentiality of account credentials
- Providing accurate and truthful information
- Complying with all applicable laws
- Not attempting to gain unauthorized access
- Not transmitting viruses or malicious code
- Not harassing or abusing other users or staff

11. TERMINATION
We reserve the right to terminate your account and access to the Platform at any time, for any reason, with or without notice.

12. CONTACT INFORMATION
For questions about these Terms:
- Email: legal@saintvisiongroup.com
- Phone: (949) 755-0720`
    },
    {
      id: 'disclosures',
      title: 'Disclosure Documents',
      icon: '📋',
      content: `SAINT VISION GROUP DISCLOSURES

1. LENDING DISCLOSURES

Truth in Lending Act (TILA) Disclosures:
- Annual Percentage Rate (APR): Varies based on credit profile and loan terms
- Finance Charge: Varies by product
- Amount Financed: Requested loan amount minus any fees
- Total of Payments: Includes principal plus interest and fees
- Payment Schedule: Varies by product (monthly, quarterly, etc.)
- Right to Rescind: You have the right to cancel within 3 business days in some circumstances

Important Information:
- Rates subject to change based on qualification
- Credit approval required for all loan products
- Some products may require collateral or guarantees
- Late payment fees may apply
- Prepayment penalties may apply (check specific product)
- Not all applicants will qualify

2. INVESTMENT DISCLOSURES

Securities Disclosures:
- Investment products are not FDIC insured
- Investment returns are not guaranteed
- Past performance does not guarantee future results
- All investments carry risk of loss including loss of principal
- Liquidity may be limited on certain products
- Some products restrict who can invest (accredited investors only)

Risk Warnings:
- Real Estate Syndications: Subject to market conditions and property performance
- Private Equity: Long holding periods, limited liquidity, significant risk
- Development Projects: Highest risk, construction and market risks apply
- Fixed Income: Subject to credit and interest rate risks

Investment Minimums:
- Most products have $25,000 minimum investment
- Some products may require $100,000+ minimums
- Accreditation requirements apply to certain offerings

3. CREDIT/BACKGROUND CHECK DISCLOSURES

Credit Report Notice:
- We obtain credit reports from major bureaus
- Soft inquiries do not affect your credit score
- Hard inquiries may temporarily lower your score (5-10 points)
- You have the right to dispute inaccurate information

Background Check Notice:
- Background checks are conducted for certain products
- You will receive notice of adverse action if applicable
- You have the right to dispute findings

4. ANTI-DISCRIMINATION NOTICE

Equal Credit Opportunity:
We do not discriminate on the basis of race, color, religion, national origin, sex, marital status, age, receipt of public assistance, or exercise of consumer rights under the Equal Credit Opportunity Act.

5. ARBITRATION AND DISPUTE RESOLUTION

Most disputes will be resolved through binding arbitration, not court proceedings.
Exceptions may apply to certain regulatory matters.

6. AFFILIATE RELATIONSHIPS

We have relationships with various lending partners, service providers, and financial institutions. These relationships may involve compensation or referral fees.

7. CONTACT FOR QUESTIONS

For questions about disclosures:
- Email: disclosures@saintvisiongroup.com
- Phone: (949) 755-0720`
    },
    {
      id: 'cookies',
      title: 'Cookie Policy',
      icon: '🍪',
      content: `COOKIE POLICY

Last Updated: January 2025

1. WHAT ARE COOKIES?
Cookies are small files stored on your device that track information about your browsing. We use cookies to enhance your experience and understand how you use our Platform.

2. TYPES OF COOKIES WE USE

Essential Cookies:
- Required for login and account security
- Enable form functionality
- Maintain session information

Analytics Cookies:
- Track page visits and user behavior
- Help us improve our Platform
- Identify popular features

Marketing Cookies:
- Remember your preferences
- Enable targeted advertising
- Track conversion metrics

Functional Cookies:
- Remember your settings
- Enable personalization
- Improve user experience

3. THIRD-PARTY COOKIES

We may allow third parties (Google Analytics, Stripe, etc.) to place cookies on our Platform to:
- Analyze usage patterns
- Process payments
- Deliver advertising

4. CONTROLLING COOKIES

You can control cookies by:
- Adjusting browser settings
- Using "Do Not Track" features
- Declining cookies when prompted
- Clearing cookies regularly

Disabling cookies may affect Platform functionality.

5. UPDATES TO THIS POLICY

We may update this policy as our practices evolve.`
    },
    {
      id: 'nmls',
      title: 'NMLS Licensing Information',
      icon: '🏦',
      content: `NMLS LICENSING INFORMATION

Saint Vision Group operates in compliance with federal and state lending regulations.

1. LICENSING

The company is registered with:
- National Mortgage Licensing System (NMLS)
- State regulatory agencies
- FinCEN (Financial Crimes Enforcement Network)

2. REGULATORY COMPLIANCE

We comply with:
- Truth in Lending Act (TILA)
- Fair Credit Reporting Act (FCRA)
- Fair Lending Laws
- Anti-Money Laundering (AML) regulations
- Know Your Customer (KYC) requirements
- State lending laws

3. CONSUMER PROTECTIONS

Your rights include:
- Clear disclosure of terms
- Right to dispute information
- Equal opportunity lending
- Protection from predatory practices

4. REGULATORY BODIES

For complaints or inquiries:
- Consumer Financial Protection Bureau (CFPB)
- State Attorney General
- State Banking Commissioner
- Federal Reserve

5. LICENSING LOOKUP

To verify our licensing:
- Visit www.nmlsconsumeraccess.org
- Search by company or individual name
- View current licensing status`
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      icon: '📞',
      content: `CONTACT SUPPORT & ASSISTANCE

We're here to help! Reach out using any of these methods:

DIRECT CONTACT
Phone: (949) 755-0720
Email: saints@hacp.ai
Business Hours: Monday - Friday, 9AM - 6PM PST

SUPPORT TYPES

Loan Inquiries:
Contact: ryan@cookinknowledge.com
Phone: (949) 755-0720

Investment Inquiries:
Contact: jr@hacpglobal.ai or ryan@cookinknowledge.com

Real Estate Services:
Contact: jr@hacpglobal.ai

Technical Issues:
Email: support@saintvisiongroup.com

Privacy/Compliance:
Email: privacy@saintvisiongroup.com
Email: disclosures@saintvisiongroup.com

RESPONSE TIMES
- General Inquiries: 24 hours
- Urgent Matters: 4 hours (business hours)
- Application Status: 2-4 business days
- Complaints: 30 days investigation period

MAILING ADDRESS
Saint Vision Group
[Physical Address]
[City, State ZIP]

ONLINE CONTACT FORM
Visit our /contact page to submit a message.

We appreciate your business and are committed to exceptional customer service!`
    }
  ];

  return (
    <>
      <GlobalHeader />
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
        
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Support & Legal
            </h1>
            <p className="text-xl text-gray-400">
              Find answers, policies, and important legal information
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          
          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  const element = document.getElementById(section.id);
                  element?.scrollIntoView({ behavior: 'smooth' });
                  setExpandedSection(section.id);
                }}
                className="p-4 bg-neutral-900 border border-yellow-500/20 rounded-lg hover:border-yellow-500/50 hover:bg-neutral-800 transition-all"
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <div className="text-sm font-semibold text-white">{section.title}</div>
              </button>
            ))}
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <Card
                key={section.id}
                id={section.id}
                className="bg-neutral-900 border-yellow-500/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="text-lg font-semibold text-white text-left">
                      {section.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-yellow-400 transition-transform ${
                      expandedSection === section.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedSection === section.id && (
                  <div className="border-t border-yellow-500/20 px-6 py-4 bg-neutral-950">
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-6">
              Our support team is ready to help. Reach out anytime!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/contact'}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                Contact Support
              </Button>
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
              >
                <a href="tel:+19497550720">(949) 755-0720</a>
              </Button>
            </div>
          </div>

        </section>

      </div>
      <GlobalFooter />
    </>
  );
}
