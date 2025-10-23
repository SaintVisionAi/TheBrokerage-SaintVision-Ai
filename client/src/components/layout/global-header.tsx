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
      category: "Services",
      items: [
        {
          name: "💰 Business Lending",
          href: "/business-lending",
          description: "Full details & apply"
        },
        {
          name: "🏡 Real Estate",
          href: "/real-estate",
          description: "Finance & broker services"
        },
        {
          name: "📈 Investments",
          href: "/investments",
          description: "Opportunities & returns"
        },
      ]
    },
    {
      category: "Company",
      items: [
        {
          name: "Contact",
          href: "/contact",
          description: "Get in touch"
        },
        {
          name: "Support & Legal",
          href: "/support",
          description: "Policies & disclosure"
        },
        {
          name: "Client Hub",
          href: "/client-hub",
          description: "Manage account"
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
          <div className="hidden lg:flex items-center gap-8">

            {/* Primary Navigation Links */}
            <Link href="/business-lending" className={`px-3 py-2 font-semibold transition-colors ${isActive("/business-lending") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Business Lending
            </Link>

            <Link href="/real-estate" className={`px-3 py-2 font-semibold transition-colors ${isActive("/real-estate") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Real Estate
            </Link>

            <Link href="/investments" className={`px-3 py-2 font-semibold transition-colors ${isActive("/investments") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Investments
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 text-white hover:text-yellow-400 transition-colors font-semibold"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                More
                <ChevronDown className="w-3 h-3" />
              </button>

              {servicesOpen && (
                <div
                  className="absolute top-full right-0 pt-2 z-50"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="bg-slate-900 border border-yellow-500/30 rounded-lg shadow-2xl overflow-hidden min-w-max">
                    <div className="space-y-1 p-2">
                      {services.map((category) => (
                        <div key={category.category}>
                          <div className="text-xs text-yellow-400/60 uppercase tracking-wider px-4 py-2 font-bold">
                            {category.category}
                          </div>
                          {category.items.map((item) => (
                            <Link key={item.href} href={item.href}>
                              <div className="px-4 py-2 hover:bg-yellow-500/20 rounded transition-colors text-white hover:text-yellow-400 cursor-pointer font-medium">
                                {item.name}
                              </div>
                            </Link>
                          ))}
                          {category !== services[services.length - 1] && (
                            <div className="border-t border-yellow-500/20 my-1"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={openChat}
              variant="ghost"
              className="text-white hover:text-yellow-400 hover:bg-yellow-400/10 font-semibold flex items-center gap-2 ml-4"
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
            <div className="flex flex-col space-y-1">

              {/* Primary Links */}
              <Link href="/apply">
                <div className={`px-4 py-3 font-semibold transition-colors cursor-pointer ${isActive("/apply") || isActive("/full-lending-application-1") ? "text-yellow-400 bg-yellow-500/5" : "text-white hover:bg-yellow-500/10"}`}>
                  Business Loans
                </div>
              </Link>

              <Link href="/real-estate">
                <div className={`px-4 py-3 font-semibold transition-colors cursor-pointer ${isActive("/real-estate") ? "text-yellow-400 bg-yellow-500/5" : "text-white hover:bg-yellow-500/10"}`}>
                  Real Estate
                </div>
              </Link>

              <Link href="/investments">
                <div className={`px-4 py-3 font-semibold transition-colors cursor-pointer ${isActive("/investments") ? "text-yellow-400 bg-yellow-500/5" : "text-white hover:bg-yellow-500/10"}`}>
                  Investments
                </div>
              </Link>

              <div className="border-t border-gray-800 my-3"></div>

              {/* Services Section */}
              <div className="text-xs text-yellow-400/70 uppercase tracking-wider px-4 mb-2 font-bold">Services & Tools</div>

              {services.map((category) => (
                <div key={category.category}>
                  <div className="text-xs text-yellow-400/50 uppercase tracking-wider px-4 mt-3 mb-2 font-semibold">
                    {category.category}
                  </div>
                  {category.items.map((service) => (
                    <Link key={`${category.category}-${service.name}`} href={service.href}>
                      <div className="px-4 py-2 hover:bg-yellow-500/10 transition-colors cursor-pointer flex items-center gap-2">
                        <div className={`text-lg ${service.highlight ? 'text-yellow-400' : 'text-white'}`}>
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white flex items-center gap-2">
                            {service.name}
                            {service.highlight && (
                              <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">HOT</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{service.description}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}

              <div className="border-t border-gray-800 my-3"></div>

              {/* Company Section */}
              <div className="text-xs text-yellow-400/50 uppercase tracking-wider px-4 mb-2 font-semibold">Company</div>

              <Link href="/about">
                <div className={`px-4 py-2 hover:bg-yellow-500/10 transition-colors cursor-pointer ${isActive("/about") ? "text-yellow-400 bg-yellow-500/5" : "text-white"}`}>
                  About Us
                </div>
              </Link>

              <Link href="/contact">
                <div className={`px-4 py-2 hover:bg-yellow-500/10 transition-colors cursor-pointer ${isActive("/contact") ? "text-yellow-400 bg-yellow-500/5" : "text-white"}`}>
                  Contact
                </div>
              </Link>

              <Link href="/client-hub">
                <div className={`px-4 py-2 hover:bg-yellow-500/10 transition-colors cursor-pointer ${isActive("/client-hub") ? "text-yellow-400 bg-yellow-500/5" : "text-white"}`}>
                  Client Hub
                </div>
              </Link>

              <button
                onClick={() => {
                  openChat();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 hover:bg-yellow-500/10 transition-colors cursor-pointer text-white flex items-center gap-2 w-full font-semibold mt-3"
              >
                <MessageCircle className="w-4 h-4" />
                Help/Chat
              </button>

              {/* Phone */}
              <div className="border-t border-gray-800 my-3 pt-3 px-4 flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>(949) 755-0720</span>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="px-4 pt-2 space-y-2">
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
