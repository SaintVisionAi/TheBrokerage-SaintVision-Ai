import { Link } from "wouter";

export default function GlobalFooter() {
  const footerLinks = {
    Product: [
      { name: "AI Dashboard", href: "/dashboard" },
      { name: "Real Estate", href: "/real-estate" },
      { name: "Business Lending", href: "/lending" },
      { name: "Investments", href: "/investments" },
      { name: "WarRoom", href: "/warroom" },
      { name: "API", href: "/api" }
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
      { name: "cookin.io Platform", href: "https://cookin.io", external: true }
    ],
    Resources: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Status", href: "/status" }
    ],
    Legal: [
      { name: "ADA Statement", href: "/ada" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Patent Info", href: "/patent" }
    ]
  };

  return (
    <footer className="relative z-10 bg-black/95 backdrop-blur-sm border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content - Links Only */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2Fa84bf594ade74dd483b9e0584a784499?format=webp&width=800"
                alt="SaintVision Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Saint Vision Group™
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Full-service AI Brokerage transforming opportunities into success with innovative 
              strategies, technology, and unparalleled expertise. Powered by HACP™ technology.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.Product.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                    data-testid={`link-footer-product-${index}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.Company.map((link, index) => (
                <li key={index}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-yellow-400 text-sm transition-colors"
                      data-testid={`link-footer-company-${index}`}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                      data-testid={`link-footer-company-${index}`}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.Resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                    data-testid={`link-footer-resources-${index}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.Legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                    data-testid={`link-footer-legal-${index}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Disclosure Only */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="text-center space-y-4">
            <div className="text-sm font-semibold text-white/80">
              Saint Vision Group LLC ©2025 | ALL RIGHTS RESERVED | LOANS SUBJECT TO LENDER APPROVAL
            </div>
            
            <p className="text-xs text-white/60 max-w-3xl mx-auto leading-relaxed">
              While Saint Vision Group LLC provides expert insights and financing strategies, we are not a direct lender. 
              All loans are subject to approval by our trusted lending partners.
            </p>

            <div className="flex items-center justify-center gap-3 text-xs text-white/60">
              <Link href="/ada" className="hover:text-yellow-400 transition-colors uppercase font-medium" data-testid="link-ada-statement">
                ADA STATEMENT
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-yellow-400 transition-colors uppercase font-medium" data-testid="link-terms">
                TERMS & CONDITIONS
              </Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-yellow-400 transition-colors uppercase font-medium" data-testid="link-privacy">
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
