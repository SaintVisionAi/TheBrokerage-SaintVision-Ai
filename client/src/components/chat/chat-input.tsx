import { Send, Zap, Shield } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export default function ChatInput({ 
  message, 
  setMessage, 
  onSendMessage, 
  onKeyPress, 
  isLoading 
}: ChatInputProps) {
  return (
    <div className="border-t border-slate-700 p-6">
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Textarea
              placeholder="Ask SaintSal anything about your knowledge base, CRM, or system status..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={onKeyPress}
              className="bg-slate-800 border-slate-600 text-gray-100 placeholder-gray-500 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={onSendMessage}
              disabled={!message.trim() || isLoading}
              size="sm"
              className="absolute right-3 top-3 p-1 h-auto bg-transparent hover:bg-slate-700"
            >
              <Send className="w-4 h-4 text-indigo-500" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Powered by resurrection logic</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>HACP protected</span>
              </span>
            </div>
            <div className="text-xs text-gray-500 font-mono">Shift + Enter to send</div>
          </div>
        </div>
      </div>
    </div>
  );
}
