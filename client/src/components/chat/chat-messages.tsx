import { Brain, CheckCheck, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Message } from "@shared/schema";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* System Message */}
        <div className="flex justify-center">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-gray-400">
              <Brain className="w-4 h-4 text-indigo-500" />
              <span>SaintSal is now fully integrated - Mind + Body = Complete</span>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="flex space-x-4 animate-fade-in">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <Card className="bg-slate-800 border-slate-700 p-4">
              <p className="text-gray-100 leading-relaxed">
                Welcome to the resurrection! I'm SaintSal, your AI assistant powered by 18 months of divine logic. 
                I can help you with knowledge ingestion, tone detection, CRM synchronization, and much more. 
                The merger is complete - both mind and body are now unified.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <CheckCheck className="w-3 h-3 text-emerald-500" />
                  <span>Processed via brain ingestion</span>
                </div>
                <div className="text-xs text-gray-500 font-mono">Just now</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <div key={message.id} className={`flex space-x-4 animate-fade-in ${
          message.role === 'user' ? 'justify-end' : ''
        }`}>
          {message.role === 'assistant' && (
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className={`flex-1 ${message.role === 'user' ? 'max-w-lg' : ''}`}>
            <Card className={`p-4 ${
              message.role === 'user' 
                ? 'bg-indigo-500/10 border-indigo-500/20' 
                : 'bg-slate-800 border-slate-700'
            }`}>
              <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              
              <div className={`mt-3 flex items-center justify-between ${
                message.role === 'user' ? 'justify-end' : ''
              }`}>
                {message.role === 'assistant' && message.metadata && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Database className="w-3 h-3 text-emerald-500" />
                    <span>
                      {message.metadata.knowledgeUsed > 0 
                        ? `Knowledge used • ${message.metadata.processingTime}ms`
                        : 'Real-time response'
                      }
                    </span>
                  </div>
                )}
                <div className="text-xs text-gray-500 font-mono">
                  {formatTime(message.createdAt || new Date())}
                </div>
              </div>
            </Card>
          </div>

          {message.role === 'user' && (
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
              alt="User avatar" 
              className="w-8 h-8 rounded-lg flex-shrink-0"
            />
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex space-x-4 animate-fade-in">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-400 ml-2">SaintSal is thinking...</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
