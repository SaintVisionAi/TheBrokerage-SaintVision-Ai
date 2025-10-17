import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Zap,
  Building2,
  Truck,
  Home,
  LineChart,
  Briefcase,
  Leaf,
  CheckCircle,
  FileText,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function CommercialProducts() {
  const products = [
    {
      id: "term-loan",
      icon: <Building2 className="w-8 h-8 text-yellow-400" />,
      name: "Term Loan",
      tagline: "Traditional APR • No Pre-Payment Penalties",
      loanRange: "$25,000 - $2 Million",
      terms: "1-5 Years",
      rateRange: "Starting at 7.99% APR",
      funding: "1-3 Days",
      topIndustries: ["Construction", "Manufacturing", "Auto Repair", "Technology", "E-Commerce"],
      benefits: [
        "Traditional APR structure",
        "No pre-payment penalties",
        "Monthly payments",
        "Interest rate starting at 7.99% APR",
        "Fast funding in 1-3 days"
      ],
      qualifications: [
        "2 years time in business",
        "No bank liens or foreclosures in last 3 years",
        "660+ FICO score"
      ],
      paperwork: [
        "Funding application",
        "Previous year business tax return",
        "Last 4 months of business bank statements",
        "Current YTD bank statements (Balance Sheet and P&L)"
      ]
    },
    {
      id: "working-capital",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      name: "Working Capital",
      tagline: "Same Day Funding • Bad Credit OK",
      loanRange: "$10,000 - $500,000",
      terms: "3-18 Months",
      rateRange: "Competitive Rates",
      funding: "Same Day",
      topIndustries: ["Construction", "Manufacturing", "Transportation", "E-Commerce", "Medical"],
      benefits: [
        "Same day funding available",
        "Bad credit accepted",
        "Liens/judgements OK",
        "No minimum FICO required",
        "Quick access to capital"
      ],
      qualifications: [
        "6 months time in business",
        "$60,000+ gross annual revenue",
        "No minimum FICO"
      ],
      paperwork: [
        "Electronic application",
        "Year to date bank statements",
        "Year to date credit card processing statements (if applicable)"
      ]
    },
    {
      id: "ar-financing",
      icon: <LineChart className="w-8 h-8 text-yellow-400" />,
      name: "AR Financing",
      tagline: "Revolving Line • Low Cost",
      loanRange: "$10,000 - $5 Million",
      terms: "6 Months - 10 Years",
      rateRange: "Low Cost",
      funding: "2-5 Days",
      topIndustries: ["Construction", "Manufacturing", "Trucking", "Medical"],
      benefits: [
        "Low cost financing",
        "Longer terms available",
        "Larger amounts",
        "Revolving line of credit",
        "Leverage your receivables"
      ],
      qualifications: [
        "Aging AR report required",
        "600+ FICO score",
        "$500,000 annual gross sales"
      ],
      paperwork: [
        "Funding application",
        "Invoices to be leveraged",
        "Current balance sheet",
        "AR/AP aging reports",
        "Customer list"
      ]
    },
    {
      id: "equipment-financing",
      icon: <Truck className="w-8 h-8 text-yellow-400" />,
      name: "Equipment Financing",
      tagline: "Tax Benefits • Low Down Payment",
      loanRange: "$10,000 - $5 Million",
      terms: "1-5 Years",
      rateRange: "Competitive",
      funding: "1-5 Days",
      topIndustries: ["Construction", "Manufacturing", "Trucking", "Medical"],
      benefits: [
        "Monthly payments available",
        "Multi-year longer terms",
        "Low or NO down payment",
        "Tax benefits (Section 179)",
        "Keep cash flow intact"
      ],
      qualifications: [
        "No minimum time in business",
        "580+ FICO score",
        "No minimum annual gross sales"
      ],
      paperwork: [
        "Funding application",
        "Last 3 years of business tax returns",
        "Last 4 months of business bank statements",
        "Equipment invoice",
        "Business debt schedule",
        "Current YTD bank statements (Balance Sheet and P&L)"
      ]
    },
    {
      id: "line-of-credit",
      icon: <TrendingUp className="w-8 h-8 text-yellow-400" />,
      name: "Line of Credit",
      tagline: "Draw as Needed • Pay Interest on What You Use",
      loanRange: "$10,000 - $1 Million",
      terms: "6 Months - 10 Years",
      rateRange: "Competitive",
      funding: "1-3 Days",
      topIndustries: ["Construction", "Manufacturing", "Wholesale Distributor", "E-Commerce", "Medical"],
      benefits: [
        "Only pay interest on funds drawn",
        "Credit available as needed",
        "Draw as many times as you need",
        "Fast approvals",
        "Flexible access to capital"
      ],
      qualifications: [
        "6 months time in business",
        "$60,000 in annual gross sales",
        "No minimum FICO"
      ],
      paperwork: [
        "Funding application",
        "Previous year business tax return",
        "Last 4 months of business bank statements",
        "Current YTD bank statements (Balance Sheet and P&L)"
      ]
    },
    {
      id: "fix-n-flip",
      icon: <Home className="w-8 h-8 text-yellow-400" />,
      name: "Fix & Flip",
      tagline: "80-100% Purchase Funding • 100% Rehab",
      loanRange: "$50,000 - $2 Million",
      terms: "6-18 Months",
      rateRange: "Starting at 8.99%",
      funding: "3-7 Days",
      topIndustries: ["Construction", "Real Estate"],
      benefits: [
        "Rates starting at 8.99%",
        "80-100% purchase funding",
        "100% rehab funding",
        "Quick closings",
        "Experienced investor programs"
      ],
      qualifications: [
        "650 FICO score minimum",
        "Real estate experience preferred"
      ],
      paperwork: [
        "Funding application",
        "Purchase agreement or settlement statement",
        "Renovations budget",
        "List of properties purchased/sold/owned during last 3 years",
        "Copy of last appraisal (if available)",
        "Proposed after retail value (ARV)"
      ]
    },
    {
      id: "real-estate",
      icon: <Building2 className="w-8 h-8 text-yellow-400" />,
      name: "Real Estate Loan",
      tagline: "Large Amounts • Low Rates",
      loanRange: "$100,000 - $10 Million+",
      terms: "5-25 Years",
      rateRange: "Traditional APR",
      funding: "5-10 Days",
      topIndustries: ["All Industries"],
      benefits: [
        "Large funding amounts",
        "Low rates",
        "Traditional APR",
        "Long-term stability",
        "Commercial real estate financing"
      ],
      qualifications: [
        "6 months time in business",
        "$120,000 annual gross sales",
        "Must own real estate"
      ],
      paperwork: [
        "Funding application",
        "Last 3 years business tax returns",
        "Current YTD bank statements (Balance Sheet and P&L)",
        "Current balance sheet",
        "Business debt schedule",
        "Schedule of real estate owned (SREO)"
      ]
    },
    {
      id: "business-credit",
      icon: <Briefcase className="w-8 h-8 text-yellow-400" />,
      name: "Business Credit Building",
      tagline: "No Personal Guarantee • Build Credit for Your EIN",
      loanRange: "Credit Lines Available",
      terms: "Ongoing",
      rateRange: "Varies",
      funding: "Immediate Access",
      topIndustries: ["All Industries"],
      benefits: [
        "Get business credit not linked to your SSN",
        "No personal guarantee",
        "High-limit revolving accounts",
        "No personal credit check",
        "Monitor D&B, Experian, Equifax scores",
        "Access high-limit Visa/Mastercard"
      ],
      qualifications: [
        "Active business with EIN",
        "Looking to build business credit profile"
      ],
      paperwork: [
        "Business information",
        "EIN documentation",
        "Business formation documents"
      ]
    },
    {
      id: "cannabusiness",
      icon: <Leaf className="w-8 h-8 text-yellow-400" />,
      name: "Cannabusiness Financing",
      tagline: "Cannabis Industry Specialists",
      loanRange: "$50,000 - $1 Million",
      terms: "6-24 Months",
      rateRange: "Customized",
      funding: "24 Hours",
      topIndustries: ["Cannabis", "CBD", "Hemp"],
      benefits: [
        "No real estate collateral needed",
        "Funds available in 24 hours",
        "Cannabis industry expertise",
        "Limited documentation required",
        "Customized underwriting"
      ],
      qualifications: [
        "6 months time in business",
        "$60,000 annual gross revenue",
        "No minimum FICO"
      ],
      paperwork: [
        "Electronic ROK application",
        "6 months business bank statements",
        "Equipment invoice (if applicable)"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-transparent to-yellow-600/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-yellow-400/10 text-yellow-400 border-yellow-400/30">
            Commercial Lending Solutions
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
            9 Powerful Loan Products
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            From working capital to real estate financing, we have the perfect solution for your business needs.
            <span className="text-yellow-400"> Choose your product and get pre-qualified today.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold" data-testid="button-get-prequalified">
                Get Pre-Qualified Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="bg-neutral-900/50 border-neutral-900/50 hover:border-yellow-400/50 transition-all group"
                data-testid={`card-product-${product.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {product.icon}
                    </div>
                    <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30">
                      {product.funding}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">{product.name}</CardTitle>
                  <CardDescription className="text-yellow-400 font-medium">
                    {product.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Loan Details */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-black/40 rounded-lg">
                    <div>
                      <p className="text-xs text-white/50">Loan Amount</p>
                      <p className="text-sm font-bold text-white">{product.loanRange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Terms</p>
                      <p className="text-sm font-bold text-white">{product.terms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Rates</p>
                      <p className="text-sm font-bold text-yellow-400">{product.rateRange}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Funding</p>
                      <p className="text-sm font-bold text-white">{product.funding}</p>
                    </div>
                  </div>

                  {/* Top Industries */}
                  <div>
                    <p className="text-xs text-white/50 mb-2">Top Industries</p>
                    <div className="flex flex-wrap gap-1">
                      {product.topIndustries.map((industry, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-neutral-900/50 text-white/70">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div>
                    <p className="text-xs text-white/50 mb-2">Key Benefits</p>
                    <ul className="space-y-1">
                      {product.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                          <CheckCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Link href="/apply">
                    <Button className="w-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30" data-testid={`button-apply-${product.id}`}>
                      Apply for {product.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-600/10 to-yellow-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/70 mb-8">
            Complete our pre-qualification application and get a decision within 24 hours.
            No impact to your credit score.
          </p>
          <Link href="/apply">
            <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold" data-testid="button-apply-now-cta">
              Apply Now - Get Pre-Qualified
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}
