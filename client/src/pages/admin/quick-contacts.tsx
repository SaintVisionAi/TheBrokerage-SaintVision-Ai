import { useState } from "react";
import { Mail, Phone, Send, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FUNDING_PARTNERS } from "@shared/funding-partners-ai";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";

export default function QuickContactsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const getCategoryCount = (filterId: string) => {
    if (filterId === "all") return FUNDING_PARTNERS.length;
    
    const filterTerm = filterId.replace('-', ' ').toLowerCase();
    return FUNDING_PARTNERS.filter(p => 
      p.specialties?.some(s => {
        const specialty = s.toLowerCase();
        return specialty.includes(filterTerm) || 
               (filterId === "mca" && (specialty.includes('mca') || specialty.includes('working capital')));
      })
    ).length;
  };

  const categories = [
    { id: "all", label: "All Partners", count: getCategoryCount("all") },
    { id: "mca", label: "MCA / Working Capital", count: getCategoryCount("mca") },
    { id: "real-estate", label: "Real Estate", count: getCategoryCount("real-estate") },
    { id: "equipment", label: "Equipment", count: getCategoryCount("equipment") },
    { id: "sba", label: "SBA Loans", count: getCategoryCount("sba") },
  ];

  const filteredPartners = activeFilter === "all" 
    ? FUNDING_PARTNERS
    : FUNDING_PARTNERS.filter(p => {
        const filterTerm = activeFilter.replace('-', ' ').toLowerCase();
        return p.specialties?.some(s => {
          const specialty = s.toLowerCase();
          return specialty.includes(filterTerm) || 
                 (activeFilter === "mca" && (specialty.includes('mca') || specialty.includes('working capital')));
        });
      });

  const sendDealEmail = (partner: typeof FUNDING_PARTNERS[0]) => {
    const subject = `New Deal Opportunity - Saint Vision Group`;
    const body = `Hi ${partner.name} Team,\n\nI have a new deal opportunity to discuss.\n\nPartner: ${partner.name}\nSpecialties: ${partner.specialties?.join(', ') || 'N/A'}\n\nBest regards,\nSaint Vision Group`;
    
    window.location.href = `mailto:${partner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      <GlobalHeader />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-3">
            📞 Quick Contacts
          </h1>
          <p className="text-white/70 text-lg">
            Fast partner lookup and deal routing
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-yellow-400 mr-2">
            <Filter className="h-5 w-5" />
            <span className="font-medium">Filter:</span>
          </div>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeFilter === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(category.id)}
              className={
                activeFilter === category.id
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold"
                  : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              }
              data-testid={`filter-${category.id}`}
            >
              {category.label}
              <span className="ml-2 bg-black/20 px-2 py-0.5 rounded-full text-xs">
                {category.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <Card 
              key={partner.id}
              className="bg-black/60 border-neutral-800 backdrop-blur-sm hover:border-yellow-500/30 transition-all"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  {partner.name}
                  {partner.priority === 0 && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                      ⭐
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Specialties */}
                <div className="flex flex-wrap gap-1">
                  {partner.specialties?.slice(0, 3).map((specialty, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-neutral-800 text-white/70 px-2 py-1 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                  {partner.specialties && partner.specialties.length > 3 && (
                    <span className="text-xs bg-neutral-800 text-white/70 px-2 py-1 rounded">
                      +{partner.specialties.length - 3} more
                    </span>
                  )}
                </div>

                {/* Loan Range */}
                {partner.minAmount && partner.maxAmount && (
                  <div className="text-sm text-white/60">
                    Range: ${partner.minAmount.toLocaleString()} - ${partner.maxAmount.toLocaleString()}
                  </div>
                )}

                {/* Speed */}
                {partner.speedDays && (
                  <div className="text-sm text-yellow-400">
                    ⚡ {partner.speedDays} day funding
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {partner.email && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                      onClick={() => window.location.href = `mailto:${partner.email}`}
                      data-testid={`quick-email-${partner.id}`}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  )}
                  
                  {partner.contactPhone ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                      onClick={() => window.location.href = `tel:${partner.contactPhone}`}
                      data-testid={`quick-call-${partner.id}`}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                      onClick={() => sendDealEmail(partner)}
                      data-testid={`quick-deal-${partner.id}`}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send Deal
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No partners found in this category</p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/60 border-neutral-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {FUNDING_PARTNERS.length}
                </div>
                <div className="text-white/60 text-sm">Total Partners</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 border-neutral-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  $5K-$50M+
                </div>
                <div className="text-white/60 text-sm">Funding Range</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/60 border-neutral-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  1-60 Days
                </div>
                <div className="text-white/60 text-sm">Funding Speed</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
