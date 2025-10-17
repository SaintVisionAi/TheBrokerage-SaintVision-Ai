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
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/chat/messages", conversationId],
    enabled: !!conversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) {
        throw new Error("No conversation selected");
      }

      const response = await apiRequest("POST", "/api/chat/message", {
        conversationId,
        role: "user",
        content,
      });

      return response.json();
    },
    onSuccess: (data) => {
      // Update tone from assistant response
      if (data.tone) {
        setCurrentTone(data.tone);
      }

      // Invalidate messages to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["/api/chat/messages", conversationId],
      });
    },
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest("POST", "/api/chat/conversation", {
        userId,
        title,
      });

      return response.json();
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
    const conversation = await createConversationMutation.mutateAsync(title);
    return conversation.id;
  };

  return {
    messages,
    isLoading: messagesLoading || sendMessageMutation.isPending,
    sendMessage,
    currentTone,
    createNewConversation,
  };
}
