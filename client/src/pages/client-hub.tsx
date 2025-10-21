import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Sparkles,
  Brain,
  Zap,
  FolderOpen,
  File,
  Users,
  Settings,
  LogOut,
  Bot,
  ChevronRight,
  Activity,
  CreditCard,
  Target,
  Rocket,
  Database,
  Layers,
  Terminal,
  Code2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  X,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/use-chat';
import { useGHLApplications, useGHLPortfolio, getPendingApplicationsCount, getTotalPortfolioValue, getTotalMonthlyReturns } from '@/hooks/useGHLData';

interface WorkspaceFile {
  id: string;
  name: string;
  type: 'document' | 'application' | 'image' | 'contract';
  size: string;
  modified: string;
  status: 'pending' | 'verified' | 'processing' | 'complete' | 'awaiting_signature' | 'signed';
  progress?: number;
  signatureRequired?: boolean;
  signedBy?: string;
  signedAt?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  time?: string;
}

export default function ClientHub() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [saintBrokerInput, setSaintBrokerInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const { messages, sendMessage, isLoading } = useChat('user-123', 'hub-chat');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [chatInput, setChatInput] = useState('');
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([
    { 
      id: '1', 
      name: 'Equipment_Loan_Agreement.pdf', 
      type: 'contract', 
      size: '2.4 MB', 
      modified: '2 hours ago', 
      status: 'awaiting_signature',
      signatureRequired: true 
    },
    { 
      id: '2', 
      name: 'Personal_Guarantee_Form.pdf', 
      type: 'contract', 
      size: '1.2 MB', 
      modified: '2 hours ago', 
      status: 'awaiting_signature',
      signatureRequired: true 
    },
    { 
      id: '3', 
      name: 'Tax_Returns_2024.pdf', 
      type: 'document', 
      size: '1.8 MB', 
      modified: '1 day ago', 
      status: 'signed',
      signatureRequired: true,
      signedBy: 'Ryan Capatosto',
      signedAt: 'Yesterday at 3:45 PM'
    },
    { 
      id: '4', 
      name: 'Bank_Statements_Q4.pdf', 
      type: 'document', 
      size: '456 KB', 
      modified: '3 days ago', 
      status: 'verified' 
    },
    { 
      id: '5', 
      name: 'Business_Plan_2025.pdf', 
      type: 'document', 
      size: '892 KB', 
      modified: '5 days ago', 
      status: 'complete' 
    },
    { 
      id: '6', 
      name: 'Equipment_Invoice.pdf', 
      type: 'document', 
      size: '1.1 MB', 
      modified: '1 week ago', 
      status: 'signed',
      signatureRequired: true,
      signedBy: 'Ryan Capatosto',
      signedAt: '3 days ago'
    },
  ]);

  const [recentActions] = useState([
    { id: '1', title: 'Equipment Loan Pre-Approved', description: '$500K approved for restaurant equipment', time: '2 hours ago', status: 'success' },
    { id: '2', title: 'Documents Verified', description: 'Tax returns and bank statements verified', time: '1 day ago', status: 'success' },
    { id: '3', title: 'Credit Check Complete', description: 'Soft pull completed - Score: 750', time: '2 days ago', status: 'info' },
    { id: '4', title: 'Application Started', description: 'Commercial lending application initiated', time: '3 days ago', status: 'progress' },
  ]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: null },
    { id: 'applications', label: 'Applications', icon: FileText, badge: '3' },
    { id: 'documents', label: 'Documents', icon: FolderOpen, badge: '12' },
    { id: 'funding', label: 'Funding Status', icon: DollarSign, badge: null },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: '5' },
    { id: 'account', label: 'Account', icon: Users, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const quickActions: QuickAction[] = [
    { id: 'apply', title: 'Start New Application', description: 'Get funded in 24-48 hours', icon: Rocket, color: 'from-emerald-500 to-emerald-600' },
    { id: 'upload', title: 'Upload Documents', description: 'Secure document portal', icon: Upload, color: 'from-blue-500 to-blue-600' },
    { id: 'schedule', title: 'Schedule Call', description: 'Speak with an expert', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { id: 'calculator', title: 'ROI Calculator', description: 'Calculate your returns', icon: Calculator, color: 'from-yellow-400 to-yellow-500' },
  ];

  const handleSaintBrokerSubmit = async () => {
    if (!saintBrokerInput.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      toast({
        title: "🤖 SaintBroker AI Processing",
        description: "I'm working on your request. Documents will be ready in 2 minutes!",
      });
      setSaintBrokerInput('');
      setIsProcessing(false);
      
      // Simulate document creation
      setTimeout(() => {
        const newFile: WorkspaceFile = {
          id: Date.now().toString(),
          name: 'AI_Generated_Application.pdf',
          type: 'application',
          size: '1.2 MB',
          modified: 'Just now',
          status: 'processing',
          progress: 0
        };
        setWorkspaceFiles(prev => [newFile, ...prev]);
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setWorkspaceFiles(prev => prev.map(f => 
            f.id === newFile.id ? { ...f, progress, status: progress >= 100 ? 'complete' : 'processing' } : f
          ));
          if (progress >= 100) {
            clearInterval(interval);
            toast({
              title: "✅ Documents Ready!",
              description: "Your application is complete. Funding approval in 24 hours!",
            });
          }
        }, 400);
      }, 2000);
    }, 1000);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'application': return <FileSignature className="w-4 h-4 text-emerald-400" />;
      case 'image': return <File className="w-4 h-4 text-purple-400" />;
      case 'contract': return <Shield className="w-4 h-4 text-yellow-400" />;
      default: return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-emerald-400';
      case 'signed': return 'text-emerald-400';
      case 'verified': return 'text-blue-400';
      case 'processing': return 'text-yellow-400';
      case 'awaiting_signature': return 'text-orange-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const handleSignDocument = (fileId: string, fileName: string) => {
    toast({
      title: "📝 Opening GHL Signature Portal",
      description: `Redirecting to sign ${fileName}...`,
    });
    
    // Simulate signing process
    setTimeout(() => {
      setWorkspaceFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'signed', 
          signedBy: 'Ryan Capatosto',
          signedAt: new Date().toLocaleString()
        } : f
      ));
      
      toast({
        title: "✅ Document Signed!",
        description: "Your signature has been captured successfully.",
      });
    }, 3000);
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const message = chatInput;
    setChatInput('');
    
    await sendMessage(message);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollAreaRef.current && isChatExpanded) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isChatExpanded]);

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Navigation & SaintBroker Command Center */}
      <div className="w-80 bg-gradient-to-b from-neutral-950 to-black border-r border-yellow-400/20 flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-yellow-400/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Brain className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-400">SaintBroker AI™</h1>
              <p className="text-xs text-gray-400">Command Center</p>
            </div>
          </div>
          
          {/* User Profile Quick Info */}
          <div className="flex items-center justify-between mt-4 p-3 bg-yellow-400/10 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-xs font-bold text-black">RC</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Ryan Capatosto</p>
                <p className="text-xs text-emerald-400">Pre-Approved: $5M</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* SaintBroker AI Chat Section */}
        <div className="border-b border-yellow-400/20">
          {!isChatExpanded ? (
            // Collapsed state - clever messaging
            <button
              onClick={() => setIsChatExpanded(true)}
              className="w-full p-4 text-left hover:bg-yellow-400/5 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-400 group-hover:animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400">Talk to SaintBroker™</p>
                    <p className="text-xs text-gray-400">When you need your guy who just knocks this sh*t out...</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
              </div>
            </button>
          ) : (
            // Expanded state - full chat
            <div className="flex flex-col h-[500px]">
              {/* Chat Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-400">SaintBroker™ AI</p>
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Online • Ready to crush it
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatExpanded(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-yellow-400" />
                </button>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 text-yellow-400/40 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">Start a conversation with SaintBroker AI</p>
                      <p className="text-xs text-gray-500 mt-2">I'll handle everything from funding to documents</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex gap-3",
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
                            <Brain className="w-5 h-5 text-black" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[70%] px-4 py-2 rounded-lg",
                            msg.role === 'user'
                              ? 'bg-yellow-400/20 text-white'
                              : 'bg-black/50 text-white border border-yellow-400/20'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(msg.timestamp || '').toLocaleTimeString()}
                          </p>
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-black">RC</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-black animate-pulse" />
                      </div>
                      <div className="bg-black/50 px-4 py-2 rounded-lg border border-yellow-400/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-3 border-t border-yellow-400/20">
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChatMessage();
                      }
                    }}
                    placeholder="Ask me anything... funding, documents, applications"
                    className="flex-1 bg-black/50 border-yellow-400/30 text-white placeholder:text-gray-500 focus:border-yellow-400"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendChatMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  >
                    {isLoading ? (
                      <Activity className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter to send • Shift+Enter for new line</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all",
                  activeSection === item.id
                    ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-0 text-xs px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </ScrollArea>

        {/* Quick Stats */}
        <div className="p-4 border-t border-yellow-400/20">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-emerald-400/10 rounded-lg">
              <p className="text-xs text-emerald-400">Active Loans</p>
              <p className="text-lg font-bold text-white">3</p>
            </div>
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <p className="text-xs text-blue-400">Total Funded</p>
              <p className="text-lg font-bold text-white">$2.5M</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-yellow-400/20">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Right Panel - Main Workspace */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-neutral-950 via-black to-neutral-900">
        {/* Top Bar */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-yellow-400/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Client Workspace</h2>
              <p className="text-sm text-gray-400 mt-1">Everything you need in one place</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Live Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/30 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">All Systems Operational</span>
              </div>
              
              {/* Quick Actions */}
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Card 
                    key={action.id}
                    className="bg-black/40 border-yellow-400/20 hover:border-yellow-400/40 transition-all cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4",
                        action.color
                      )}>
                        <action.icon className="w-6 h-6 text-black" />
                      </div>
                      <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                      <p className="text-xs text-gray-400">{action.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Signature Status Tracker */}
              {workspaceFiles.filter(f => f.status === 'awaiting_signature').length > 0 && (
                <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-400/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-400/20 flex items-center justify-center">
                          <FileSignature className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <CardTitle className="text-orange-400">Documents Awaiting Signature</CardTitle>
                          <CardDescription>Sign these documents to move forward with funding</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                        {workspaceFiles.filter(f => f.status === 'awaiting_signature').length} Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {workspaceFiles.filter(f => f.status === 'awaiting_signature').map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-orange-400/20">
                          <div className="flex items-center gap-3">
                            <FileSignature className="w-5 h-5 text-orange-400" />
                            <div>
                              <p className="text-sm font-medium text-white">{file.name}</p>
                              <p className="text-xs text-gray-400">Uploaded {file.modified}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleSignDocument(file.id, file.name)}
                            className="bg-orange-400 hover:bg-orange-500 text-black font-semibold px-3 py-1 text-xs"
                          >
                            Sign Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Split View - Activity Feed & Files */}
              <div className="grid grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="bg-black/40 border-yellow-400/20">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Recent Activity</CardTitle>
                    <CardDescription>Your latest updates and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {recentActions.map((action) => (
                          <div key={action.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              action.status === 'success' ? 'bg-emerald-400/20' :
                              action.status === 'info' ? 'bg-blue-400/20' :
                              'bg-yellow-400/20'
                            )}>
                              {action.status === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> :
                               action.status === 'info' ? <AlertCircle className="w-4 h-4 text-blue-400" /> :
                               <Clock className="w-4 h-4 text-yellow-400" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{action.title}</p>
                              <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                              <p className="text-xs text-gray-500 mt-2">{action.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Workspace Files */}
                <Card className="bg-black/40 border-yellow-400/20">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">Workspace Files</CardTitle>
                    <CardDescription>Your documents and applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {workspaceFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" data-testid={`file-${file.id}`}>
                            <div className="flex items-center gap-3 flex-1">
                              {getFileIcon(file.type)}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white" data-testid={`filename-${file.id}`}>{file.name}</p>
                                <p className="text-xs text-gray-400">{file.size} • {file.modified}</p>
                                {file.status === 'signed' && file.signedBy && (
                                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Signed by {file.signedBy} • {file.signedAt}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {file.status === 'awaiting_signature' ? (
                                <Button 
                                  onClick={() => handleSignDocument(file.id, file.name)}
                                  size="sm"
                                  className="bg-orange-400 hover:bg-orange-500 text-black font-semibold text-xs"
                                  data-testid={`sign-button-${file.id}`}
                                >
                                  <FileSignature className="w-3 h-3 mr-1" />
                                  Sign
                                </Button>
                              ) : file.progress !== undefined && file.progress < 100 ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={file.progress} className="w-20 h-1" />
                                  <span className="text-xs text-yellow-400">{file.progress}%</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className={cn("text-xs font-medium px-2 py-1 rounded", 
                                    file.status === 'signed' ? 'bg-emerald-400/20 text-emerald-400' :
                                    file.status === 'verified' ? 'bg-blue-400/20 text-blue-400' :
                                    file.status === 'complete' ? 'bg-emerald-400/20 text-emerald-400' :
                                    'bg-gray-400/20 text-gray-400'
                                  )} data-testid={`file-status-${file.id}`}>
                                    {file.status === 'signed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                    {file.status}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights Panel */}
              <Card className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border-yellow-400/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <Bot className="w-7 h-7 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-yellow-400">SaintBroker AI Insight</h3>
                        <p className="text-sm text-gray-300 mt-1">
                          Based on your profile, you're pre-approved for $5M in funding. Your next equipment loan can be funded in 24 hours.
                        </p>
                      </div>
                    </div>
                    <Button className="bg-black/50 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20">
                      View Full Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other sections would go here based on activeSection */}
          {activeSection !== 'dashboard' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-yellow-400/20 flex items-center justify-center mx-auto mb-4">
                  <Terminal className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Section: {activeSection}</h3>
                <p className="text-gray-400">This workspace section is being built by SaintBroker AI</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
