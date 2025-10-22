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
  const { data: applications, isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

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
      <div className="flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-300">Saint Vision Group - AI Brokerage Platform</p>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
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
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>All Client Applications</span>
                <Button className="bg-green-400 hover:bg-green-500 text-black font-bold" data-testid="button-refresh">
                  Refresh
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
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">Client</TableHead>
                      <TableHead className="text-slate-300">Contact</TableHead>
                      <TableHead className="text-slate-300">Loan Type</TableHead>
                      <TableHead className="text-slate-300">Amount</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Stage</TableHead>
                      <TableHead className="text-slate-300">Priority</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id} className="border-slate-700 hover:bg-slate-800/50" data-testid={`row-application-${app.id}`}>
                        <TableCell className="text-white font-medium" data-testid={`text-client-${app.id}`}>
                          {app.clientName}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="w-3 h-3" />
                              {app.clientEmail}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Phone className="w-3 h-3" />
                              {app.clientPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{app.loanType}</TableCell>
                        <TableCell className="text-green-400 font-semibold">{app.loanAmount}</TableCell>
                        <TableCell data-testid={`status-${app.id}`}>
                          {getStatusBadge(app.status)}
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">{app.currentStage}</TableCell>
                        <TableCell>
                          {getPriorityBadge(app.priority)}
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{app.applicationDate}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/30"
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
