import { Badge } from '@/components/ui/badge';
import { Building2, Home, TrendingUp, ArrowRight, DollarSign, CheckCircle, Users, Briefcase, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { useLocation } from 'wouter';

export default function RealEstate() {
  const [, setLocation] = useLocation();

  return (
    <>
      <GlobalHeader />
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-transparent to-yellow-600/20" />
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-2 mb-6">
              <Building2 className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">Real Estate Solutions</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-400 to-white bg-clip-text text-transparent">
              Your Real Estate Partner
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Whether you're looking for financing or expert brokerage services, we have the solution for your real estate goals.
            </p>
          </div>
        </section>

        {/* Two Options Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
              <p className="text-white/60 text-lg">Select the service that best fits your real estate needs</p>
            </div>

            {/* Two Column Grid */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8">
              
              {/* FINANCE OPTION */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                
                <Card className="relative bg-neutral-900/50 border-yellow-500/30 backdrop-blur hover:border-yellow-500/60 transition-all duration-300 h-full overflow-hidden">
                  
                  {/* Card Header with Icon */}
                  <div className="relative pt-12 px-8 text-center bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400/30 to-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-12 h-12 text-yellow-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">Real Estate Finance</h3>
                    <p className="text-yellow-400 font-semibold text-lg mb-4">Get Financing for Your Property</p>
                  </div>

                  <CardContent className="px-8 py-8 space-y-8">
                    
                    {/* Description */}
                    <div className="space-y-3">
                      <p className="text-white/80 leading-relaxed">
                        Get fast financing for investment properties, commercial real estate, home purchases, and refinancing. 
                        We offer competitive rates and flexible terms tailored to your needs.
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white text-sm uppercase tracking-wider text-yellow-400/80">What We Offer</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Investment property loans with flexible terms</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Commercial real estate financing</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Quick closing - 48-72 hours</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Competitive rates starting at 7.5%</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">No prepayment penalties</span>
                        </li>
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-yellow-500/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">$50K-$10M</div>
                        <div className="text-xs text-white/60 mt-1">Loan Range</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">7.5%+</div>
                        <div className="text-xs text-white/60 mt-1">Starting Rate</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => setLocation('/apply?service=real-estate-finance')}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-6 text-lg h-auto mt-8 group hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300"
                    >
                      Apply for Financing
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    {/* Secondary CTA */}
                    <Button
                      variant="outline"
                      className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 py-6 h-auto"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call (949) 755-0720
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* BROKER OPTION */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                
                <Card className="relative bg-neutral-900/50 border-blue-500/30 backdrop-blur hover:border-blue-500/60 transition-all duration-300 h-full overflow-hidden">
                  
                  {/* Card Header with Icon */}
                  <div className="relative pt-12 px-8 text-center bg-gradient-to-b from-blue-500/10 via-transparent to-transparent">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400/30 to-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">Real Estate Broker</h3>
                    <p className="text-blue-400 font-semibold text-lg mb-4">Expert Guidance & Services</p>
                  </div>

                  <CardContent className="px-8 py-8 space-y-8">
                    
                    {/* Description */}
                    <div className="space-y-3">
                      <p className="text-white/80 leading-relaxed">
                        Get expert guidance from JR Taber and our experienced team. We provide comprehensive real estate services 
                        including market analysis, property selection, negotiation, and deal structuring.
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white text-sm uppercase tracking-wider text-blue-400/80">What We Offer</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Expert market analysis & opportunity identification</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Negotiation & deal structuring support</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Due diligence & property inspection coordination</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Legal & title review assistance</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-white/80">Ongoing portfolio management</span>
                        </li>
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500/20">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">$100K+</div>
                        <div className="text-xs text-white/60 mt-1">Avg Deal Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">10+ yrs</div>
                        <div className="text-xs text-white/60 mt-1">Experience</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => setLocation('/apply?service=real-estate-broker')}
                      className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-black font-bold py-6 text-lg h-auto mt-8 group hover:shadow-xl hover:shadow-blue-400/30 transition-all duration-300"
                    >
                      Get Broker Services
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    {/* Secondary CTA */}
                    <Button
                      variant="outline"
                      className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-6 h-auto"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Consultation
                    </Button>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-yellow-500/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Saint Vision Group</h2>
              <p className="text-white/60 text-lg">Industry expertise, proven results, and personalized service</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-neutral-900/30 border-yellow-500/20">
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-yellow-400 mb-3" />
                  <CardTitle>Proven Track Record</CardTitle>
                </CardHeader>
                <CardContent className="text-white/70">
                  10+ years of successful real estate deals and over $1B in financed properties
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/30 border-yellow-500/20">
                <CardHeader>
                  <Users className="w-8 h-8 text-yellow-400 mb-3" />
                  <CardTitle>Expert Team</CardTitle>
                </CardHeader>
                <CardContent className="text-white/70">
                  Experienced brokers, lenders, and specialists dedicated to your success
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/30 border-yellow-500/20">
                <CardHeader>
                  <Home className="w-8 h-8 text-yellow-400 mb-3" />
                  <CardTitle>Full Service</CardTitle>
                </CardHeader>
                <CardContent className="text-white/70">
                  Financing and brokerage services under one roof for seamless transactions
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </div>
      <GlobalFooter />
    </>
  );
}
