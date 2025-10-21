import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { useSaintBroker } from '@/context/SaintBrokerContext';
import { useChat } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';

export default function SaintBrokerGlobal() {
  const { isOpen, closeChat } = useSaintBroker();
  const { messages, sendMessage, isLoading } = useChat('global-user', 'global-chat');
  const [chatInput, setChatInput] = React.useState('');
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeChat}
      />

      {/* Chat Modal */}
      <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-2xl">
        <CardHeader className="bg-blue-600 text-white flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <CardTitle className="text-white">SaintBroker AI</CardTitle>
              <p className="text-xs text-blue-100 mt-1">Online & ready to help</p>
            </div>
          </div>
          <Button
            onClick={closeChat}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-96">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600 mb-3">Hi! I'm SaintBroker AI 👋</p>
                  <p className="text-xs text-gray-500 space-y-2">
                    <div>I can help you with:</div>
                    <div className="mt-2 text-left">
                      • Loan questions & qualification<br />
                      • Investment opportunities<br />
                      • Application guidance<br />
                      • Document requirements<br />
                      • Scheduling appointments
                    </div>
                  </p>
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
              {isLoading && (
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

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
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
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
