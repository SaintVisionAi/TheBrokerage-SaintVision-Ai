import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  FileText,
  StickyNote,
  FileSignature,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SaintBrokerGlobal() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "**Need capital? Rates? Answers?** I gotta guy. 🕴️"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/saint-broker/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: currentInput })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 shadow-2xl transition-all hover:scale-110"
        >
          <Sparkles className="h-7 w-7 text-black" />
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'docs', label: 'Docs', icon: FileText },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'signs', label: 'Signs', icon: FileSignature }
  ];

  return (
    <div className="fixed bottom-0 right-0 top-0 md:bottom-6 md:right-6 md:top-auto z-50 w-full md:w-[450px] md:rounded-2xl h-screen md:h-[80vh] bg-gradient-to-b from-black/50 to-black/40 backdrop-blur-xl border-l md:border border-yellow-400/40 md:shadow-2xl flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-b border-yellow-400/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          <h2 className="font-bold text-lg text-yellow-400">SaintBroker AI™</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-white/60 hover:text-white hover:bg-red-500/20 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* TABS */}
      <div className="flex-shrink-0 flex border-b border-white/10 bg-black/30">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 px-2 text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-1 relative",
                isActive
                  ? 'text-yellow-400'
                  : 'text-white/60 hover:text-white/80'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-black/20">
        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <>
            {/* MESSAGES SCROLL CONTAINER */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2.5 max-w-[85%] text-sm break-words leading-relaxed",
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium'
                        : 'bg-white/10 backdrop-blur-sm text-white/90 border border-white/20'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-white/20">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              {messages.length <= 1 && !isLoading && (
                <div className="text-center text-white/50 py-8">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Start a conversation</p>
                </div>
              )}
            </div>

            {/* INPUT AREA */}
            <div className="flex-shrink-0 p-4 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent">
              <div className="flex gap-2 items-end">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask SaintBroker..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm h-10 rounded-lg focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/30 transition-colors"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black flex-shrink-0 h-10 px-3 rounded-lg font-medium transition-all disabled:opacity-50"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Business_Loan_Agreement.pdf</p>
                  <p className="text-xs text-white/60 mt-1">256 KB • PDF</p>
                </div>
                <FileText className="h-5 w-5 text-yellow-400/60 flex-shrink-0" />
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Terms_and_Conditions.pdf</p>
                  <p className="text-xs text-white/60 mt-1">128 KB • PDF</p>
                </div>
                <FileText className="h-5 w-5 text-yellow-400/60 flex-shrink-0" />
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-sm font-medium text-white">Sample Note</p>
              <p className="text-xs text-white/70 mt-2">This is a test note for demonstration</p>
            </div>
          </div>
        )}

        {/* SIGNATURES TAB */}
        {activeTab === 'signs' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Business_Loan_Agreement.pdf</p>
                  <p className="text-xs text-white/60 mt-1">Requested 2 days ago</p>
                </div>
                <div className="flex items-center gap-1.5 bg-orange-400/20 text-orange-400 text-xs px-2 py-1 rounded-full flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  Pending
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
