import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Users,
  DollarSign,
  TrendingUp,
  Phone,
  Mail
} from "lucide-react";
import { Link } from "wouter";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";

interface Application {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  loanAmount: string;
  loanType: string;
  status: 'pending' | 'submitted' | 'incomplete' | 'completed';
  currentStage: string;
  applicationDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface DashboardStats {
  totalApplications: number;
  pending: number;
  submitted: number;
  incomplete: number;
  completed: number;
  totalLoanValue: string;
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { data: applications, isLoading: appsLoading, refetch: refetchApplications } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
  });

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Try to sync GHL data first
      const syncResponse = await fetch('/api/admin/sync-ghl', { method: 'POST' });
      if (syncResponse.ok) {
        console.log('✅ GHL sync completed');
      }

      // Then refetch the data
      await Promise.all([
        refetchApplications(),
        refetchStats()
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30', icon: Clock },
      submitted: { color: 'bg-blue-500/20 text-blue-400 border-blue-400/30', icon: FileText },
      incomplete: { color: 'bg-red-500/20 text-red-400 border-red-400/30', icon: AlertCircle },
      completed: { color: 'bg-green-500/20 text-green-400 border-green-400/30', icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-400/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      low: 'bg-gray-500/20 text-gray-400 border-gray-400/30',
    };
    
    return (
      <Badge className={colors[priority as keyof typeof colors] || colors.medium}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  if (appsLoading || statsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <GlobalHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading admin dashboard...</div>
        </div>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <GlobalHeader />
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 pb-20">
          {/* Header */}
          <header className="mb-8 pt-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-yellow-400">
                  Admin Dashboard
                </h1>
                <p className="text-slate-300 text-lg">Saint Vision Group - AI Brokerage Platform</p>
              </div>
              <Badge className="bg-green-600/30 text-green-300 border-green-500/50 border px-4 py-2 text-sm font-semibold w-fit">
                ✨ Live Monitoring
              </Badge>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Total</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats?.totalApplications || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Pending</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">{stats?.pending || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-blue-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Submitted</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">{stats?.submitted || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-red-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Incomplete</p>
                    <p className="text-3xl font-bold text-red-400 mt-2">{stats?.incomplete || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-green-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Completed</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">{stats?.completed || 0}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/80 border-emerald-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm font-semibold uppercase tracking-wide">Total Value</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">{stats?.totalLoanValue || "$0"}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center justify-between">
                <span className="text-2xl font-bold">All Client Applications</span>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-10 px-6" data-testid="button-refresh">
                  🔄 Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!applications || applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg">No applications yet</p>
                  <p className="text-slate-500 text-sm mt-2">Applications will appear here once clients start submitting</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-600/50 bg-slate-800/30 hover:bg-slate-800/30">
                      <TableHead className="text-slate-200 font-bold">Client</TableHead>
                      <TableHead className="text-slate-200 font-bold">Contact</TableHead>
                      <TableHead className="text-slate-200 font-bold">Loan Type</TableHead>
                      <TableHead className="text-slate-200 font-bold">Amount</TableHead>
                      <TableHead className="text-slate-200 font-bold">Status</TableHead>
                      <TableHead className="text-slate-200 font-bold">Stage</TableHead>
                      <TableHead className="text-slate-200 font-bold">Priority</TableHead>
                      <TableHead className="text-slate-200 font-bold">Date</TableHead>
                      <TableHead className="text-slate-200 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id} className="border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors" data-testid={`row-application-${app.id}`}>
                        <TableCell className="text-white font-semibold py-4" data-testid={`text-client-${app.id}`}>
                          {app.clientName}
                        </TableCell>
                        <TableCell className="text-slate-100 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-300">{app.clientEmail}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-300">{app.clientPhone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-100 font-medium py-4">{app.loanType}</TableCell>
                        <TableCell className="text-green-300 font-bold py-4">{app.loanAmount}</TableCell>
                        <TableCell className="py-4" data-testid={`status-${app.id}`}>
                          {getStatusBadge(app.status)}
                        </TableCell>
                        <TableCell className="text-slate-100 text-sm py-4 font-medium">{app.currentStage}</TableCell>
                        <TableCell className="py-4">
                          {getPriorityBadge(app.priority)}
                        </TableCell>
                        <TableCell className="text-slate-200 text-sm py-4">{app.applicationDate}</TableCell>
                        <TableCell className="py-4">
                          <Button
                            size="sm"
                            className="bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 border border-blue-400/50 font-semibold"
                            data-testid={`button-view-${app.id}`}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
}
