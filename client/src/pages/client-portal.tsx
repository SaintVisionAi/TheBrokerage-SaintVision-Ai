import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  Upload,
  Download,
  ExternalLink,
  Phone,
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

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

export default function ClientPortal() {
  const { data: portalData, isLoading } = useQuery<ClientPortalData>({
    queryKey: ["/api/client-portal"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-400 text-lg font-semibold">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (!portalData?.hasData) {
    return (
      <>
        <GlobalHeader />
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center p-6">
          <Card className="bg-black/80 border-yellow-400/30 backdrop-blur-xl p-8 text-center max-w-md">
            <CardTitle className="text-white mb-4 text-xl">No Active Application</CardTitle>
            <p className="text-white/70 mb-6">{portalData?.message || "No application data available"}</p>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              <ArrowRight className="mr-2 h-4 w-4" />
              Start New Application
            </Button>
          </Card>
        </div>
        <GlobalFooter />
      </>
    );
  }

  const { client, application, pipelineStages, documents } = portalData;
  const currentStageIndex = pipelineStages?.findIndex(s => s.status === 'current') || 0;
  const progressPercentage = pipelineStages ? ((currentStageIndex + 1) / pipelineStages.length) * 100 : 0;

  return (
    <>
      <GlobalHeader />
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/5 rounded-full filter blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          {/* Welcome Header */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold text-white">
                  Welcome back, <span className="text-yellow-400">{client?.name}</span>
                </h1>
                <p className="text-lg text-white/60">Your Saint Vision Group Client Portal</p>
              </div>
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold h-12 px-6 whitespace-nowrap">
                <Phone className="mr-2 h-5 w-5" />
                Contact Your Agent
              </Button>
            </div>
            <Separator className="bg-yellow-400/20" />
          </div>

          {/* Key Metrics Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-yellow-400/30 backdrop-blur-xl hover:border-yellow-400/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Loan Amount</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">{application?.loanAmount}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 border-emerald-400/30 backdrop-blur-xl hover:border-emerald-400/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Loan Type</p>
                    <p className="text-lg font-bold text-emerald-400 mt-2">{application?.loanType}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 border-blue-400/30 backdrop-blur-xl hover:border-blue-400/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Applied</p>
                    <p className="text-lg font-bold text-blue-400 mt-2">{application?.applicationDate}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-400/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400/10 to-green-600/10 border-green-400/30 backdrop-blur-xl hover:border-green-400/50 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Est. Funding</p>
                    <p className="text-2xl font-bold text-green-400 mt-2">{application?.estimatedFunding}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-400/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Pipeline Progress - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-yellow-400/10 via-purple-400/5 to-yellow-600/10 border-yellow-400/30 backdrop-blur-xl h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-400" />
                        Lending Pipeline Status
                      </CardTitle>
                      <CardDescription className="text-white/60 mt-2">
                        Current Stage: <span className="font-bold text-yellow-400 text-base">{application?.currentStage}</span>
                      </CardDescription>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/80 text-sm font-medium">Overall Progress</span>
                      <Badge className="bg-yellow-400 text-black font-bold text-xs">{Math.round(progressPercentage)}%</Badge>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  {/* Pipeline Stages */}
                  <div className="space-y-3">
                    {pipelineStages?.map((stage, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                          stage.status === 'current'
                            ? 'bg-yellow-400/15 border-yellow-400/50 shadow-lg shadow-yellow-400/10'
                            : stage.status === 'completed'
                            ? 'bg-emerald-400/10 border-emerald-400/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {stage.status === 'completed' ? (
                            <div className="h-8 w-8 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-400/30">
                              <CheckCircle className="h-5 w-5 text-black" />
                            </div>
                          ) : stage.status === 'current' ? (
                            <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse shadow-lg shadow-yellow-400/30">
                              <Clock className="h-5 w-5 text-black" />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                              <div className="h-3 w-3 rounded-full bg-white/40" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-white">{stage.name}</h4>
                            {stage.date && (
                              <span className="text-xs text-white/60 font-medium">{stage.date}</span>
                            )}
                          </div>
                          {stage.status === 'current' && (
                            <Badge className="mt-2 bg-yellow-400 text-black font-semibold">Action Required</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 border-emerald-400/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Application Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-white/60 text-sm mb-2">Priority Level</p>
                    <Badge className="bg-emerald-400/30 text-emerald-300 border border-emerald-400/50">
                      {application?.priority || 'Standard'}
                    </Badge>
                  </div>
                  <Separator className="bg-white/10" />
                  <div>
                    <p className="text-white/60 text-sm mb-2">Status</p>
                    <p className="text-white font-semibold">{application?.status}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-400/10 to-blue-600/10 border-blue-400/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full border-blue-400/30 text-blue-400 hover:bg-blue-400/10 justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" className="w-full border-blue-400/30 text-blue-400 hover:bg-blue-400/10 justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View Full App
                  </Button>
                  <Button variant="outline" className="w-full border-blue-400/30 text-blue-400 hover:bg-blue-400/10 justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Credit Auth
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Documents Section - Full Width */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Documents Needed */}
            <Card className="bg-gradient-to-br from-amber-400/10 to-amber-600/10 border-amber-400/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-xl">
                  <AlertCircle className="h-6 w-6 text-amber-400" />
                  Documents Needed
                </CardTitle>
                <CardDescription className="text-white/70">
                  Upload these to proceed to next stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents?.needed && documents.needed.length > 0 ? (
                    <>
                      {documents.needed.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-amber-400/10 rounded-lg border border-amber-400/20 hover:border-amber-400/40 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-amber-400" />
                            </div>
                            <span className="text-sm text-white font-medium">{doc}</span>
                          </div>
                          <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold">
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                        </div>
                      ))}
                      <Button className="w-full mt-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold h-11">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload All Documents
                      </Button>
                    </>
                  ) : (
                    <p className="text-white/50 text-center py-8">All required documents submitted</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents Uploaded */}
            <Card className="bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 border-emerald-400/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-xl">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                  Documents Uploaded
                </CardTitle>
                <CardDescription className="text-white/70">
                  Successfully submitted and received
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents?.uploaded && documents.uploaded.length > 0 ? (
                    documents.uploaded.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-emerald-400/10 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          </div>
                          <span className="text-sm text-white font-medium">{doc}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:bg-emerald-400/10">
                          <Download className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50 text-center py-8">No documents uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          {documents?.needed && documents.needed.length > 0 && (
            <Card className="bg-gradient-to-r from-yellow-400/20 via-yellow-400/10 to-emerald-400/20 border-yellow-400/50 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent pointer-events-none"></div>
              <CardContent className="p-8 relative">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                      <AlertCircle className="h-7 w-7 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Action Required: {application?.currentStage}
                    </h3>
                    <p className="text-white/70 mb-6 leading-relaxed">
                      To move to the next stage, please upload the required documents listed above. Once received,
                      our team will review within 24 hours and advance your application to the next phase of processing.
                    </p>
                    <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold h-11">
                      Complete This Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
