import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DollarSign,
  Home,
  Building2,
  TrendingUp,
  FileText,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Send,
  Loader2,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Briefcase,
  PieChart,
  Wrench,
  HelpCircle,
  Clock,
  Phone,
  Upload,
  Download,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/use-chat';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import PipelineProgress from '@/components/pipeline/pipeline-progress';

interface ClientPortalData {
  hasData: boolean;
  message?: string;
  client?: {
    name: string;
    email: string;
    phone: string;
  };
  application?: {
    loanAmount: string;
    loanType: string;
    applicationDate: string;
    currentStage: string;
    priority: string;
    status: string;
    estimatedFunding: string;
  };
  pipelineStages?: Array<{
    name: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
  }>;
  documents?: {
    needed: string[];
    uploaded: string[];
  };
}

interface PipelineData {
  hasApplication: boolean;
  application?: any;
  pipeline?: {
    stages: Array<{
      name: string;
      status: 'completed' | 'current' | 'pending';
      stage: string;
    }>;
    currentStage: string;
    progressPercentage: number;
    completedStages: number;
    totalStages: number;
  };
  documents?: {
    uploaded: string[];
    needed: string[];
    uploadedCount: number;
  };
  funding?: any;
  timeline?: any;
}

export default function ClientHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lending' | 'investments' | 'real-estate' | 'tools' | 'account'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { messages, sendMessage, isLoading: chatLoading } = useChat('user-123', 'hub-chat');
  const [chatInput, setChatInput] = useState('');
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [pipelineLoading, setPipelineLoading] = useState(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const { data: portalData, isLoading: portalLoading } = useQuery<ClientPortalData>({
    queryKey: ["/api/client-portal"],
    refetchInterval: 30000,
  });

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const response = await fetch('/api/pipeline/current', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setPipelineData(data);
        }
      } catch (error) {
        console.error('Failed to fetch pipeline:', error);
      } finally {
        setPipelineLoading(false);
      }
    };

    fetchPipelineData();
    const interval = setInterval(fetchPipelineData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const client = portalData?.client;
  const application = portalData?.application;
  const pipelineStages = portalData?.pipelineStages;
  const documents = portalData?.documents;
  const hasActiveApplication = portalData?.hasData;

  const progressPercentage = pipelineStages ? (pipelineStages.filter((s) => s.status !== 'pending').length / pipelineStages.length) * 100 : 0;

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    await sendMessage(chatInput);
    setChatInput('');
  };

  const quickActions = [
    { label: 'Dashboard', link: '#', icon: Home, color: 'bg-blue-400/20' },
    { label: 'Documents', link: '#', icon: FileText, color: 'bg-green-400/20' },
    { label: 'Schedule', link: '#', icon: Calendar, color: 'bg-purple-400/20' },
    { label: 'Contact', link: '#', icon: Phone, color: 'bg-red-400/20' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lending', label: 'Lending Products', icon: CreditCard },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'real-estate', label: 'Real Estate', icon: Building2 },
    { id: 'tools', label: 'Tools & Resources', icon: Wrench },
    { id: 'account', label: 'Account', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
      <GlobalHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={cn(
          'w-64 bg-gradient-to-br from-slate-800 to-slate-900 border-r border-yellow-500/30 overflow-y-auto',
          'hidden lg:flex flex-col'
        )}>
          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-4">Menu</h2>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-sm',
                        activeTab === item.id
                          ? 'bg-yellow-500/30 text-yellow-100 border border-yellow-500/50'
                          : 'text-slate-300 hover:text-yellow-100 hover:bg-slate-700/50'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <Separator className="bg-yellow-500/20" />

            <div>
              <Button variant="outline" className="w-full border-yellow-500/30 text-yellow-100 bg-slate-700/50 hover:bg-slate-600 justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Help & Support
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-6xl mx-auto p-6 pb-8">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {portalLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-yellow-400">Loading your application...</p>
                  </div>
                ) : hasActiveApplication ? (
                  <>
                    {/* Welcome Header */}
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                          <h1 className="text-4xl font-bold text-white">
                            Welcome back, <span className="text-yellow-400">{client?.name}</span>
                          </h1>
                          <p className="text-lg text-slate-300">Your active application and resources</p>
                        </div>
                        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold h-11 px-6 whitespace-nowrap">
                          <Phone className="mr-2 h-5 w-5" />
                          Contact Agent
                        </Button>
                      </div>
                      <Separator className="bg-yellow-500/30" />
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl hover:border-yellow-400/70 transition-all shadow-lg shadow-slate-950/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-yellow-100 text-xs uppercase tracking-wide font-bold">Loan Amount</p>
                              <p className="text-3xl font-bold text-yellow-200 mt-2">{application?.loanAmount || '$0'}</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                              <DollarSign className="h-6 w-6 text-yellow-300" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl hover:border-yellow-400/70 transition-all shadow-lg shadow-slate-950/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-yellow-100 text-xs uppercase tracking-wide font-bold">Loan Type</p>
                              <p className="text-lg font-bold text-yellow-200 mt-2">{application?.loanType || 'N/A'}</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                              <TrendingUp className="h-6 w-6 text-yellow-300" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl hover:border-yellow-400/70 transition-all shadow-lg shadow-slate-950/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-yellow-100 text-xs uppercase tracking-wide font-bold">Applied</p>
                              <p className="text-lg font-bold text-yellow-200 mt-2">{application?.applicationDate || 'N/A'}</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-yellow-300" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl hover:border-yellow-400/70 transition-all shadow-lg shadow-slate-950/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-yellow-100 text-xs uppercase tracking-wide font-bold">Est. Funding</p>
                              <p className="text-2xl font-bold text-yellow-200 mt-2">{application?.estimatedFunding || 'TBD'}</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                              <Zap className="h-6 w-6 text-yellow-300" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pipeline & Quick Actions */}
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl h-full shadow-lg shadow-slate-950/50">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-yellow-100 text-2xl flex items-center gap-2">
                                  <Zap className="h-6 w-6 text-yellow-300" />
                                  Pipeline Status
                                </CardTitle>
                                <CardDescription className="text-yellow-100/70 mt-2">
                                  Current Stage: <span className="font-bold text-yellow-200 text-base">{application?.currentStage || 'Not Started'}</span>
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-slate-300 text-sm font-medium">Overall Progress</span>
                                <Badge className="bg-yellow-500 text-black font-bold text-xs">{Math.round(progressPercentage)}%</Badge>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>

                            <div className="space-y-3">
                              {pipelineStages?.map((stage, index) => (
                                <div
                                  key={index}
                                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                                    stage.status === 'current'
                                      ? 'bg-yellow-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                                      : stage.status === 'completed'
                                      ? 'bg-emerald-500/15 border-emerald-500/30'
                                      : 'bg-slate-700/50 border-slate-600/50'
                                  }`}
                                >
                                  <div className="flex-shrink-0 mt-1">
                                    {stage.status === 'completed' ? (
                                      <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <CheckCircle className="h-5 w-5 text-black" />
                                      </div>
                                    ) : stage.status === 'current' ? (
                                      <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse shadow-lg shadow-yellow-500/30">
                                        <Clock className="h-5 w-5 text-black" />
                                      </div>
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-slate-600/50 flex items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-slate-500" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-semibold text-slate-100">{stage.name}</h4>
                                      {stage.date && (
                                        <span className="text-xs text-slate-400 font-medium">{stage.date}</span>
                                      )}
                                    </div>
                                    {stage.status === 'current' && (
                                      <Badge className="mt-2 bg-yellow-500 text-black font-semibold">Action Required</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
                          <CardHeader>
                            <CardTitle className="text-yellow-100 text-lg">Status</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <p className="text-yellow-100/70 text-sm mb-2 uppercase font-bold">Priority</p>
                              <Badge className="bg-yellow-500/30 text-yellow-100 border border-yellow-500/50 font-semibold">
                                {application?.priority || 'Standard'}
                              </Badge>
                            </div>
                            <Separator className="bg-yellow-500/20" />
                            <div>
                              <p className="text-yellow-100/70 text-sm mb-2 uppercase font-bold">App Status</p>
                              <p className="text-yellow-100 font-semibold">{application?.status || 'Pending'}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
                          <CardHeader>
                            <CardTitle className="text-yellow-100 text-lg">Actions</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full border-yellow-500/40 text-yellow-100 bg-yellow-500/15 hover:bg-yellow-500/25 justify-start font-semibold">
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                            </Button>
                            <Button variant="outline" className="w-full border-yellow-500/40 text-yellow-100 bg-yellow-500/15 hover:bg-yellow-500/25 justify-start font-semibold">
                              <FileText className="mr-2 h-4 w-4" />
                              View App
                            </Button>
                            <Button variant="outline" className="w-full border-yellow-500/40 text-yellow-100 bg-yellow-500/15 hover:bg-yellow-500/25 justify-start font-semibold">
                              <Upload className="mr-2 h-4 w-4" />
                              Docs
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
                        <CardHeader>
                          <CardTitle className="text-slate-100 flex items-center gap-2 text-xl">
                            <AlertCircle className="h-6 w-6 text-yellow-400" />
                            Docs Needed
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Upload to proceed to next stage
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {documents?.needed && documents.needed.length > 0 ? (
                              <>
                                {documents.needed.map((doc, index) => (
                                  <div key={index} className="flex items-center justify-between p-4 bg-yellow-500/15 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50 transition-all">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-lg bg-yellow-500/25 flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-5 w-5 text-yellow-300" />
                                      </div>
                                      <span className="text-sm text-slate-100 font-medium">{doc}</span>
                                    </div>
                                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                                      <Upload className="h-3 w-3 mr-1" />
                                      Upload
                                    </Button>
                                  </div>
                                ))}
                                <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-11">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload All
                                </Button>
                              </>
                            ) : (
                              <p className="text-slate-400 text-center py-8">All documents submitted ✓</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl shadow-lg shadow-slate-950/50">
                        <CardHeader>
                          <CardTitle className="text-slate-100 flex items-center gap-2 text-xl">
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                            Docs Uploaded
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Successfully submitted
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {documents?.uploaded && documents.uploaded.length > 0 ? (
                              documents.uploaded.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-emerald-500/15 rounded-lg border border-emerald-500/30 hover:border-emerald-500/50 transition-all">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-500/25 flex items-center justify-center flex-shrink-0">
                                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-slate-100 font-medium">{doc}</span>
                                  </div>
                                  <Button size="sm" variant="ghost" className="text-emerald-400 hover:bg-emerald-500/15">
                                    <Download className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <p className="text-slate-400 text-center py-8">No documents yet</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* CTA */}
                    {documents?.needed && documents.needed.length > 0 && (
                      <Card className="bg-gradient-to-r from-yellow-500/20 to-slate-800/80 border-yellow-500/50 backdrop-blur-xl overflow-hidden relative shadow-lg shadow-slate-950/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent pointer-events-none"></div>
                        <CardContent className="p-8 relative">
                          <div className="flex items-start gap-6">
                            <div className="flex-shrink-0">
                              <div className="h-14 w-14 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/40">
                                <AlertCircle className="h-7 w-7 text-black" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-100 mb-2">
                                Action Required
                              </h3>
                              <p className="text-slate-300 mb-6 leading-relaxed">
                                Upload remaining documents to move to the next stage. Our team will review within 24 hours.
                              </p>
                              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-11">
                                Upload Documents
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl p-8 text-center max-w-2xl mx-auto shadow-lg shadow-slate-950/50">
                    <CardTitle className="text-slate-100 mb-4 text-2xl">No Active Application</CardTitle>
                    <p className="text-slate-300 mb-8">Start your journey to funding by completing a pre-qualification form.</p>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Start New Application
                    </Button>
                  </Card>
                )}

                {/* Quick Links */}
                {activeTab === 'dashboard' && !portalLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                    {quickActions.map((action, idx) => {
                      const Icon = action.icon;
                      return (
                        <a
                          key={idx}
                          href={action.link}
                          className="block"
                        >
                          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-slate-800/80 border border-yellow-500/40 hover:border-yellow-500/60">
                            <CardContent className="pt-6">
                              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-yellow-500/20')}>
                                <Icon className="h-6 w-6 text-yellow-300" />
                              </div>
                              <h4 className="text-slate-100 font-semibold text-sm">{action.label}</h4>
                            </CardContent>
                          </Card>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Other Tabs */}
            {activeTab !== 'dashboard' && (
              <Card className="bg-slate-800/80 border-yellow-500/50 backdrop-blur-xl p-8 text-center shadow-lg shadow-slate-950/50">
                <CardTitle className="text-slate-100 mb-4 text-2xl capitalize">{activeTab}</CardTitle>
                <p className="text-slate-300">Content for {activeTab} coming soon.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Pipeline Progress Panel */}
        <div className="hidden lg:flex w-96 border-l border-yellow-500/30 flex-col bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-lg shadow-slate-950/50">
          <ScrollArea className="flex-1 p-6">
            {pipelineLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-3" />
                <p className="text-yellow-200/70 text-sm">Loading pipeline...</p>
              </div>
            ) : pipelineData?.hasApplication ? (
              <PipelineProgress
                stages={pipelineData.pipeline?.stages || []}
                currentStage={pipelineData.pipeline?.currentStage}
                progressPercentage={pipelineData.pipeline?.progressPercentage || 0}
              />
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-5xl">📋</div>
                <div>
                  <p className="text-yellow-100 font-semibold text-sm mb-2">No Active Application</p>
                  <p className="text-yellow-100/60 text-xs">Start an application to track your pipeline progress</p>
                </div>
                <Button className="bg-yellow-500 text-black hover:bg-yellow-600 h-8 text-xs w-full">
                  Start Application
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
}
