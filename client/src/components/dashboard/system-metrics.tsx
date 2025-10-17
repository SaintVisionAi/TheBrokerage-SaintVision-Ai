import { Circle, TrendingUp, Users, DollarSign, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface BrokerageMetrics {
  totalLeads: number;
  todayLeads: number;
  activeOpportunities: number;
  hotLeads: number;
  pipelineValue: number;
  divisionBreakdown: Array<{ division: string; count: number }>;
}

export default function SystemMetrics() {
  const { data: metrics, isLoading } = useQuery<BrokerageMetrics>({
    queryKey: ["/api/brokerage/metrics"],
    refetchInterval: 30000,
  });

  const brokerageMetrics = [
    {
      label: "Leads Today",
      value: isLoading ? "..." : `${metrics?.todayLeads || 0}`,
      icon: Users,
      color: "text-blue-400"
    },
    {
      label: "Active Opportunities",
      value: isLoading ? "..." : `${metrics?.activeOpportunities || 0}`,
      icon: TrendingUp,
      status: true,
      color: "text-emerald-400"
    },
    {
      label: "Hot Leads", 
      value: isLoading ? "..." : `${metrics?.hotLeads || 0}`,
      icon: Flame,
      color: "text-orange-400"
    },
    {
      label: "Pipeline Value",
      value: isLoading ? "..." : `$${(metrics?.pipelineValue || 0)}`,
      icon: DollarSign,
      color: "text-green-400"
    }
  ];

  return (
    <div className="p-6 border-b border-slate-700">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        SaintBroker Brokerage Metrics
      </h3>
      
      <div className="space-y-4">
        {brokerageMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between" data-testid={`metric-${metric.label.toLowerCase().replace(/ /g, '-')}`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${metric.color}`} />
                <span className="text-sm text-gray-400">{metric.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                {metric.status && (
                  <Circle className="w-2 h-2 fill-current text-emerald-500" />
                )}
                <span className={`text-sm font-mono ${metric.color}`} data-testid={`value-${metric.label.toLowerCase().replace(/ /g, '-')}`}>
                  {metric.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {metrics?.divisionBreakdown && metrics.divisionBreakdown.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Division Breakdown
          </h4>
          <div className="space-y-2">
            {metrics.divisionBreakdown.map((div, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-gray-400 capitalize">{div.division.replace(/_/g, ' ')}</span>
                <span className="text-emerald-400 font-mono">{div.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
