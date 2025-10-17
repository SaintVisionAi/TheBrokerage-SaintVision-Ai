import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Send } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MemoryAwareAssistantProps {
  userId?: string;
}

export default function MemoryAwareAssistant({ userId = '1' }: MemoryAwareAssistantProps) {
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const askAssistant = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/gpt/memory-aware', {
        user_id: userId,
        userQuery: query,
      });
      
      const data = await response.json();
      setReply(data.reply || 'No reply received.');
      
      toast({
        title: "SaintSal Response",
        description: "Memory-aware assistant has responded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askAssistant();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="w-5 h-5 text-purple-400" />
          🧠 Memory-Aware GPT Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            placeholder="Ask something..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <Button
            onClick={askAssistant}
            disabled={loading || !query.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {reply && (
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-300">
              🧠 <strong className="text-purple-400">SaintSal:</strong> {reply}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}