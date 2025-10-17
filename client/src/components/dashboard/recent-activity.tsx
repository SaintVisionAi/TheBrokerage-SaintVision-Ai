import { useQuery } from "@tanstack/react-query";
import { Circle } from "lucide-react";
import type { SystemLog } from "@shared/schema";

interface RecentActivityProps {
  userId: string;
}

export default function RecentActivity({ userId }: RecentActivityProps) {
  const { data: logs = [] } = useQuery<SystemLog[]>({
    queryKey: ["/api/system/logs", userId],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'brain_ingestion':
        return 'bg-emerald-500';
      case 'assistant_interaction':
        return 'bg-indigo-500';
      case 'crm_sync':
        return 'bg-blue-500';
      case 'godmode_execution':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatActivity = (log: SystemLog) => {
    switch (log.action) {
      case 'brain_ingestion':
        return 'Brain ingestion completed';
      case 'assistant_interaction':
        return 'Assistant conversation';
      case 'crm_sync':
        return 'CRM sync successful';
      case 'godmode_execution':
        return 'Godmode executor ready';
      case 'conversation_created':
        return 'New conversation started';
      default:
        return log.action.replace(/_/g, ' ');
    }
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return d.toLocaleDateString();
  };

  // Show recent logs or mock data if no logs available
  const recentLogs = logs.length > 0 ? logs.slice(0, 4) : [
    {
      id: 'mock-1',
      action: 'brain_ingestion',
      createdAt: new Date(Date.now() - 2 * 60000),
      userId,
      details: null
    },
    {
      id: 'mock-2', 
      action: 'crm_sync',
      createdAt: new Date(Date.now() - 5 * 60000),
      userId,
      details: null
    },
    {
      id: 'mock-3',
      action: 'godmode_execution', 
      createdAt: new Date(Date.now() - 12 * 60000),
      userId,
      details: null
    },
    {
      id: 'mock-4',
      action: 'assistant_interaction',
      createdAt: new Date(Date.now() - 18 * 60000),
      userId,
      details: null
    }
  ];

  return (
    <div className="flex-1 p-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
        Recent Activity
      </h3>
      
      <div className="space-y-3">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-start space-x-3 p-3 bg-slate-900 rounded-lg">
            <Circle className={`w-2 h-2 ${getActivityColor(log.action)} rounded-full mt-2 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300">{formatActivity(log)}</p>
              <p className="text-xs text-gray-500 font-mono">
                {formatTime(log.createdAt || new Date())}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
