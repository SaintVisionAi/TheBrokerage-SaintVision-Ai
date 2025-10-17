import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Bot } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatClient() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat/openai", {
        messages: [...messages, userMsg],
        chatSettings: {
          temperature: 0.7,
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        },
      });

      if (!response.ok) {
        const { message } = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "system", content: `⚠️ Error: ${message}` },
        ]);
        toast({
          title: "Chat Error",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const { choices } = await response.json();
      const reply = choices?.[0]?.message?.content || "(no response)";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to SaintSal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageCircle className="w-5 h-5 text-blue-400" />
          SaintSal™ Chat
          <Badge variant="outline" className="ml-auto border-green-500/30 text-green-400">
            GPT-4o
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-4 space-y-4">
        <div className="flex-1 overflow-y-auto space-y-3 bg-slate-900/30 rounded-lg p-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 italic">
              Start a conversation with SaintSal...
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" 
                    ? "bg-blue-600" 
                    : msg.role === "system" 
                    ? "bg-red-600" 
                    : "bg-purple-600"
                }`}>
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-3 ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white" 
                    : msg.role === "system" 
                    ? "bg-red-600/20 text-red-400 border border-red-500/30" 
                    : "bg-slate-700 text-white"
                }`}>
                  <div className="whitespace-pre-wrap text-sm">
                    {msg.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-700 rounded-lg p-3 flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
                <span className="text-purple-400 text-sm">SaintSal is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={chatRef}></div>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            placeholder="Say something to SaintSal..."
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 resize-none focus:border-purple-500"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}