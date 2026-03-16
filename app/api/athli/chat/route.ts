/**
 * Athli AI Assistant - Chat API
 *
 * POST - Send a message to Athli and get a streaming response
 * GET  - List user's conversations
 */

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import {
  getSystemPrompt,
  athliTools,
  searchEvents,
  searchVenues,
  getEventDetails,
  getVenueDetails,
  getUserEvents,
  getUserBookings,
  getUserPRs,
  getUserAnalyses,
  getUserWorkoutHistory,
  searchGiveaways,
  getAvailableSessions,
  bookSession,
  getSessionDetails,
  saveTrainingPlan,
  saveWorkout,
  listAvailableExercises,
  submitAdminNote,
  getPlatformInfo,
  logPerformanceEntry,
} from "@/lib/athli-ai";
import type {
  EventSearchParams,
  VenueSearchParams,
  AvailableSessionsParams,
  UserPRsParams,
  UserAnalysesParams,
  WorkoutHistoryParams,
  SaveTrainingPlanParams,
  SaveWorkoutParams,
  SubmitAdminNoteParams,
  PlatformInfoParams,
  LogPerformanceParams,
} from "@/lib/athli-ai";

// Lazy getter — avoids module-level instantiation at build time
function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({ apiKey });
}

// GET /api/athli/chat - List conversations
export async function GET(request: Request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.athliConversation.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "asc" },
          where: { role: "user" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[Athli] Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

async function getOrCreateConversation(
  conversationId: string | undefined,
  userId: string,
  message: string
) {
  if (conversationId) {
    return prisma.athliConversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        messages: { orderBy: { createdAt: "asc" }, take: 50 },
      },
    });
  }
  return prisma.athliConversation.create({
    data: { userId, title: message.substring(0, 100) },
    include: { messages: true },
  });
}

function validatePageContext(
  pageContext: unknown
): { type: "event" | "venue"; slug: string } | null {
  if (
    pageContext &&
    typeof pageContext === "object" &&
    "type" in pageContext &&
    "slug" in pageContext &&
    ((pageContext as Record<string, unknown>).type === "event" ||
      (pageContext as Record<string, unknown>).type === "venue") &&
    typeof (pageContext as Record<string, unknown>).slug === "string"
  ) {
    return {
      type: (pageContext as Record<string, string>).type as "event" | "venue",
      slug: (pageContext as Record<string, string>).slug,
    };
  }
  return null;
}

async function executeToolCall(
  name: string,
  args: Record<string, unknown>,
  userId: string,
  userLocale: string
): Promise<string> {
  switch (name) {
    case "search_events":
      return searchEvents(args as EventSearchParams, userLocale);
    case "get_my_events":
      return getUserEvents(
        userId,
        userLocale,
        args.upcoming as boolean | undefined
      );
    case "get_my_bookings":
      return getUserBookings(
        userId,
        userLocale,
        args.period as "today" | "week" | "upcoming" | "past" | undefined
      );
    case "search_venues":
      return searchVenues(args as VenueSearchParams, userLocale);
    case "get_venue_details":
      return getVenueDetails(args.venueId as string, userLocale);
    case "get_available_sessions":
      return getAvailableSessions(
        args as AvailableSessionsParams,
        userId,
        userLocale
      );
    case "book_session":
      return bookSession(args.sessionId as string, userId, userLocale);
    case "get_session_details":
      return getSessionDetails(args.sessionId as string, userLocale);
    case "search_giveaways":
      return searchGiveaways(userLocale, args.status as string | undefined);
    case "get_my_prs":
      return getUserPRs(userId, args as UserPRsParams);
    case "log_performance_entry":
      return logPerformanceEntry(
        userId,
        args as unknown as LogPerformanceParams
      );
    case "get_my_analyses":
      return getUserAnalyses(userId, args as UserAnalysesParams);
    case "get_my_workout_history":
      return getUserWorkoutHistory(userId, args as WorkoutHistoryParams);
    case "get_event_details":
      return getEventDetails(args.eventId as string, userLocale);
    case "list_available_exercises":
      return listAvailableExercises(args.category as string | undefined);
    case "save_training_plan":
      return saveTrainingPlan(
        args as unknown as SaveTrainingPlanParams,
        userId
      );
    case "save_workout":
      return saveWorkout(args as unknown as SaveWorkoutParams, userId);
    case "submit_admin_note":
      return submitAdminNote(args as unknown as SubmitAdminNoteParams, userId);
    case "get_platform_info":
      return getPlatformInfo(args as PlatformInfoParams, userLocale);
    default:
      return "Unknown tool";
  }
}

// POST /api/athli/chat - Send message and get AI response
export async function POST(request: Request) {
  try {
    const openai = getOpenAI();
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user exists in DB (session JWT may outlive DB resets)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found. Please sign out and sign in again." },
        { status: 401 }
      );
    }

    const { message, conversationId, locale, pageContext } =
      await request.json();

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const userLocale = locale || "pt";

    // Get or create conversation
    const conversation = await getOrCreateConversation(
      conversationId,
      user.id,
      message
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Save user message
    await prisma.athliMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message.trim(),
      },
    });

    // Build message history for OpenAI
    const validatedPageContext = validatePageContext(pageContext);
    const systemPrompt = getSystemPrompt(
      userLocale,
      user.name,
      validatedPageContext
    );
    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    for (const msg of conversation.messages) {
      if (msg.role === "user" || msg.role === "assistant") {
        chatMessages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add current message
    chatMessages.push({ role: "user", content: message.trim() });

    // Call OpenAI with tools
    let response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      tools: athliTools.map((tool) => ({
        type: "function" as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      })),
      tool_choice: "auto",
      temperature: 0.7,
      max_tokens: 4000,
    });

    let assistantMessage = response.choices[0].message;

    // Handle tool calls (may need multiple rounds)
    let iterations = 0;
    const maxIterations = 8;

    while (assistantMessage.tool_calls && iterations < maxIterations) {
      iterations++;

      // Add assistant message with tool calls
      chatMessages.push(assistantMessage);

      // Process each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type !== "function") continue;
        const fnCall = toolCall as {
          id: string;
          type: "function";
          function: { name: string; arguments: string };
        };
        const args = JSON.parse(fnCall.function.arguments);
        const toolResult = await executeToolCall(
          fnCall.function.name,
          args,
          user.id,
          userLocale
        );

        chatMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      }

      // Get next response from OpenAI
      response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages,
        tools: athliTools.map((tool) => ({
          type: "function" as const,
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        })),
        tool_choice: "auto",
        temperature: 0.7,
        max_tokens: 4000,
      });

      assistantMessage = response.choices[0].message;
    }

    const assistantContent =
      assistantMessage.content || "Sorry, I could not generate a response.";

    // Save assistant response
    await prisma.athliMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: assistantContent,
        metadata: assistantMessage.tool_calls
          ? JSON.parse(
              JSON.stringify({ toolCalls: assistantMessage.tool_calls })
            )
          : undefined,
      },
    });

    // Update conversation title if it's the first message
    if (conversation.messages.length === 0) {
      await prisma.athliConversation.update({
        where: { id: conversation.id },
        data: {
          title: message.substring(0, 100),
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.athliConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      conversationId: conversation.id,
      message: {
        role: "assistant",
        content: assistantContent,
      },
    });
  } catch (error) {
    console.error("[Athli] Error processing chat:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
