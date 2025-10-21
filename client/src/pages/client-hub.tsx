import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/use-chat';

export default function ClientHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lending' | 'investments' | 'real-estate' | 'tools' | 'account'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { messages, sendMessage, isLoading: chatLoading } = useChat('user-123', 'hub-chat');
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

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

  // Platform Resources
  const lendingProducts = [
    {
      title: 'Business Loans',
      description: '$50K - $5M at rates starting at 9%',
      icon: Briefcase,
      link: '/loans-docs-4-funding',
      badge: 'Popular',
    },
    {
      title: 'Real Estate Financing',
      description: '$100K - $10M+ commercial & residential',
      icon: Building2,
      link: '/real-estate-investing',
    },
    {
      title: 'Equipment Financing',
      description: 'Purchase equipment with flexible terms',
      icon: Wrench,
      link: '/loans-docs-4-funding',
    },
    {
      title: 'Lines of Credit',
      description: 'Access flexible credit when you need it',
      icon: CreditCard,
      link: '/loans-docs-4-funding',
    },
    {
      title: 'Bridge Loans',
      description: 'Short-term financing for transitions',
      icon: DollarSign,
      link: '/loans-docs-4-funding',
    },
    {
      title: 'Personal Loans',
      description: 'Debt consolidation & major purchases',
      icon: Users,
      link: '/loans-docs-4-funding',
    },
  ];

  const investmentProducts = [
    {
      title: '9-12% Fixed Returns',
      description: 'Diversified real estate & lending portfolio',
      icon: TrendingUp,
      link: '/investment-offering-1',
      badge: 'High Yield',
    },
    {
      title: 'Comprehensive Fund',
      description: 'Saint Vision Comprehensive Fund access',
      icon: PieChart,
      link: '/comprehensive-solutions',
    },
    {
      title: 'Lending Syndicate Fund',
      description: 'Private lending opportunities & returns',
      icon: DollarSign,
      link: '/investment-offering-1',
    },
    {
      title: 'UPREIT Strategies',
      description: '1031 exchanges & tax-advantaged investing',
      icon: Building2,
      link: '/investment-offering-1',
    },
    {
      title: 'Private Client Suite',
      description: 'Exclusive wealth strategies & access',
      icon: Users,
      link: '/comprehensive-solutions',
    },
    {
      title: 'Portfolio Advisory',
      description: 'Custom investment strategies for you',
      icon: TrendingUp,
      link: '/investment-offering-1',
    },
  ];

  const tools = [
    {
      title: 'Deal Analyzer',
      description: 'Analyze real estate deals & ROI',
      icon: Wrench,
      link: '/',
      action: 'Download',
    },
    {
      title: 'Market Intelligence',
      description: 'Live JP Morgan & market insights',
      icon: TrendingUp,
      link: '/',
      action: 'View',
    },
    {
      title: 'Secure File Hub',
      description: 'Upload & store documents securely',
      icon: FileText,
      link: '/file-hub',
      action: 'Access',
    },
    {
      title: 'Document Submission',
      description: 'Submit required loan documents',
      icon: FileText,
      link: '/upload-documents',
      action: 'Submit',
    },
  ];

  const quickActions = [
    {
      icon: FileText,
      title: 'Full Application',
      description: 'Complete lending application',
      link: '/full-lending-application-1',
      color: 'bg-blue-100',
    },
    {
      icon: Calendar,
      title: 'Schedule Call',
      description: 'Book discovery appointment',
      link: '/set-appointment',
      color: 'bg-green-100',
    },
    {
      icon: HelpCircle,
      title: 'SaintSal Help',
      description: 'AI assistance & support',
      link: '/',
      color: 'bg-yellow-100',
    },
    {
      icon: Home,
      title: 'Client Portal',
      description: 'Access your account & documents',
      link: '/m/account',
      color: 'bg-purple-100',
    },
  ];

  const tabItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    { id: 'lending' as const, label: 'Lending Products', icon: CreditCard },
    { id: 'investments' as const, label: 'Investments', icon: TrendingUp },
    { id: 'real-estate' as const, label: 'Real Estate', icon: Building2 },
    { id: 'tools' as const, label: 'Tools & Resources', icon: Wrench },
    { id: 'account' as const, label: 'Account', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
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
              <div>
                <h1 className="text-xl font-bold text-gray-900">Saint Vision Group</h1>
                <p className="text-xs text-gray-500">Client Hub & Resource Center</p>
              </div>
            </div>

            <div className="flex-1 max-w-xs mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
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
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🤖</span>
              <span className="text-sm font-semibold text-gray-900">SaintBroker AI</span>
            </div>
            <p className="text-xs text-gray-500">
              Need help navigating your options? I can answer questions, help with applications, or guide you through any process.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-6xl mx-auto p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Quick Links Section - Prominent Top Links */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-center text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">⚡ Client Hub Quick Links ⚡</h2>
                  <p className="text-gray-300 mb-6">We Listen. Simple. Fast & Easy. Access. Click. Upload. Connect</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                    <a href="/apply" className="block">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3">
                        📋 APPLY NOW & GET PRE-APPROVED! 🔥
                      </Button>
                    </a>
                    <a href="/soft-credit-pull" className="block">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3">
                        💎 GET PREPPED: SOFT CREDIT PULL HERE 🔑
                      </Button>
                    </a>
                    <a href="/full-lending-application-1" className="block">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3">
                        🏗 FULL LENDING APPLICATION 👊
                      </Button>
                    </a>
                    <a href="/real-estate-investing" className="block">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3">
                        📈 SVG FIXED RETURN 9-12% APP 📊
                      </Button>
                    </a>
                    <a href="/set-appointment" className="block">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3">
                        🍎 SCHEDULE & APPOINTMENTS 🍎
                      </Button>
                    </a>
                    <a href="/contact" className="block">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3">
                        💼 SAINT VISION MERCHANT SERVICES APPLICATION 🚀
                      </Button>
                    </a>
                    <a href="/file-hub" className="block">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3">
                        📁 SAINT VISION GROUP | SECURE FILE HUB 🔒
                      </Button>
                    </a>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Saint Vision Group</h2>
                  <p className="text-gray-600">Your complete hub for lending, investments, and real estate financing</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {quickActions.map((action, idx) => (
                    <a
                      key={idx}
                      href={action.link}
                      className="block"
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="pt-6">
                          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', action.color)}>
                            <action.icon className="w-6 h-6 text-gray-800" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-xs text-gray-600">{action.description}</p>
                          <Button
                            variant="link"
                            className="mt-4 p-0 text-blue-600 hover:text-blue-700"
                          >
                            Get Started <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Pre-Approved Amount</div>
                      <div className="text-3xl font-bold text-gray-900">$5M</div>
                      <p className="text-xs text-gray-500 mt-2">Ready to access</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Investment Opportunities</div>
                      <div className="text-3xl font-bold text-green-600">9-12%</div>
                      <p className="text-xs text-gray-500 mt-2">Fixed annual returns</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-600 mb-2">Fastest Funding</div>
                      <div className="text-3xl font-bold text-blue-600">24-48h</div>
                      <p className="text-xs text-gray-500 mt-2">Decision timeline</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Featured */}
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Featured: SaintVision Technologies™</CardTitle>
                    <CardDescription className="text-blue-800">AI-powered lending and investment solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-900 mb-4">
                      Experience next-generation financing with our patent-protected HACP™ technology. Faster decisions, better terms, technology-enabled excellence.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Learn About Our Technology
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Lending Tab */}
            {activeTab === 'lending' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Lending Solutions</h2>
                  <p className="text-gray-600">From $50K to $5M+ with competitive rates starting at 9%</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lendingProducts.map((product, idx) => (
                    <a key={idx} href={product.link} className="block">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-lg">{product.title}</CardTitle>
                              <CardDescription>{product.description}</CardDescription>
                            </div>
                            {product.badge && (
                              <Badge className="bg-green-100 text-green-800 text-xs">{product.badge}</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                            <product.icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <Button variant="outline" className="mt-4">
                            Learn More <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                {/* CTA Section */}
                <Card className="bg-blue-600 text-white border-0">
                  <CardContent className="pt-8">
                    <h3 className="text-2xl font-bold mb-2">Ready to Get Funded?</h3>
                    <p className="mb-4 text-blue-100">Complete application takes 15-20 minutes. Decision in 24-48 hours.</p>
                    <div className="flex gap-3">
                      <a href="/full-lending-application-1" className="block">
                        <Button className="bg-white text-blue-600 hover:bg-gray-100">
                          Start Application
                        </Button>
                      </a>
                      <a href="/set-appointment" className="block">
                        <Button variant="outline" className="border-white text-white hover:bg-blue-700">
                          Schedule Call
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Investments Tab */}
            {activeTab === 'investments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Investment Opportunities</h2>
                  <p className="text-gray-600">Fixed returns from 9-12% annually. Tax-advantaged strategies available.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {investmentProducts.map((product, idx) => (
                    <a key={idx} href={product.link} className="block">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-lg">{product.title}</CardTitle>
                              <CardDescription>{product.description}</CardDescription>
                            </div>
                            {product.badge && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">{product.badge}</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                            <product.icon className="w-6 h-6 text-green-600" />
                          </div>
                          <Button variant="outline" className="mt-4">
                            Explore <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                {/* Why Invest */}
                <Card>
                  <CardHeader>
                    <CardTitle>Why Invest with Saint Vision Group?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Fixed Returns</p>
                        <p className="text-sm text-gray-600">Predictable 9-12% annual returns</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Diversification</p>
                        <p className="text-sm text-gray-600">Real estate & lending portfolio mix</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Tax-Advantaged</p>
                        <p className="text-sm text-gray-600">UPREIT, 1031 exchanges & strategies</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Private Access</p>
                        <p className="text-sm text-gray-600">Exclusive opportunities for clients</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Real Estate Tab */}
            {activeTab === 'real-estate' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Real Estate Solutions</h2>
                  <p className="text-gray-600">Fix & flips, DSCR loans, bridge financing, and investment properties</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fix & Flip Loans</CardTitle>
                      <CardDescription>Quick capital for real estate projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Loan Amount</p>
                          <p className="font-semibold text-gray-900">$100K - $10M+</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Terms</p>
                          <p className="font-semibold text-gray-900">6 months - 24 months</p>
                        </div>
                      </div>
                      <a href="/real-estate-investing">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Learn More</Button>
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>DSCR Loans</CardTitle>
                      <CardDescription>No income verification required</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Loan Amount</p>
                          <p className="font-semibold text-gray-900">$100K - $5M+</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Perfect For</p>
                          <p className="font-semibold text-gray-900">Investment properties</p>
                        </div>
                      </div>
                      <a href="/real-estate-investing">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Learn More</Button>
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Bridge Loans</CardTitle>
                      <CardDescription>Short-term transition financing</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Speed</p>
                          <p className="font-semibold text-gray-900">48-72 hour closing</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Use Case</p>
                          <p className="font-semibold text-gray-900">Buy before you sell</p>
                        </div>
                      </div>
                      <a href="/real-estate-investing">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Learn More</Button>
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cash-Out Refi</CardTitle>
                      <CardDescription>Leverage existing equity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Access Equity</p>
                          <p className="font-semibold text-gray-900">Up to 80% LTV</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Use Funds For</p>
                          <p className="font-semibold text-gray-900">Any purpose</p>
                        </div>
                      </div>
                      <a href="/real-estate-investing">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Learn More</Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Tools & Resources</h2>
                  <p className="text-gray-600">Everything you need to make informed decisions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tools.map((tool, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle>{tool.title}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                          <tool.icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <a href={tool.link}>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            {tool.action} <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Educational Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Educational Resources</CardTitle>
                    <CardDescription>Learn about financing, investing & real estate strategies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a href="/" className="block p-3 border rounded-lg hover:bg-gray-50">
                      <div className="font-medium text-gray-900">Live Market Intelligence</div>
                      <div className="text-sm text-gray-600">JP Morgan insights & real-time market data</div>
                    </a>
                    <a href="/" className="block p-3 border rounded-lg hover:bg-gray-50">
                      <div className="font-medium text-gray-900">Lending Guide</div>
                      <div className="text-sm text-gray-600">Everything you need to know about business loans</div>
                    </a>
                    <a href="/" className="block p-3 border rounded-lg hover:bg-gray-50">
                      <div className="font-medium text-gray-900">Investment Strategies</div>
                      <div className="text-sm text-gray-600">Tax-advantaged approaches & portfolio optimization</div>
                    </a>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>

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
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a href="/file-hub" className="block p-3 border rounded-lg hover:bg-gray-50">
                      <p className="font-medium text-gray-900">Secure File Hub</p>
                      <p className="text-sm text-gray-600">Upload & store documents safely</p>
                    </a>
                    <a href="/upload-documents" className="block p-3 border rounded-lg hover:bg-gray-50">
                      <p className="font-medium text-gray-900">Submit Loan Documents</p>
                      <p className="text-sm text-gray-600">Upload required documents for your application</p>
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      SaintSal Help Desk
                    </Button>
                    <a href="/set-appointment">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Consultation
                      </Button>
                    </a>
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
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🤖</span>
              <p className="font-semibold text-gray-900">SaintBroker AI</p>
            </div>
            <p className="text-xs text-green-600">Online & ready to help</p>
          </div>

          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-sm text-gray-600 mb-3">Hi! I'm SaintBroker AI 👋</div>
                  <div className="text-xs text-gray-500 space-y-2">
                    <div>I can help you with:</div>
                    <div className="mt-2">
                      • Loan questions & qualification<br />
                      • Investment opportunities<br />
                      • Application guidance<br />
                      • Document requirements<br />
                      • Scheduling appointments
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : '')}>
                    {msg.role === 'assistant' && (
                      <span className="text-xl flex-shrink-0">🤖</span>
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
                  <span className="text-xl">🤖</span>
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
                placeholder="Ask anything..."
                className="text-sm border-gray-300"
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
    </div>
  );
}
