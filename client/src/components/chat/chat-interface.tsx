import { useState } from "react";
import { Card } from "@/components/ui/card";
import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";
import ToneDetector from "@/components/assistant/tone-detector";
import { Brain, UserCheck } from "lucide-react";
import { useChat } from "@/hooks/use-chat";

interface ChatInterfaceProps {
  userId: string;
  selectedConversation: string | null;
  onConversationSelect: (id: string) => void;
}

export default function ChatInterface({ 
  userId, 
  selectedConversation, 
  onConversationSelect 
}: ChatInterfaceProps) {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    currentTone,
    createNewConversation 
  } = useChat(userId, selectedConversation);

  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    let conversationId = selectedConversation;
    
    // Create new conversation if none selected
    if (!conversationId) {
      conversationId = await createNewConversation("New Conversation");
      onConversationSelect(conversationId);
    }
    
    await sendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">SaintSal Assistant</h3>
              <p className="text-sm text-gray-400">AI-powered knowledge companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ToneDetector tone={currentTone} />
            
            <button 
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors" 
              title="Escalate to Human"
            >
              <UserCheck className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ChatMessages messages={messages} isLoading={isLoading} />

      {/* Chat Input */}
      <ChatInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
      />
    </div>
  );
}
