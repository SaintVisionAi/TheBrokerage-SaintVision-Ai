import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function GlobalHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const productLinks = [
    { name: "AI Dashboard", href: "/dashboard", description: "Your AI command center" },
    { name: "Commercial Loan Products", href: "/commercial-products", description: "9 loan solutions for your business" },
    { name: "Real Estate Services", href: "/real-estate", description: "Buy, sell & financing" },
    { name: "Business Lending", href: "/lending", description: "Loans & capital solutions" },
    { name: "Investment Suite", href: "/investments", description: "9-12% fixed returns" },
    { name: "WarRoom", href: "/warroom", description: "Enterprise operations" },
    { name: "API", href: "/api", description: "Developer platform" }
  ];

  const resourceLinks = [
    { name: "Documentation", href: "/docs", description: "Complete API reference" },
    { name: "Help Center", href: "/help", description: "Support & tutorials" },
    { name: "Community", href: "/community", description: "Developer community" },
    { name: "Status", href: "/status", description: "System monitoring" },
    { name: "Blog", href: "/blog", description: "Insights & updates" }
  ];

  const companyLinks = [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="sticky top-0 w-full z-50 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2Ffae77fcf2442491fade782e3822c0421?format=webp&width=800"
                alt="Saint Vision Group Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Saint Vision Group™
                </span>
                <div className="text-xs text-white/60 uppercase tracking-wider">
                  AI BROKERAGE | HACP™ POWERED
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - LENDING FOCUSED */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            {/* PRIMARY LENDING CTA */}
            <Link href="/apply">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 px-4 py-2 font-bold animate-pulse">
                💰 Get Funding Now
              </Button>
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                Products <ChevronDown className="w-3 h-3" />
              </button>
              {productsOpen && (
                <div 
                  className="absolute top-full left-0 pt-2 z-50"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 w-80">
                    {productLinks.map((link: { name: string; href: string; description: string }) => (
                      <Link key={link.href} href={link.href}>
                        <div className="p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                          <div className="font-medium text-white">{link.name}</div>
                          <div className="text-sm text-white/60">{link.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                Resources <ChevronDown className="w-3 h-3" />
              </button>
              {resourcesOpen && (
                <div 
                  className="absolute top-full left-0 pt-2 z-50"
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                >
                  <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 w-80">
                    {resourceLinks.map((link: { name: string; href: string; description: string }) => (
                      <Link key={link.href} href={link.href}>
                        <div className="p-3 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                          <div className="font-medium text-white">{link.name}</div>
                          <div className="text-sm text-white/60">{link.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <Link href="/lending" className={`transition-colors ${location === "/lending" ? "text-yellow-400 font-medium" : "text-white/80 hover:text-white"}`}>
              Business Lending
            </Link>
            <Link href="/about" className={`transition-colors ${location === "/about" ? "text-yellow-400 font-medium" : "text-white/80 hover:text-white"}`}>
              About
            </Link>
            <Link href="/contact" className={`transition-colors ${location === "/contact" ? "text-yellow-400 font-medium" : "text-white/80 hover:text-white"}`}>
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login">
                <Button className="bg-transparent text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 border-0 font-medium transition-all">
                  Sign In
                </Button>
              </Link>
              <Link href="/apply">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold transition-all shadow-lg shadow-yellow-400/50">
                  Apply Now - Pre-Qualify
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-800">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Products */}
              <div>
                <div className="text-white font-medium mb-3">Products</div>
                <div className="space-y-2 ml-4">
                  {productLinks.map((link: { name: string; href: string; description: string }) => (
                    <Link key={link.href} href={link.href}>
                      <div className="text-white/80 hover:text-white transition-colors cursor-pointer">
                        {link.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <div className="text-white font-medium mb-3">Resources</div>
                <div className="space-y-2 ml-4">
                  {resourceLinks.map((link: { name: string; href: string; description: string }) => (
                    <Link key={link.href} href={link.href}>
                      <div className="text-white/80 hover:text-white transition-colors cursor-pointer">
                        {link.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div>
                <div className="text-white font-medium mb-3">Company</div>
                <div className="space-y-2 ml-4">
                  {companyLinks.map((link: { name: string; href: string }) => (
                    <Link key={link.href} href={link.href}>
                      <div className="text-white/80 hover:text-white transition-colors cursor-pointer">
                        {link.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/apply">
                <div className="text-white/80 hover:text-white transition-colors cursor-pointer">
                  Apply Now
                </div>
              </Link>

              {/* Mobile Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <Link href="/login">
                  <Button className="w-full bg-transparent text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 border border-yellow-400/30 font-medium transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 to-yellow-700 text-black font-bold transition-all">
                    Apply Now - Pre-Qualify
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