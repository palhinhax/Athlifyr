import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "./prisma";
import { verify } from "jsonwebtoken";

// Define socket data interface
interface SocketData {
  userId: string;
}

// Define authenticated socket type
type AuthenticatedSocket = Socket<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  SocketData
>;

let io: SocketIOServer | null = null;

export function initializeSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication token required"));
      }

      // Verify JWT token
      const secret = process.env.NEXTAUTH_SECRET;
      if (!secret) {
        return next(new Error("Server configuration error"));
      }

      const decoded = verify(token, secret) as { id: string };

      if (!decoded?.id) {
        return next(new Error("Invalid token"));
      }

      // Store user ID in socket data
      socket.data.userId = decoded.id;

      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  // Connection handler
  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.data.userId}`);

    // Join user's personal notification room
    socket.join(`user:${socket.data.userId}`);

    // Join all user's conversations for notifications
    socket.on("join_user_notifications", async () => {
      try {
        const conversations = await prisma.conversationParticipant.findMany({
          where: {
            userId: socket.data.userId,
          },
          select: {
            conversationId: true,
          },
        });

        for (const conv of conversations) {
          socket.join(`notify:${conv.conversationId}`);
        }

        console.log(
          `User ${socket.data.userId} joined ${conversations.length} notification rooms`
        );
      } catch (error) {
        console.error("Error joining notification rooms:", error);
      }
    });

    // Join conversation room
    socket.on("join_conversation", async (conversationId: string) => {
      try {
        // Verify user is participant
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId: socket.data.userId,
          },
        });

        if (!participant) {
          socket.emit("error", {
            message: "Not authorized to join this conversation",
          });
          return;
        }

        // Join the room
        socket.join(conversationId);
        // Also join notification room for this conversation
        socket.join(`notify:${conversationId}`);
        console.log(
          `User ${socket.data.userId} joined conversation ${conversationId}`
        );
      } catch (error) {
        console.error("Error joining conversation:", error);
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    // Send message
    socket.on(
      "send_message",
      async (data: { conversationId: string; content: string }) => {
        try {
          const { conversationId, content } = data;

          if (!content?.trim()) {
            socket.emit("error", { message: "Message content is required" });
            return;
          }

          // Verify user is participant
          const participant = await prisma.conversationParticipant.findFirst({
            where: {
              conversationId,
              userId: socket.data.userId,
            },
          });

          if (!participant) {
            socket.emit("error", {
              message: "Not authorized to send messages in this conversation",
            });
            return;
          }

          // Create message
          const message = await prisma.message.create({
            data: {
              conversationId,
              senderId: socket.data.userId,
              content: content.trim(),
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          });

          // Update conversation timestamp
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          });

          // Emit to all participants in the conversation room
          io?.to(conversationId).emit("message_received", message);

          // Also emit notification to all participants (for users not in conversation view)
          io?.to(`notify:${conversationId}`).emit(
            "new_message_notification",
            message
          );

          console.log(
            `Message sent in conversation ${conversationId} by user ${socket.data.userId}`
          );
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    // Leave conversation
    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(conversationId);
      console.log(
        `User ${socket.data.userId} left conversation ${conversationId}`
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
}

export function getSocketServer(): SocketIOServer | null {
  return io;
}
