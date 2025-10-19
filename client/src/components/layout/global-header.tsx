import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, DollarSign, Menu, X, ChevronDown, Sparkles, Briefcase, Phone, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import svgLogo from "../../assets/logo.png";

export default function GlobalHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const services = [
    { 
      name: "Commercial Lending", 
      href: "/lending", 
      icon: <DollarSign className="w-4 h-4" />,
      description: "$50K-$5M Business Loans",
      highlight: true 
    },
    { 
      name: "Real Estate", 
      href: "/real-estate", 
      icon: <Building2 className="w-4 h-4" />,
      description: "Buy, Sell & Finance" 
    },
    { 
      name: "Investments", 
      href: "/investments", 
      icon: <TrendingUp className="w-4 h-4" />,
      description: "9-12% Fixed Returns" 
    }
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="sticky top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img
                src={svgLogo}
                alt="Saint Vision Group"
                className="w-10 h-10 object-contain rounded-xl border border-yellow-500/40 shadow-lg shadow-yellow-500/20 bg-gradient-to-br from-neutral-900 to-black p-1 group-hover:shadow-yellow-500/40 transition-all duration-300"
              />
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Saint Vision Group
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
                  POWERED BY SAINTBROKER™ AI
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
                  className="absolute top-full left-0 pt-1 min-w-[280px]"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="bg-neutral-900 border border-yellow-500/20 rounded-lg shadow-2xl overflow-hidden">
                    {services.map((service) => (
                      <Link key={service.href} href={service.href}>
                        <div className={`p-4 hover:bg-yellow-500/10 transition-all cursor-pointer ${service.highlight ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${service.highlight ? 'bg-yellow-500/20' : 'bg-white/5'}`}>
                              {service.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white flex items-center gap-2">
                                {service.name}
                                {service.highlight && (
                                  <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">POPULAR</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-400 mt-0.5">{service.description}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <Link href="/client-hub" className={`px-4 py-2 font-medium transition-colors ${isActive("/client-hub") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Client Hub
            </Link>
            
            <Link href="/apply" className={`px-4 py-2 font-medium transition-colors ${isActive("/apply") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Apply Now
            </Link>
            
            <Link href="/about" className={`px-4 py-2 font-medium transition-colors ${isActive("/about") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              About
            </Link>
            
            <Link href="/contact" className={`px-4 py-2 font-medium transition-colors ${isActive("/contact") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}>
              Contact
            </Link>
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
              
              <Link href="/apply">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold shadow-lg hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
                  Get Started →
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
              
              <Link href="/apply">
                <div className={`px-4 py-3 hover:bg-yellow-500/10 transition-colors cursor-pointer ${isActive("/apply") ? "text-yellow-400 bg-yellow-500/5" : "text-white"}`}>
                  Apply Now
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
                
                <Link href="/apply">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold">
                    Get Started →
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