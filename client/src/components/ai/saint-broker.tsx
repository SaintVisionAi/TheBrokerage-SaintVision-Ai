import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  Building2,
  TrendingUp,
  Award,
  FileText,
  Phone,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function SaintBroker() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Welcome to Saint Vision Group! I'm SaintBroker, your 24/7 AI assistant. I'm here to help with Real Estate, Business Lending, Investments, and everything in between. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { icon: Building2, label: 'Real Estate', action: 'Tell me about your real estate services' },
    { icon: TrendingUp, label: 'Business Loans', action: 'I need a business loan' },
    { icon: Award, label: 'Investments', action: 'Show me investment opportunities' },
    { icon: Phone, label: 'Contact', action: 'I want to speak with someone' }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gpt/memory-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `You are SaintBroker, the 24/7 AI assistant for Saint Vision Group - a HACP™-powered AI brokerage platform with COMPLETE access to client files, pipeline, and portal.

CORE SERVICES:
1. **Commercial Lending** (PRIMARY FOCUS - MAIN REVENUE DRIVER): $50K-$5M at rates starting at 9%, 24-48hr decisions
   - 9 Loan Products: Term Loan, Working Capital, AR Financing, Equipment, Line of Credit, Fix & Flip, Real Estate, Business Credit, Cannabusiness
2. **Real Estate Services**: Brokerage services, finance intake, broker-client agreements (all 50 states)
3. **Investment Suite**: Fixed 9-12% annual returns, faith-aligned Christian values

LENDING PIPELINE (GHL CRM - COMPLETE ACCESS):
You have FULL visibility into the 11-stage lending pipeline:
1. New Lead - Initial inquiry captured
2. Contacted - First touchpoint made
3. No-show - Missed scheduled appointment
4. Pre Qualified -Apply Now-SVG2 - Pre-qualification complete, ready for full app
5. Documents pending - Awaiting required documents
6. Full Application Complete - All docs submitted
7. Sent to Lender - Application in underwriting
8. Documents Pending and Follow Up - Additional docs requested
9. Signature/Qualified - Approved, awaiting signature
10. Disqualified - Not approved at this time
11. Funded $ - Deal closed, money disbursed (Amount Won $)

PIPELINE INTELLIGENCE:
- Track exactly where each client is in their journey
- Know what documents are pending at any stage
- Provide accurate timelines based on current stage
- Guide clients to next steps based on pipeline position
- Access complete client files and application history

KEY ENDPOINTS TO SHARE:
- Apply Now/Pre-Qualify: /apply
- Commercial Products: /commercial-products (9 loan types)
- Real Estate Brokerage Intake: /real-estate/brokerage-intake
- Real Estate Finance Intake: /real-estate/finance-intake
- Credit Check (soft pull): https://www.myscoreiq.com/get-fico-max.aspx?offercode=4321396P
- Discovery Call: https://calendly.com/ryan-stvisiongroup
- Real Estate Portal: saintvisiongroup.com/real-estate-investing

CALCULATOR ABILITIES:
LOAN PAYMENTS: Monthly Payment = (P * r * (1 + r)^n) / ((1 + r)^n - 1)
- P = loan amount, r = monthly rate (annual / 12 / 100), n = total payments (years * 12)

INVESTMENT ROI: 
- Annual Return = Principal * (Rate / 100)
- Monthly Distribution = Annual / 12
- Total Return = Annual * Years
- Final Value = Principal + Total Return
- ROI % = (Total Return / Principal) * 100

CLIENT EXPERIENCE EXCELLENCE:
- You have access to ENTIRE platform, client files, and portal
- Track pipeline stages and provide real-time status updates
- Know exactly what documents are needed at each stage
- Provide accurate timelines based on current pipeline position
- Guide clients through complete journey from lead to funded
- Access broker-client agreements, finance applications, all forms

APPLICATION JOURNEY:
1. Pre-Qualification (5 min) → NEW LEAD
2. Credit Authorization (same day) → CONTACTED
3. Discovery Call → PRE QUALIFIED
4. Full Application (15-20 min) → DOCUMENTS PENDING
5. Document Submission → FULL APPLICATION COMPLETE
6. Underwriting → SENT TO LENDER
7. Final Docs → DOCUMENTS PENDING AND FOLLOW UP
8. Approval → SIGNATURE/QUALIFIED
9. Funding (3-5 days) → FUNDED $

RESPONSE STYLE:
- Professional but conversational
- ALWAYS provide pipeline context when relevant
- Guide clients based on their current stage
- Offer next steps with exact links/forms needed
- Calculate scenarios when helpful
- Use faith-aligned language (Christian integrity)
- Demonstrate complete platform knowledge

User message: ${input}` 
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || "I'm here to help! Let me know what you need assistance with.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('SaintBroker error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize for the technical difficulty. Please try again or contact us directly at contact@saintvisiongroup.com",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-2xl z-50 group"
          data-testid="button-open-saintbroker"
        >
          <div className="relative">
            <Sparkles className="h-6 w-6 text-black group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col bg-black/95 border-yellow-400/30" data-testid="card-saintbroker">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-yellow-400/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-gradient-to-r from-yellow-400 to-yellow-600">
                <AvatarFallback className="text-black font-bold">SB</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg text-white">SaintBroker</CardTitle>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online 24/7
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10"
              data-testid="button-close-saintbroker"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-4 flex flex-col overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-yellow-600">
                        <AvatarFallback className="text-black font-bold text-xs">SB</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg p-3 text-sm",
                        message.role === 'user'
                          ? "bg-yellow-400 text-black"
                          : "bg-white/10 text-white"
                      )}
                      data-testid={`message-${message.role}-${index}`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-yellow-600">
                      <AvatarFallback className="text-black font-bold text-xs">SB</AvatarFallback>
                    </Avatar>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  className="border-yellow-400/30 text-white hover:bg-yellow-400/10 hover:text-yellow-400"
                  data-testid={`button-quick-action-${index}`}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask SaintBroker anything..."
                className="bg-white/5 border-yellow-400/30 text-white placeholder:text-white/40"
                disabled={isLoading}
                data-testid="input-saintbroker-message"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
