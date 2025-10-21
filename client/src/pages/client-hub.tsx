import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  FileText,
  FileSignature,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Send,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Eye,
  Plus,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/use-chat';
import { useGHLApplications, useGHLPortfolio } from '@/hooks/useGHLData';
import DocumentVisionPreview from '@/components/ai/document-vision-preview';

interface Document {
  id: string;
  name: string;
  status: 'pending' | 'signed' | 'rejected';
  type: 'application' | 'agreement' | 'disclosure';
  dueDate?: string;
  signedAt?: string;
  signedBy?: string;
}

export default function ClientHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'documents' | 'portfolio' | 'account'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFileForVision, setSelectedFileForVision] = useState<File | null>(null);
  const { messages, sendMessage, isLoading: chatLoading } = useChat('user-123', 'hub-chat');
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // GHL Data
  const { applications, isLoading: appsLoading } = useGHLApplications('user-123');
  const { portfolio, isLoading: portfolioLoading } = useGHLPortfolio('user-123');

  // Sample pending documents
  const [pendingDocs] = useState<Document[]>([
    {
      id: '1',
      name: 'Loan Agreement',
      status: 'pending',
      type: 'agreement',
      dueDate: '2025-02-15',
    },
    {
      id: '2',
      name: 'Personal Guarantee',
      status: 'pending',
      type: 'agreement',
      dueDate: '2025-02-15',
    },
    {
      id: '3',
      name: 'Disclosure Documents',
      status: 'pending',
      type: 'disclosure',
      dueDate: '2025-02-10',
    },
  ]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const message = chatInput;
    setChatInput('');
    await sendMessage(message);
  };

  const handleSignDocument = (docId: string) => {
    toast({
      title: 'Document Signature',
      description: 'Redirecting to signature portal...',
    });
  };

  const tabItems = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'applications' as const, label: 'Applications', badge: applications.length },
    { id: 'documents' as const, label: 'Documents', badge: pendingDocs.length },
    { id: 'portfolio' as const, label: 'Portfolio' },
    { id: 'account' as const, label: 'Account' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-xl font-bold text-gray-900">Your Lending Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Ryan Capatosto</span>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div
          className={cn(
            'w-64 border-r border-gray-200 bg-gray-50 flex flex-col transition-all duration-300',
            !sidebarOpen && 'hidden lg:flex'
          )}
        >
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* SaintBroker AI Mini */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-700 font-bold text-sm">SB</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">SaintBroker AI</span>
            </div>
            <p className="text-xs text-gray-500">
              Need help? Chat with me anytime. I can answer questions about your loan or help you complete forms.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-6xl mx-auto p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Active Applications</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {appsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : applications.length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Documents to Sign</div>
                      <div className="text-3xl font-bold text-red-600">{pendingDocs.length}</div>
                      <p className="text-xs text-gray-500 mt-2">Action required</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Portfolio Value</div>
                      <div className="text-3xl font-bold text-gray-900">
                        {portfolioLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : '$2.5M'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Documents Section */}
                {pendingDocs.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="border-b border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <CardTitle className="text-red-900">Documents Awaiting Your Signature</CardTitle>
                      </div>
                      <CardDescription>Complete these to move forward with your loan</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {pendingDocs.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-100">
                            <div className="flex items-center gap-3">
                              <FileSignature className="w-5 h-5 text-red-600" />
                              <div>
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                {doc.dueDate && <p className="text-xs text-gray-500">Due: {doc.dueDate}</p>}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleSignDocument(doc.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Sign Now
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Applications Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Applications</CardTitle>
                    <CardDescription>Track the status of your loan applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No active applications yet</p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Start New Application
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {applications.map((app) => (
                          <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{app.name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Progress value={app.progress || 0} className="h-2 flex-1 max-w-xs" />
                                <span className="text-xs font-medium text-gray-600">{app.progress}%</span>
                              </div>
                            </div>
                            <Badge
                              className={cn(
                                app.status === 'funded' ? 'bg-green-100 text-green-800' :
                                app.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'in-review' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              )}
                            >
                              {app.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
                </div>

                {appsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : applications.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No applications yet</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Start Your First Application
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.map((app) => (
                      <Card key={app.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{app.name}</CardTitle>
                              <CardDescription>{app.type}</CardDescription>
                            </div>
                            <Badge
                              className={cn(
                                app.status === 'funded' ? 'bg-green-100 text-green-800' :
                                app.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              )}
                            >
                              {app.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {app.loanAmount && (
                            <div>
                              <p className="text-sm text-gray-600">Loan Amount</p>
                              <p className="text-lg font-bold text-gray-900">{app.loanAmount}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Progress</p>
                            <Progress value={app.progress || 0} className="h-2" />
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Documents</h2>

                {/* Pending Signatures */}
                {pendingDocs.length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-orange-900">Pending Your Signature</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {pendingDocs.filter(d => d.status === 'pending').map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-100">
                          <div className="flex items-center gap-3 flex-1">
                            <FileSignature className="w-5 h-5 text-orange-600" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              {doc.dueDate && <p className="text-xs text-gray-500">Due: {doc.dueDate}</p>}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleSignDocument(doc.id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Sign
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* All Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pendingDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.status === 'signed' && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Signed
                              </div>
                            )}
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Portfolio</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Total Value</div>
                      <div className="text-3xl font-bold text-gray-900">$2.5M</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Monthly Returns</div>
                      <div className="text-3xl font-bold text-green-600">$22,500</div>
                    </CardContent>
                  </Card>
                </div>

                {portfolioLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Investments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {portfolio.map((item) => (
                          <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.type}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Amount</p>
                                <p className="font-bold text-gray-900">${(item.value / 1000000).toFixed(2)}M</p>
                              </div>
                              {item.returnRate && (
                                <div>
                                  <p className="text-gray-600">Return Rate</p>
                                  <p className="font-bold text-green-600">{item.returnRate}%</p>
                                </div>
                              )}
                              {item.monthlyReturn && (
                                <div>
                                  <p className="text-gray-600">Monthly</p>
                                  <p className="font-bold text-green-600">${(item.monthlyReturn / 1000).toFixed(1)}K</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900 mt-1">Ryan Capatosto</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900 mt-1">ryan@example.com</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Pre-Approved Amount</label>
                      <p className="text-gray-900 mt-1">$5,000,000</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">Change Password</Button>
                  </CardContent>
                </Card>

                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="hidden lg:flex w-96 border-l border-gray-200 flex-col bg-white">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-700 font-bold text-xs">SB</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">SaintBroker AI</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">💬</span>
                  </div>
                  <p className="text-sm text-gray-600">Hi! I'm SaintBroker AI. How can I help you today?</p>
                  <p className="text-xs text-gray-500 mt-2">I can help with:</p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li>• Loan questions</li>
                    <li>• Document signing</li>
                    <li>• Application status</li>
                    <li>• Account info</li>
                  </ul>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : '')}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-xs">
                        SB
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-xs px-3 py-2 rounded-lg text-sm',
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs animate-pulse">SB</span>
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                className="text-sm"
                disabled={chatLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || chatLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Vision Modal */}
      {selectedFileForVision && (
        <DocumentVisionPreview
          file={selectedFileForVision as unknown as File}
          documentName={(selectedFileForVision as any).name}
          onClose={() => setSelectedFileForVision(null)}
        />
      )}
    </div>
  );
}
