import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ToneAnalysis {
  tone: string;
  confidence: number;
  escalationRequired: boolean;
}

export function useChat(userId: string, conversationId: string | null) {
  const [currentTone, setCurrentTone] = useState<ToneAnalysis | null>(null);
  const queryClient = useQueryClient();

  // Message history disabled - saint-broker/chat is stateless
  const messages: any[] = [];
  const messagesLoading = false;

  // Send message mutation - Using WORKING saint-broker endpoint!
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/saint-broker/chat", {
        message: content,
        context: {
          userId,
          conversationId,
          source: 'chat-hook'
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Update tone from assistant response
      if (data.tone) {
        setCurrentTone(data.tone);
      }
    },
  });

  return {
    messages,
    messagesLoading,
    sendMessage: (content: string) => sendMessageMutation.mutateAsync(content),
    currentTone,
    isLoading: sendMessageMutation.isPending,
  };
}
