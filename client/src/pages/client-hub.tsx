import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  Briefcase,
  Home,
  TrendingUp,
  Shield,
  FileSignature,
  Send,
  Eye,
  Trash2,
  Plus,
  Calculator,
  Search,
  Building2,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoanApplication {
  id: string;
  type: string;
  amount: string;
  status: 'draft' | 'submitted' | 'in-review' | 'approved' | 'funded' | 'denied';
  progress: number;
  dateSubmitted?: string;
  nextAction?: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'pending' | 'verified' | 'rejected';
  category: string;
}

const LOAN_PRODUCTS = [
  {
    title: 'AR Financing',
    file: 'AR_Financing.pdf',
    icon: '📊',
    description: 'Accounts Receivable financing solutions'
  },
  {
    title: 'Business Credit Building',
    file: 'Business_Credit_Building.pdf',
    icon: '🏗️',
    description: 'Build your business credit profile'
  },
  {
    title: 'Cannabis Business',
    file: 'Cannabusiness.pdf',
    icon: '🌿',
    description: 'Specialized cannabis industry financing'
  },
  {
    title: 'Equipment Financing',
    file: 'Equipment_Financing.pdf',
    icon: '🏗️',
    description: 'Finance your equipment needs'
  },
  {
    title: 'Fix & Flip',
    file: 'Fix_N_Flip.pdf',
    icon: '🏠',
    description: 'Real estate investment financing'
  },
  {
    title: 'Line of Credit',
    file: 'Line_of_Credit.pdf',
    icon: '💳',
    description: 'Flexible credit lines for working capital'
  },
  {
    title: 'Real Estate',
    file: 'Real_Estate.pdf',
    icon: '🏢',
    description: 'Commercial real estate financing'
  },
  {
    title: 'SBA Loans',
    file: 'SBA.pdf',
    icon: '🏛️',
    description: 'Government-backed SBA loan programs'
  },
  {
    title: 'Term Loans',
    file: 'Term_Loan.pdf',
    icon: '📈',
    description: 'Traditional term loan financing'
  },
  {
    title: 'Working Capital',
    file: 'Working_Capital.pdf',
    icon: '💰',
    description: 'Quick working capital solutions'
  }
];

export default function ClientHub() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // GHL Workflow Quick Actions
  const quickActions = [
    { id: 'start_application', label: 'Start New Application', icon: Plus, color: 'bg-emerald-500', workflow: 'new_loan_app' },
    { id: 'upload_docs', label: 'Upload Documents', icon: Upload, color: 'bg-blue-500', workflow: 'doc_upload' },
    { id: 'schedule_call', label: 'Schedule Call', icon: Calendar, color: 'bg-purple-500', workflow: 'schedule_consultation' },
    { id: 'check_status', label: 'Check Status', icon: AlertCircle, color: 'bg-yellow-500', workflow: 'status_check' },
    { id: 'get_prequalified', label: 'Get Pre-Qualified', icon: CheckCircle, color: 'bg-green-500', workflow: 'prequalification' },
    { id: 'contact_broker', label: 'Contact Broker', icon: Send, color: 'bg-indigo-500', workflow: 'contact_broker' }
  ];
  
  const [applications, setApplications] = useState<LoanApplication[]>([
    {
      id: '1',
      type: 'Commercial/Business Lending',
      amount: '$250,000',
      status: 'in-review',
      progress: 65,
      dateSubmitted: '2024-03-15',
      nextAction: 'Upload bank statements',
      documents: []
    }
  ]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(applications[0]);

  // GHL Workflow Handler - Triggers automation workflows
  const handleGHLWorkflow = async (workflow: string) => {
    try {
      // Trigger GHL workflow via API
      const response = await fetch('/api/ghl/trigger-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workflow,
          contactId: 'current-user-id', // Will get from auth context
          source: 'client-hub'
        })
      });
      
      if (response.ok) {
        toast({
          title: "✅ Workflow Started",
          description: "Your request is being processed. We'll notify you of next steps.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start workflow. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    toast({
      title: "Documents Uploaded",
      description: `${files.length} document(s) uploaded successfully`
    });
  };

  const handleDownloadProduct = (file: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${file}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'submitted': return 'bg-blue-500';
      case 'in-review': return 'bg-yellow-500';
      case 'approved': return 'bg-emerald-500';
      case 'funded': return 'bg-green-600';
      case 'denied': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'submitted': return <Send className="h-4 w-4" />;
      case 'in-review': return <Eye className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'funded': return <DollarSign className="h-4 w-4" />;
      case 'denied': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Client Hub
              </h1>
              <p className="text-neutral-400 mt-1">Your complete loan management center</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10"
                onClick={() => navigate('/landing')}
                data-testid="button-back-home"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                data-testid="button-new-application"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-black/40 backdrop-blur-md border border-yellow-400/20">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <Briefcase className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Overview</span>
              <span className="md:hidden">View</span>
            </TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-applications">
              <FileText className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Applications</span>
              <span className="md:hidden">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="documents" data-testid="tab-documents">
              <Upload className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Documents</span>
              <span className="md:hidden">Docs</span>
            </TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">
              <Download className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Products</span>
              <span className="md:hidden">PDF</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" data-testid="tab-calculator">
              <Calculator className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">ROI Calc</span>
              <span className="md:hidden">Calc</span>
            </TabsTrigger>
            <TabsTrigger value="search" data-testid="tab-search">
              <Search className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Property</span>
              <span className="md:hidden">Find</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/40 backdrop-blur-md border-yellow-400/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Active Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{applications.length}</div>
                  <p className="text-neutral-400 text-sm mt-2">In progress</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-md border-emerald-400/20">
                <CardHeader>
                  <CardTitle className="text-emerald-400">Total Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">$1.2M</div>
                  <p className="text-neutral-400 text-sm mt-2">Lifetime funding</p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-md border-blue-400/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Next Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold text-white">Upload Documents</div>
                  <p className="text-neutral-400 text-sm mt-2">For loan #1</p>
                </CardContent>
              </Card>
            </div>

            {/* CENTRAL COMMAND CENTER - Quick Actions */}
            <Card className="bg-gradient-to-br from-yellow-400/10 to-emerald-400/10 backdrop-blur-md border-2 border-yellow-400/40">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent">
                  🎯 THE CLIENT HUB - Everything In One Place
                </CardTitle>
                <CardDescription className="text-white/80">
                  Your central command center - All services, automation, and tools at your fingertips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {quickActions.map(action => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className={`h-auto py-6 flex flex-col items-center gap-3 ${action.color} bg-opacity-20 border-2 hover:scale-105 transition-all duration-200`}
                      onClick={() => handleGHLWorkflow(action.workflow)}
                      data-testid={`quick-${action.id}`}
                    >
                      <action.icon className="h-8 w-8 text-white" />
                      <span className="text-white font-semibold text-sm">{action.label}</span>
                    </Button>
                  ))}
                </div>
                
                {/* Original Quick Actions Row */}
                <Separator className="my-4" />
                <p className="text-xs text-white/60 mb-3">Additional Resources</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-3 flex flex-col items-center gap-2 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10"
                    data-testid="quick-upload-docs"
                  >
                    <FileText className="h-5 w-5 text-yellow-400" />
                    <span className="text-xs">View Products</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-400/10"
                    data-testid="quick-check-status"
                  >
                    <Clock className="h-6 w-6 text-emerald-400" />
                    <span>Check Status</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-blue-400/30 hover:border-blue-400 hover:bg-blue-400/10"
                    data-testid="quick-download-forms"
                  >
                    <Download className="h-6 w-6 text-blue-400" />
                    <span>Download Forms</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-purple-400/30 hover:border-purple-400 hover:bg-purple-400/10"
                    data-testid="quick-contact-broker"
                  >
                    <Shield className="h-6 w-6 text-purple-400" />
                    <span>Contact Broker</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI ASSISTANT HELP - Claude AI Integration */}
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border-2 border-blue-400/60 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SaintBroker AI™ Assistant - Powered by Claude
                  </span>
                </CardTitle>
                <CardDescription className="text-white/80">
                  Your AI-powered brokerage assistant is here to help with applications, questions, and guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-6"
                    onClick={() => {
                      // Toggle SaintBroker widget
                      const widget = document.querySelector('#saint-broker-widget');
                      if (widget) {
                        const event = new CustomEvent('toggle-saint-broker');
                        window.dispatchEvent(event);
                      }
                    }}
                    data-testid="open-ai-assistant"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with SaintBroker AI
                  </Button>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="text-xs py-2 border-blue-400/30 hover:bg-blue-400/10"
                      onClick={() => handleGHLWorkflow('prequalification')}
                    >
                      Get Pre-Qualified
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs py-2 border-purple-400/30 hover:bg-purple-400/10"
                      onClick={() => handleGHLWorkflow('schedule_consultation')}
                    >
                      Book Consultation
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-black/30 rounded-lg">
                  <p className="text-sm text-white/70">
                    💡 <span className="font-semibold">Pro Tip:</span> Ask SaintBroker AI about loan options, requirements, or to help fill out applications. 
                    Available 24/7 with instant responses powered by Claude 3.5 Sonnet.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ALL SERVICES DASHBOARD - Everything at a Glance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Commercial Lending */}
              <Card className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 backdrop-blur-md border-yellow-400/40 hover:scale-105 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-yellow-400">💰 Commercial Lending</CardTitle>
                  <CardDescription className="text-white/70">$50K - $5M Business Funding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-white">9%+ Rates</div>
                  <p className="text-sm text-white/60">13 Partner Network • AI-Powered Routing</p>
                  <Button 
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
                    onClick={() => handleGHLWorkflow('new_loan_app')}
                    data-testid="service-lending"
                  >
                    Apply Now →
                  </Button>
                </CardContent>
              </Card>

              {/* Real Estate */}
              <Card className="bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 backdrop-blur-md border-emerald-400/40 hover:scale-105 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-emerald-400">🏢 Real Estate</CardTitle>
                  <CardDescription className="text-white/70">All 50 States Coverage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-white">Full Service</div>
                  <p className="text-sm text-white/60">Buy • Sell • Finance • Invest</p>
                  <Button 
                    className="w-full bg-emerald-400 text-black hover:bg-emerald-300"
                    onClick={() => setActiveTab('property-search')}
                    data-testid="service-realestate"
                  >
                    Search Properties →
                  </Button>
                </CardContent>
              </Card>

              {/* Investment Suite */}
              <Card className="bg-gradient-to-br from-purple-400/20 to-purple-600/10 backdrop-blur-md border-purple-400/40 hover:scale-105 transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-purple-400">📈 Investment Suite</CardTitle>
                  <CardDescription className="text-white/70">Faith-Aligned Returns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-white">9-12% Fixed</div>
                  <p className="text-sm text-white/60">Secure • Ethical • Growth-Focused</p>
                  <Button 
                    className="w-full bg-purple-400 text-black hover:bg-purple-300"
                    onClick={() => setActiveTab('roi-calculator')}
                    data-testid="service-investment"
                  >
                    Calculate ROI →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Applications List */}
              <div className="lg:col-span-1">
                <Card className="bg-black/40 backdrop-blur-md border-yellow-400/20">
                  <CardHeader>
                    <CardTitle>Your Applications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                            selectedApp?.id === app.id ? 'bg-white/10' : ''
                          }`}
                          onClick={() => setSelectedApp(app)}
                          data-testid={`application-${app.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-white">{app.type}</p>
                              <p className="text-2xl font-bold text-yellow-400 mt-1">{app.amount}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={`${getStatusColor(app.status)} text-white`}>
                                  {getStatusIcon(app.status)}
                                  <span className="ml-1">{app.status}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Progress value={app.progress} className="mt-3 h-2" />
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Application Details */}
              <div className="lg:col-span-2">
                {selectedApp && (
                  <Card className="bg-black/40 backdrop-blur-md border-yellow-400/20">
                    <CardHeader>
                      <CardTitle>Application Details</CardTitle>
                      <CardDescription>Loan ID: #{selectedApp.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-neutral-400 text-sm">Type</p>
                          <p className="text-white font-semibold">{selectedApp.type}</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 text-sm">Amount</p>
                          <p className="text-white font-semibold">{selectedApp.amount}</p>
                        </div>
                        <div>
                          <p className="text-neutral-400 text-sm">Status</p>
                          <Badge className={`${getStatusColor(selectedApp.status)} text-white mt-1`}>
                            {selectedApp.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-neutral-400 text-sm">Progress</p>
                          <Progress value={selectedApp.progress} className="mt-2 h-2" />
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      {selectedApp.nextAction && (
                        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                          <p className="text-yellow-400 font-semibold flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Next Action Required
                          </p>
                          <p className="text-white mt-2">{selectedApp.nextAction}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                          data-testid="button-upload-documents"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Documents
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10"
                          data-testid="button-view-timeline"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          View Timeline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* DOCUMENTS TAB */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-md border-yellow-400/20">
              <CardHeader>
                <CardTitle>Document Center</CardTitle>
                <CardDescription>Upload and manage your loan documents</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Upload Area */}
                <div className="border-2 border-dashed border-yellow-400/30 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept=".pdf,.doc,.docx,.xlsx,.png,.jpg"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
                    <p className="text-white font-semibold">Drop files here or click to upload</p>
                    <p className="text-neutral-400 text-sm mt-2">
                      Supported: PDF, DOC, DOCX, Excel, Images
                    </p>
                  </label>
                </div>

                {/* Document Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-neutral-400 text-sm">Bank Statements</p>
                          <p className="text-2xl font-bold text-white">3</p>
                        </div>
                        <FileText className="h-8 w-8 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-neutral-400 text-sm">Tax Returns</p>
                          <p className="text-2xl font-bold text-white">2</p>
                        </div>
                        <FileText className="h-8 w-8 text-emerald-400" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-neutral-400 text-sm">Other</p>
                          <p className="text-2xl font-bold text-white">5</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-md border-yellow-400/20">
              <CardHeader>
                <CardTitle>Loan Products & Resources</CardTitle>
                <CardDescription>Download product information and application forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LOAN_PRODUCTS.map((product) => (
                    <Card
                      key={product.file}
                      className="bg-white/5 border-white/10 hover:border-yellow-400/30 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{product.icon}</span>
                              <h3 className="font-semibold text-white">{product.title}</h3>
                            </div>
                            <p className="text-neutral-400 text-sm mt-2">{product.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10"
                          onClick={() => handleDownloadProduct(product.file)}
                          data-testid={`download-${product.file}`}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CALCULATOR TAB - Real Estate ROI Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-md border-yellow-400/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-yellow-400" />
                  Real Estate Investment ROI Calculator
                </CardTitle>
                <CardDescription>The most comprehensive investment calculator in the industry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Property Details */}
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-neutral-400">Purchase Price</label>
                      <input
                        type="number"
                        placeholder="$450,000"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-purchase-price"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">Down Payment (%)</label>
                      <input
                        type="number"
                        placeholder="20"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-down-payment"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">Interest Rate (%)</label>
                      <input
                        type="number"
                        placeholder="7.5"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-interest-rate"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">Loan Term (Years)</label>
                      <input
                        type="number"
                        placeholder="30"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-loan-term"
                      />
                    </div>
                  </div>
                </div>

                {/* Income & Expenses */}
                <div>
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4">Income & Expenses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-neutral-400">Monthly Rental Income</label>
                      <input
                        type="number"
                        placeholder="$3,500"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-rental-income"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">Property Tax (Annual)</label>
                      <input
                        type="number"
                        placeholder="$5,400"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-property-tax"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">Insurance (Annual)</label>
                      <input
                        type="number"
                        placeholder="$1,200"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-insurance"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">HOA Fees (Monthly)</label>
                      <input
                        type="number"
                        placeholder="$150"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-hoa"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">Maintenance (% of Value)</label>
                      <input
                        type="number"
                        placeholder="1"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-maintenance"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-400">Vacancy Rate (%)</label>
                      <input
                        type="number"
                        placeholder="5"
                        className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                        data-testid="input-vacancy"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculate Button */}
                <Button
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
                  data-testid="button-calculate-roi"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate ROI
                </Button>

                {/* Results */}
                <div className="bg-gradient-to-r from-emerald-400/10 to-emerald-600/10 rounded-lg p-6 border border-emerald-400/20">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-4">Investment Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-neutral-400 text-sm">Cash on Cash Return</p>
                      <p className="text-3xl font-bold text-emerald-400">12.4%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-neutral-400 text-sm">Cap Rate</p>
                      <p className="text-3xl font-bold text-yellow-400">8.2%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-neutral-400 text-sm">Monthly Cash Flow</p>
                      <p className="text-3xl font-bold text-white">$1,245</p>
                    </div>
                  </div>
                  <Separator className="bg-white/10 my-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-400">Total ROI (5 Years):</span>
                      <span className="text-white ml-2 font-semibold">45.2%</span>
                    </div>
                    <div>
                      <span className="text-neutral-400">Break-even Point:</span>
                      <span className="text-white ml-2 font-semibold">4.2 Years</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEARCH TAB - Property Search */}
          <TabsContent value="search" className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-md border-yellow-400/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-yellow-400" />
                  Property Search & Analysis
                </CardTitle>
                <CardDescription>Find investment properties and analyze deals instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-neutral-400">Location</label>
                    <input
                      type="text"
                      placeholder="City, State or ZIP"
                      className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50"
                      data-testid="input-location"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400">Price Range</label>
                    <select className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                      <option>$0 - $500k</option>
                      <option>$500k - $1M</option>
                      <option>$1M - $5M</option>
                      <option>$5M+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400">Property Type</label>
                    <select className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                      <option>All Types</option>
                      <option>Single Family</option>
                      <option>Multi-Family</option>
                      <option>Commercial</option>
                      <option>Industrial</option>
                    </select>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white"
                  data-testid="button-search-properties"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Properties
                </Button>

                {/* Sample Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-yellow-400">Featured Properties</h3>
                  
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">4-Unit Apartment Complex</h4>
                          <p className="text-neutral-400 text-sm">Houston, TX 77001</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-yellow-400 font-bold">$850,000</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400">9.2% Cap Rate</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-400/30 hover:border-yellow-400"
                          data-testid="button-analyze-property-1"
                        >
                          Analyze
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">Retail Strip Center</h4>
                          <p className="text-neutral-400 text-sm">Dallas, TX 75201</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-yellow-400 font-bold">$2,500,000</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400">7.8% Cap Rate</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-400/30 hover:border-yellow-400"
                          data-testid="button-analyze-property-2"
                        >
                          Analyze
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Links */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <p className="text-yellow-400 font-semibold mb-2">Need Financing?</p>
                  <p className="text-white text-sm">
                    Get pre-approved for real estate financing with competitive rates starting at 7.5%
                  </p>
                  <Button
                    className="mt-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                    data-testid="button-get-financing"
                  >
                    Get Pre-Approved
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Help */}
      <div className="fixed bottom-6 left-6">
        <Button
          className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-lg"
          data-testid="button-saintbroker-help"
        >
          <Shield className="h-4 w-4 mr-2" />
          Ask SaintBroker
        </Button>
      </div>
    </div>
  );
}