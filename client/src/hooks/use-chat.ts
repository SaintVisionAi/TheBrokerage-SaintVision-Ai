import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Message, Conversation } from "@shared/schema";

interface ToneAnalysis {
  tone: string;
  confidence: number;
  escalationRequired: boolean;
}

export function useChat(userId: string, conversationId: string | null) {
  const [currentTone, setCurrentTone] = useState<ToneAnalysis | null>(null);
  const queryClient = useQueryClient();

  // Get messages for current conversation
  // DISABLED: No message history endpoint exists - keeping stateless
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["disabled-messages", conversationId],
    enabled: false, // Disabled until message persistence is implemented
  });

  // Send message mutation - FIXED to use working endpoint!
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      // Using the WORKING saint-broker endpoint instead!
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

      // Invalidate messages to refresh the list
      // DISABLED: No message history endpoint to invalidate
      // queryClient.invalidateQueries({
      //   queryKey: ["disabled-messages", conversationId],
      // });
    },
  });

  // Create conversation mutation - DISABLED (endpoint doesn't exist)
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      // This endpoint doesn't exist - returning mock for now
      return { id: `conv-${Date.now()}`, title };
    },
    onSuccess: () => {
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: ["/api/chat/conversations", userId],
      });
    },
  });

  const sendMessage = async (content: string) => {
    return sendMessageMutation.mutateAsync(content);
  };

  const createNewConversation = async (title: string): Promise<string> => {
    // Return a temporary conversation ID since endpoint doesn't exist
    return `conv-${Date.now()}`; 
  };

  return {
    messages,
    isLoading: messagesLoading || sendMessageMutation.isPending,
    sendMessage,
    currentTone,
    createNewConversation,
  };
}
