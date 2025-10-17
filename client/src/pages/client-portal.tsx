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
  Phone
} from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your application...</div>
      </div>
    );
  }

  if (!portalData?.hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center p-6">
        <Card className="bg-black/60 border-blue-400/30 backdrop-blur-xl p-8 text-center">
          <CardTitle className="text-white mb-4">No Active Application</CardTitle>
          <p className="text-white/70">{portalData?.message || "No application data available"}</p>
        </Card>
      </div>
    );
  }

  const { client, application, pipelineStages, documents } = portalData;
  const currentStageIndex = pipelineStages?.findIndex(s => s.status === 'current') || 0;
  const progressPercentage = pipelineStages ? ((currentStageIndex + 1) / pipelineStages.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {client?.name}</h1>
            <p className="text-white/70">Your Saint Vision Group Client Portal</p>
          </div>
          <Button className="bg-green-400 hover:bg-green-500 text-black font-bold">
            <Phone className="mr-2 h-4 w-4" />
            Contact Your Agent
          </Button>
        </div>

        {/* Application Summary */}
        <Card className="bg-black/60 border-blue-400/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-400" />
              Application Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-white/60 text-sm">Loan Amount</p>
                <p className="text-2xl font-bold text-white">{application?.loanAmount}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Loan Type</p>
                <p className="text-xl font-semibold text-white">{application?.loanType}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Application Date</p>
                <p className="text-xl font-semibold text-white">{application?.applicationDate}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Est. Funding</p>
                <p className="text-xl font-semibold text-green-400">{application?.estimatedFunding}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Progress */}
        <Card className="bg-black/60 border-yellow-400/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Lending Pipeline Status</CardTitle>
            <CardDescription className="text-white/70">
              Current Stage: <span className="font-bold text-yellow-400">{application?.currentStage}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white/80 text-sm">Overall Progress</span>
                <span className="text-yellow-400 font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>

            {/* Pipeline Stages */}
            <div className="space-y-4">
              {pipelineStages?.map((stage, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    stage.status === 'current'
                      ? 'bg-yellow-400/10 border-yellow-400/50'
                      : stage.status === 'completed'
                      ? 'bg-green-400/10 border-green-400/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                  data-testid={`pipeline-stage-${index}`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {stage.status === 'completed' ? (
                      <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-black" />
                      </div>
                    ) : stage.status === 'current' ? (
                      <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse">
                        <Clock className="h-5 w-5 text-black" />
                      </div>
                    ) : stage.status === 'failed' ? (
                      <div className="h-8 w-8 rounded-full bg-red-400 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-white" />
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
                        <span className="text-xs text-white/60">{stage.date}</span>
                      )}
                    </div>


                    {stage.status === 'current' && (
                      <Badge className="mt-2 bg-yellow-400 text-black">Action Required</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Documents Needed */}
          <Card className="bg-black/60 border-red-400/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Documents Needed
              </CardTitle>
              <CardDescription className="text-white/70">
                Upload these to proceed to next stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents?.needed.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-red-400/20">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-white">{doc}</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-red-400/30 text-red-400 hover:bg-red-400/10">
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-red-400 hover:bg-red-500 text-black font-bold">
                <Upload className="mr-2 h-4 w-4" />
                Upload All Documents
              </Button>
            </CardContent>
          </Card>

          {/* Documents Uploaded */}
          <Card className="bg-black/60 border-green-400/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Documents Uploaded
              </CardTitle>
              <CardDescription className="text-white/70">
                Successfully submitted and received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents?.uploaded.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-green-400/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-white">{doc}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-400/10">
                      <Download className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
              {documents?.uploaded.length === 0 && (
                <p className="text-white/50 text-sm text-center py-6">No documents uploaded yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-black/60 border-blue-400/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="border-blue-400/30 text-white hover:bg-blue-400/10">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Discovery Call
              </Button>
              <Button variant="outline" className="border-blue-400/30 text-white hover:bg-blue-400/10">
                <ExternalLink className="mr-2 h-4 w-4" />
                Credit Authorization
              </Button>
              <Button variant="outline" className="border-blue-400/30 text-white hover:bg-blue-400/10">
                <FileText className="mr-2 h-4 w-4" />
                View Full Application
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-yellow-400/10 to-green-400/10 border-yellow-400/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-black" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Action Required: {application?.currentStage === 'Documents pending' ? 'Upload required documents' : 'Review your application status'}</h4>
                <p className="text-white/70 text-sm mb-4">
                  To move to the next stage, please upload the required documents listed above. Once received,
                  our team will review within 24 hours and advance your application to underwriting.
                </p>
                <Button className="bg-gradient-to-r from-yellow-400 to-green-400 hover:from-yellow-500 hover:to-green-500 text-black font-bold">
                  Complete This Step
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
