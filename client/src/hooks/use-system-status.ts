import { useQuery } from "@tanstack/react-query";

interface SystemStatus {
  status: string;
  uptime: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  recentActivity: Array<{
    action: string;
    timestamp: Date;
    userId?: string;
  }>;
}

export function useSystemStatus() {
  return useQuery<SystemStatus>({
    queryKey: ["/api/system/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });
}
