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
    let conversation;
    if (conversationId) {
      conversation = await prisma.athliConversation.findFirst({
        where: { id: conversationId, userId: user.id },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 50, // Last 50 messages for context
          },
        },
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    } else {
      conversation = await prisma.athliConversation.create({
        data: {
          userId: user.id,
          title: message.substring(0, 100),
        },
        include: {
          messages: true,
        },
      });
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
    const validatedPageContext =
      pageContext &&
      typeof pageContext === "object" &&
      (pageContext.type === "event" || pageContext.type === "venue") &&
      typeof pageContext.slug === "string"
        ? {
            type: pageContext.type as "event" | "venue",
            slug: pageContext.slug as string,
          }
        : null;
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
        let toolResult: string;

        switch (fnCall.function.name) {
          case "search_events":
            toolResult = await searchEvents(
              args as EventSearchParams,
              userLocale
            );
            break;
          case "get_my_events":
            toolResult = await getUserEvents(
              user.id,
              userLocale,
              args.upcoming as boolean | undefined
            );
            break;
          case "get_my_bookings":
            toolResult = await getUserBookings(
              user.id,
              userLocale,
              args.period as "today" | "week" | "upcoming" | "past" | undefined
            );
            break;
          case "search_venues":
            toolResult = await searchVenues(
              args as VenueSearchParams,
              userLocale
            );
            break;
          case "get_venue_details":
            toolResult = await getVenueDetails(
              args.venueId as string,
              userLocale
            );
            break;
          case "get_available_sessions":
            toolResult = await getAvailableSessions(
              args as AvailableSessionsParams,
              user.id,
              userLocale
            );
            break;
          case "book_session":
            toolResult = await bookSession(
              args.sessionId as string,
              user.id,
              userLocale
            );
            break;
          case "get_session_details":
            toolResult = await getSessionDetails(
              args.sessionId as string,
              userLocale
            );
            break;
          case "search_giveaways":
            toolResult = await searchGiveaways(
              userLocale,
              args.status as string | undefined
            );
            break;
          case "get_my_prs":
            toolResult = await getUserPRs(user.id, args as UserPRsParams);
            break;
          case "log_performance_entry":
            toolResult = await logPerformanceEntry(
              user.id,
              args as LogPerformanceParams
            );
            break;
          case "get_my_analyses":
            toolResult = await getUserAnalyses(
              user.id,
              args as UserAnalysesParams
            );
            break;
          case "get_my_workout_history":
            toolResult = await getUserWorkoutHistory(
              user.id,
              args as WorkoutHistoryParams
            );
            break;
          case "get_event_details":
            toolResult = await getEventDetails(
              args.eventId as string,
              userLocale
            );
            break;
          case "list_available_exercises":
            toolResult = await listAvailableExercises(
              args.category as string | undefined
            );
            break;
          case "save_training_plan":
            toolResult = await saveTrainingPlan(
              args as SaveTrainingPlanParams,
              user.id
            );
            break;
          case "save_workout":
            toolResult = await saveWorkout(args as SaveWorkoutParams, user.id);
            break;
          case "submit_admin_note":
            toolResult = await submitAdminNote(
              args as SubmitAdminNoteParams,
              user.id
            );
            break;
          case "get_platform_info":
            toolResult = await getPlatformInfo(
              args as PlatformInfoParams,
              userLocale
            );
            break;
          default:
            toolResult = "Unknown tool";
        }

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
