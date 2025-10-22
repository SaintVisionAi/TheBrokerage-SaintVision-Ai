import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, DollarSign, Menu, X, ChevronDown, Sparkles, Briefcase, Phone, Home, MessageCircle, CreditCard, ArrowRight, PieChart, FileText, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useSaintBroker } from "@/context/SaintBrokerContext";
import svgLogo from "../../assets/logo.png";

export default function GlobalHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { openChat } = useSaintBroker();

  const services = [
    {
      category: "Lending Solutions",
      items: [
        {
          name: "Business Loans",
          href: "/apply",
          icon: <DollarSign className="w-4 h-4" />,
          description: "$50K-$5M at 9%+",
          highlight: true
        },
        {
          name: "Full Application",
          href: "/full-lending-application-1",
          icon: <Briefcase className="w-4 h-4" />,
          description: "Complete loan process"
        },
        {
          name: "Equipment Financing",
          href: "/apply",
          icon: <Building2 className="w-4 h-4" />,
          description: "Purchase & financing"
        },
        {
          name: "Lines of Credit",
          href: "/apply",
          icon: <CreditCard className="w-4 h-4" />,
          description: "Flexible credit access"
        },
      ]
    },
    {
      category: "Real Estate",
      items: [
        {
          name: "Real Estate Solutions",
          href: "/real-estate",
          icon: <Building2 className="w-4 h-4" />,
          description: "Buy, Sell & Finance"
        },
        {
          name: "Fix & Flip Loans",
          href: "/apply",
          icon: <Home className="w-4 h-4" />,
          description: "Quick project funding"
        },
        {
          name: "DSCR Loans",
          href: "/apply",
          icon: <TrendingUp className="w-4 h-4" />,
          description: "Investment properties"
        },
        {
          name: "Bridge Loans",
          href: "/apply",
          icon: <ArrowRight className="w-4 h-4" />,
          description: "48-72hr closing"
        },
      ]
    },
    {
      category: "Investments",
      items: [
        {
          name: "Investment Opportunities",
          href: "/investments",
          icon: <TrendingUp className="w-4 h-4" />,
          description: "9-12% Fixed Returns",
          highlight: true
        },
        {
          name: "Lending Fund",
          href: "/investments",
          icon: <DollarSign className="w-4 h-4" />,
          description: "Private lending syndicate"
        },
        {
          name: "Real Estate Fund",
          href: "/investments",
          icon: <Building2 className="w-4 h-4" />,
          description: "Diversified portfolio"
        },
        {
          name: "1031 Exchanges",
          href: "/investments",
          icon: <PieChart className="w-4 h-4" />,
          description: "Tax-advantaged strategies"
        },
      ]
    },
    {
      category: "Tools & Resources",
      items: [
        {
          name: "Document Upload",
          href: "/upload-documents",
          icon: <FileText className="w-4 h-4" />,
          description: "Submit loan documents"
        },
        {
          name: "File Hub",
          href: "/file-hub",
          icon: <FileText className="w-4 h-4" />,
          description: "Secure document storage"
        },
        {
          name: "Deal Analyzer",
          href: "/",
          icon: <TrendingUp className="w-4 h-4" />,
          description: "RE deal analysis"
        },
        {
          name: "Schedule Appointment",
          href: "/set-appointment",
          icon: <Calendar className="w-4 h-4" />,
          description: "Book a consultation"
        },
      ]
    }
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="sticky top-0 w-full z-50 bg-gradient-to-r from-neutral-950/40 via-black/40 to-neutral-900/40 backdrop-blur-xl border-b border-yellow-400/20 shadow-sm shadow-yellow-400/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <img
                src={svgLogo}
                alt="Saint Vision Group"
                className="w-10 h-10 object-contain rounded-md border border-yellow-400/10 bg-black/30 p-0.5 group-hover:border-yellow-400/20 transition-all duration-300"
              />
              <div className="flex flex-col">
                <div className="text-lg font-bold text-yellow-400 whitespace-nowrap">
                  Saint Vision Group
                </div>
                <div className="text-[10px] text-yellow-400/70 uppercase tracking-wider whitespace-nowrap">
                  Cookin Knowledge
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 text-white hover:text-yellow-400 transition-colors font-medium"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Briefcase className="w-4 h-4" />
                Services
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {servicesOpen && (
                <div
                  className="absolute top-full left-0 pt-1 min-w-fit"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="bg-neutral-900 border border-yellow-500/20 rounded-lg shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                      {services.map((category) => (
                        <div key={category.category} className="border-r border-yellow-500/10 last:border-r-0 px-4 py-4">
                          <div className="text-xs text-yellow-400/70 uppercase tracking-wider font-bold mb-3">
                            {category.category}
                          </div>
                          <div className="space-y-2">
                            {category.items.map((service) => (
                              <Link key={service.href} href={service.href}>
                                <div className="p-3 hover:bg-yellow-500/10 transition-all cursor-pointer rounded-lg group">
                                  <div className="flex items-start gap-2">
                                    <div className={`p-1.5 rounded ${service.highlight ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-400 group-hover:text-yellow-400'}`}>
                                      {service.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-white text-sm flex items-center gap-1">
                                        {service.name}
                                        {service.highlight && (
                                          <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full whitespace-nowrap">POPULAR</span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-400">{service.description}</div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <Link href="/client-hub" className={`px-4 py-2 font-medium transition-colors ${isActive("/client-hub") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Client Hub
            </Link>

            <Link href="/about" className={`px-4 py-2 font-medium transition-colors ${isActive("/about") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              About
            </Link>

            <Link href="/contact" className={`px-4 py-2 font-medium transition-colors ${isActive("/contact") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Contact
            </Link>

            <Button
              onClick={openChat}
              variant="ghost"
              className="text-white hover:text-yellow-400 hover:bg-yellow-400/10 font-medium flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Help/Chat
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            
            {/* Phone Number (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
              <Phone className="w-4 h-4" />
              <span>(949) 755-0720</span>
            </div>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-yellow-400/10">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white hover:text-yellow-400 transition-colors p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-yellow-500/20 py-4">
            <div className="flex flex-col space-y-2">
              
              {/* Services Section */}
              <div className="pb-2 mb-2 border-b border-gray-800">
                <div className="text-xs text-gray-500 uppercase tracking-wider px-4 mb-2">Services</div>
                {services.map((service) => (
                  <Link key={service.href} href={service.href}>
                    <div className="px-4 py-3 hover:bg-yellow-500/10 transition-colors cursor-pointer flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg">
                        {service.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {service.name}
                          {service.highlight && (
                            <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">HOT</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{service.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick Links */}
              <Link href="/client-hub">
                <div className={`px-4 py-3 hover:bg-yellow-500/10 transition-colors cursor-pointer ${isActive("/client-hub") ? "text-yellow-400 bg-yellow-500/5" : "text-white"}`}>
                  Client Hub
                </div>
              </Link>

              <Link href="/about">
                <div className={`px-4 py-3 hover:bg-yellow-500/10 transition-colors cursor-pointer ${isActive("/about") ? "text-yellow-400 bg-yellow-500/5" : "text-white"}`}>
                  About
                </div>
              </Link>

              <Link href="/contact">
                <div className={`px-4 py-3 hover:bg-yellow-500/10 transition-colors cursor-pointer ${isActive("/contact") ? "text-yellow-400 bg-yellow-500/5" : "text-white"}`}>
                  Contact
                </div>
              </Link>

              <button
                onClick={() => {
                  openChat();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 hover:bg-yellow-500/10 transition-colors cursor-pointer text-white flex items-center gap-2 w-full"
              >
                <MessageCircle className="w-4 h-4" />
                SaintBroker Chat
              </button>

              {/* Phone */}
              <div className="px-4 py-3 flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>(949) 755-0720</span>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="px-4 pt-4 space-y-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
