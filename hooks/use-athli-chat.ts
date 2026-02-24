import { useState, useCallback, useRef, useEffect } from "react";
import { useLocale } from "next-intl";

export interface TrainingPlanProposal {
  name: string;
  description: string;
  duration: number;
  difficulty: number;
  category: string;
  targetAudience: string;
  goals: string[];
}

export interface WorkoutProposal {
  name: string;
  description?: string;
  estimatedTime?: number;
  difficulty?: number;
  tags?: string[];
}

export type ProposalType = "plan" | "workout";

export interface AthliMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  planProposal?: TrainingPlanProposal;
  workoutProposal?: WorkoutProposal;
  proposalType?: ProposalType;
  planSaved?: boolean;
}

interface AthliConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
  messages: { content: string }[];
}

interface UseAthliChatReturn {
  messages: AthliMessage[];
  conversations: AthliConversationSummary[];
  conversationId: string | null;
  isLoading: boolean;
  isLoadingConversations: boolean;
  sendMessage: (message: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  startNewConversation: () => void;
  deleteConversation: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  saveProposedPlan: (messageId: string) => Promise<void>;
  saveProposedWorkout: (messageId: string) => Promise<void>;
}

export function useAthliChat(): UseAthliChatReturn {
  const locale = useLocale();
  const [messages, setMessages] = useState<AthliMessage[]>([]);
  const [conversations, setConversations] = useState<
    AthliConversationSummary[]
  >([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const idCounter = useRef(0);

  const generateTempId = useCallback(() => {
    idCounter.current += 1;
    return `temp-${Date.now()}-${idCounter.current}`;
  }, []);

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch("/api/athli/chat");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("[Athli] Failed to load conversations:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/athli/chat/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConversationId(data.conversation.id);
        setMessages(
          data.conversation.messages.map(
            (m: {
              id: string;
              role: "user" | "assistant";
              content: string;
              createdAt: string;
            }) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
            })
          )
        );
      }
    } catch (error) {
      console.error("[Athli] Failed to load conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/athli/chat/${id}`, { method: "DELETE" });
        if (res.ok) {
          setConversations((prev) => prev.filter((c) => c.id !== id));
          if (conversationId === id) {
            startNewConversation();
          }
        }
      } catch (error) {
        console.error("[Athli] Failed to delete conversation:", error);
      }
    },
    [conversationId, startNewConversation]
  );

  const parseProposalFromContent = useCallback(
    (
      content: string
    ): {
      cleanContent: string;
      planProposal: TrainingPlanProposal | undefined;
      workoutProposal: WorkoutProposal | undefined;
      proposalType: ProposalType | undefined;
    } => {
      // Check for training plan proposal
      const planMarkerIndex = content.indexOf("[TRAINING_PLAN_PROPOSAL]");
      if (planMarkerIndex !== -1) {
        const cleanContent = content.substring(0, planMarkerIndex).trim();
        const jsonStr = content
          .substring(planMarkerIndex + "[TRAINING_PLAN_PROPOSAL]".length)
          .trim();

        try {
          const planProposal = JSON.parse(jsonStr) as TrainingPlanProposal;
          return {
            cleanContent,
            planProposal,
            workoutProposal: undefined,
            proposalType: "plan",
          };
        } catch {
          return {
            cleanContent: content,
            planProposal: undefined,
            workoutProposal: undefined,
            proposalType: undefined,
          };
        }
      }

      // Check for workout proposal
      const workoutMarkerIndex = content.indexOf("[WORKOUT_PROPOSAL]");
      if (workoutMarkerIndex !== -1) {
        const cleanContent = content.substring(0, workoutMarkerIndex).trim();
        const jsonStr = content
          .substring(workoutMarkerIndex + "[WORKOUT_PROPOSAL]".length)
          .trim();

        try {
          const workoutProposal = JSON.parse(jsonStr) as WorkoutProposal;
          return {
            cleanContent,
            planProposal: undefined,
            workoutProposal,
            proposalType: "workout",
          };
        } catch {
          return {
            cleanContent: content,
            planProposal: undefined,
            workoutProposal: undefined,
            proposalType: undefined,
          };
        }
      }

      return {
        cleanContent: content,
        planProposal: undefined,
        workoutProposal: undefined,
        proposalType: undefined,
      };
    },
    []
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: AthliMessage = {
        id: generateTempId(),
        role: "user",
        content: message.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/athli/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message.trim(),
            conversationId,
            locale,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to send message");
        }

        const data = await res.json();

        setConversationId(data.conversationId);

        const rawContent = data.message.content as string;
        const { cleanContent, planProposal, workoutProposal, proposalType } =
          parseProposalFromContent(rawContent);

        const assistantMessage: AthliMessage = {
          id: generateTempId(),
          role: "assistant",
          content: cleanContent,
          planProposal,
          workoutProposal,
          proposalType,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Refresh conversations list
        await loadConversations();
      } catch (error) {
        console.error("[Athli] Failed to send message:", error);
        const errorMessage: AthliMessage = {
          id: generateTempId(),
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      conversationId,
      isLoading,
      locale,
      generateTempId,
      loadConversations,
      parseProposalFromContent,
    ]
  );

  const saveProposedPlan = useCallback(
    async (messageId: string) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg?.planProposal || msg.planSaved) return;

      // Send a confirmation message to the AI which will trigger the save_training_plan tool
      const userConfirmation: AthliMessage = {
        id: generateTempId(),
        role: "user",
        content: "✅ Sim, guarda este plano nos meus planos!",
      };

      setMessages((prev) => [...prev, userConfirmation]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/athli/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Yes, save this training plan to my plans!",
            conversationId,
            locale,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save plan");
        }

        const data = await res.json();
        setConversationId(data.conversationId);

        // Mark the original proposal message as saved
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, planSaved: true } : m))
        );

        const rawContent = data.message.content as string;
        const { cleanContent } = parseProposalFromContent(rawContent);

        const assistantMessage: AthliMessage = {
          id: generateTempId(),
          role: "assistant",
          content: cleanContent,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        await loadConversations();
      } catch (error) {
        console.error("[Athli] Failed to save plan:", error);
        const errorMessage: AthliMessage = {
          id: generateTempId(),
          role: "assistant",
          content: "⚠️ Failed to save the plan. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      messages,
      conversationId,
      locale,
      generateTempId,
      loadConversations,
      parseProposalFromContent,
    ]
  );

  const saveProposedWorkout = useCallback(
    async (messageId: string) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg?.workoutProposal || msg.planSaved) return;

      const userConfirmation: AthliMessage = {
        id: generateTempId(),
        role: "user",
        content: "✅ Sim, guarda este treino nos meus treinos!",
      };

      setMessages((prev) => [...prev, userConfirmation]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/athli/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Yes, save this workout to my workouts!",
            conversationId,
            locale,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save workout");
        }

        const data = await res.json();
        setConversationId(data.conversationId);

        // Mark the original proposal message as saved
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, planSaved: true } : m))
        );

        const rawContent = data.message.content as string;
        const { cleanContent } = parseProposalFromContent(rawContent);

        const assistantMessage: AthliMessage = {
          id: generateTempId(),
          role: "assistant",
          content: cleanContent,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        await loadConversations();
      } catch (error) {
        console.error("[Athli] Failed to save workout:", error);
        const errorMessage: AthliMessage = {
          id: generateTempId(),
          role: "assistant",
          content: "⚠️ Failed to save the workout. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      messages,
      conversationId,
      locale,
      generateTempId,
      loadConversations,
      parseProposalFromContent,
    ]
  );

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    messages,
    conversations,
    conversationId,
    isLoading,
    isLoadingConversations,
    sendMessage,
    loadConversation,
    startNewConversation,
    deleteConversation,
    loadConversations,
    saveProposedPlan,
    saveProposedWorkout,
  };
}
