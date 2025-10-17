import { useState } from "react";
import { Search, Mail, Phone, Copy, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FUNDING_PARTNERS } from "@shared/funding-partners-ai";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";

export default function SaintBookDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredPartners = FUNDING_PARTNERS.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    partner.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      <GlobalHeader />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-3">
            📖 SaintBook
          </h1>
          <p className="text-white/70 text-lg">
            Your complete funding partner directory - {FUNDING_PARTNERS.length} Elite Partners
          </p>
          <p className="text-yellow-400/60 text-sm mt-1">
            Internal Use Only - Saint Vision Group Partner Network
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search partners by name, specialty, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
              data-testid="input-partner-search"
            />
          </div>
          {searchTerm && (
            <p className="text-white/60 text-sm mt-2">
              Found {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Partners List */}
        <div className="space-y-4">
          {filteredPartners.map((partner) => (
            <Card 
              key={partner.id} 
              className="bg-black/60 border-neutral-800 backdrop-blur-sm hover:border-yellow-500/30 transition-all"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white mb-2 flex items-center gap-2">
                      {partner.name}
                      {partner.priority === 0 && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                          Priority
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-white/70 text-sm mb-3">{partner.description}</p>
                    
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      {partner.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => window.location.href = `mailto:${partner.email}`}
                          data-testid={`button-email-${partner.id}`}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      )}
                      {partner.contactPhone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => window.location.href = `tel:${partner.contactPhone}`}
                          data-testid={`button-phone-${partner.id}`}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      )}
                      {partner.link && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => window.open(partner.link, '_blank')}
                          data-testid={`button-link-${partner.id}`}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Portal
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                        onClick={() => copyToClipboard(partner.email || partner.name, "Partner info")}
                        data-testid={`button-copy-${partner.id}`}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(partner.id)}
                    className="text-yellow-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                    data-testid={`button-expand-${partner.id}`}
                  >
                    {expandedId === partner.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {/* Expanded Details */}
              {expandedId === partner.id && (
                <CardContent className="border-t border-neutral-800 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Info */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        {partner.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-yellow-400" />
                            <a href={`mailto:${partner.email}`} className="text-white/80 hover:text-yellow-400">
                              {partner.email}
                            </a>
                          </div>
                        )}
                        {partner.contactPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-yellow-400" />
                            <a href={`tel:${partner.contactPhone}`} className="text-white/80 hover:text-yellow-400">
                              {partner.contactPhone}
                            </a>
                          </div>
                        )}
                        {partner.contactEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-yellow-400" />
                            <a href={`mailto:${partner.contactEmail}`} className="text-white/80 hover:text-yellow-400">
                              {partner.contactEmail}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Partner Details */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Partner Details</h4>
                      <div className="space-y-2 text-sm">
                        {partner.specialties && partner.specialties.length > 0 && (
                          <div>
                            <span className="text-white/60">Specialties: </span>
                            <span className="text-white/80">{partner.specialties.join(', ')}</span>
                          </div>
                        )}
                        {partner.minAmount && partner.maxAmount && (
                          <div>
                            <span className="text-white/60">Loan Range: </span>
                            <span className="text-white/80">
                              ${partner.minAmount.toLocaleString()} - ${partner.maxAmount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {partner.speedDays && (
                          <div>
                            <span className="text-white/60">Funding Speed: </span>
                            <span className="text-white/80">{partner.speedDays} days</span>
                          </div>
                        )}
                        {partner.submissionType && (
                          <div>
                            <span className="text-white/60">Submission: </span>
                            <span className="text-white/80 capitalize">{partner.submissionType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No partners found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
