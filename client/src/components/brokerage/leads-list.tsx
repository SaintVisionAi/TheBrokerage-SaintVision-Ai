import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  ghlContactId: string | null;
  createdAt: Date;
}

interface AIClassification {
  id: string;
  contactId: string;
  division: string;
  priority: string;
  estimatedValue: number | null;
}

interface Opportunity {
  id: string;
  ghlOpportunityId: string | null;
  division: string | null;
  monetaryValue: number | null;
  status: string | null;
  priority: string | null;
  createdAt: Date;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export default function LeadsList() {
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/contacts"],
    refetchInterval: 30000,
  });

  const { data: classifications = [] } = useQuery<AIClassification[]>({
    queryKey: ["/api/ai-classifications"],
  });

  const { data: opportunities = [], isLoading: oppsLoading } = useQuery<Opportunity[]>({
    queryKey: ["/api/opportunities"],
    refetchInterval: 30000,
  });

  const getClassification = (contactId: string) => {
    return classifications.find(c => c.contactId === contactId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'hot': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warm': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cold': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'investment': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'real_estate': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'lending': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Recent Leads
        </h3>
        <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
          {leads.length} Total
        </Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {leads.map((lead) => {
            const classification = getClassification(lead.id);
            
            return (
              <Card 
                key={lead.id} 
                className="bg-slate-800/50 border-slate-700 p-4 hover:bg-slate-800/70 transition-colors"
                data-testid={`lead-card-${lead.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white" data-testid={`lead-name-${lead.id}`}>
                      {lead.firstName} {lead.lastName}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {classification && (
                      <>
                        <Badge className={getPriorityColor(classification.priority)} data-testid={`priority-${lead.id}`}>
                          {classification.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getDivisionColor(classification.division)} data-testid={`division-${lead.id}`}>
                          {classification.division.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                        {classification.estimatedValue && (
                          <div className="flex items-center gap-1 text-sm text-emerald-400">
                            <TrendingUp className="w-3 h-3" />
                            ${classification.estimatedValue.toLocaleString()}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(lead.createdAt).toLocaleDateString()} at {new Date(lead.createdAt).toLocaleTimeString()}
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Opportunities Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Active Opportunities
          </h3>
          <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-500/30">
            {opportunities.length} Total
          </Badge>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <Card 
                key={opp.id} 
                className="bg-slate-800/50 border-slate-700 p-4 hover:bg-slate-800/70 transition-colors"
                data-testid={`opportunity-card-${opp.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white" data-testid={`opp-name-${opp.id}`}>
                      {opp.firstName} {opp.lastName}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {opp.email}
                      </div>
                      <Badge className={getDivisionColor(opp.division || 'lending')}>
                        {(opp.division || 'lending').replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-lg font-semibold text-emerald-400">
                      <DollarSign className="w-4 h-4" />
                      {(opp.monetaryValue || 0).toLocaleString()}
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {opp.status || 'New'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {new Date(opp.createdAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
