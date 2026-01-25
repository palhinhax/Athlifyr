# Real-Time 1:1 Chat System

This document describes the implementation of the real-time 1:1 chat system using Socket.IO, Next.js 14, and Postgres/Prisma.

## Architecture Overview

The chat system consists of:
- **Database Models**: Conversation, ConversationParticipant, Message
- **WebSocket Server**: Socket.IO server integrated with Next.js custom server
- **REST API**: Endpoints for conversation management and message history
- **Frontend**: React components with real-time updates via WebSocket

## Database Schema

### Conversation
- `id`: Unique identifier (cuid)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Relations: `participants`, `messages`

### ConversationParticipant
- `id`: Unique identifier (cuid)
- `conversationId`: Foreign key to Conversation
- `userId`: Foreign key to User
- Unique constraint on `(conversationId, userId)` to prevent duplicates

### Message
- `id`: Unique identifier (cuid)
- `conversationId`: Foreign key to Conversation
- `senderId`: Foreign key to User
- `content`: Message text content
- `createdAt`: Creation timestamp

## REST API Endpoints

### GET /api/chat/conversations
Lists all conversations for the authenticated user with:
- Last message preview
- Participant information
- Sorted by most recent activity

**Authentication**: Required  
**Response**: Array of conversations with nested participants and messages

### POST /api/chat/conversations
Creates a new 1:1 conversation or returns an existing one.

**Authentication**: Required  
**Body**: `{ "otherUserId": "string" }`  
**Response**: Conversation object with participants

### GET /api/chat/conversations/[id]/messages
Retrieves message history for a specific conversation with pagination support.

**Authentication**: Required  
**Query Parameters**:
- `cursor`: Message ID for pagination (optional)
- `limit`: Number of messages to return (default: 50, max: 100)

**Response**: Array of messages with sender information and next cursor

### GET /api/auth/socket-token
Generates a JWT token for Socket.IO authentication.

**Authentication**: Required  
**Response**: `{ "token": "string" }`

## WebSocket Server

### Connection Setup
The Socket.IO server is initialized in `server.ts` and runs alongside the Next.js server.

**Path**: `/api/socket`  
**Authentication**: JWT token via `auth.token` in handshake

### Events

#### Client → Server

**join_conversation**
```typescript
socket.emit("join_conversation", conversationId: string);
```
Joins a conversation room. Only participants can join.

**send_message**
```typescript
socket.emit("send_message", {
  conversationId: string,
  content: string
});
```
Sends a message to a conversation. Message is validated and stored in database.

**leave_conversation**
```typescript
socket.emit("leave_conversation", conversationId: string);
```
Leaves a conversation room.

#### Server → Client

**message_received**
```typescript
socket.on("message_received", (message: Message) => {
  // Handle new message
});
```
Broadcast to all participants when a new message is sent.

**error**
```typescript
socket.on("error", (error: { message: string }) => {
  // Handle error
});
```
Sent when an error occurs (e.g., unauthorized access).

## Frontend Components

### useChatSocket Hook
`hooks/chat/use-chat-socket.ts`

Custom React hook that manages WebSocket connection and provides:
- `isConnected`: Boolean indicating connection status
- `error`: Error message if connection fails
- `sendMessage(content)`: Function to send a message

**Usage**:
```typescript
const { isConnected, sendMessage } = useChatSocket({
  conversationId: "conv_123",
  token: "jwt_token",
  onNewMessage: (message) => {
    // Handle incoming message
  },
});
```

### ChatSidebar Component
`components/chat/chat-sidebar.tsx`

Displays list of conversations with:
- User avatar and name
- Last message preview
- Time since last message
- Selection highlighting

### ChatWindow Component
`components/chat/chat-window.tsx`

Main chat interface with:
- Message history display
- Real-time message updates
- Message input field
- Send button
- Connection status indicator
- Auto-scroll to latest message

### Chat Page
`app/[locale]/chat/page.tsx`

Main chat application page that:
- Fetches conversations and messages
- Manages Socket.IO connection
- Handles conversation selection
- Coordinates between sidebar and chat window

## Security

### Authentication
- All REST API endpoints require valid NextAuth session
- WebSocket connections require valid JWT token
- JWT tokens expire after 24 hours

### Authorization
- Users can only view conversations they participate in
- Message sending is validated on server side
- Participant verification before joining rooms
- All database queries filter by user ID

## Deployment Notes

### Environment Variables Required
- `NEXTAUTH_SECRET`: Secret key for JWT signing
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_BASE_URL`: Application base URL

### Database Migration
Run the migration before deploying:
```bash
npx prisma migrate deploy
```

### Custom Server
The application uses a custom server (`server.ts`) to integrate Socket.IO with Next.js. Update deployment configuration to use:
```bash
npm start  # Runs: NODE_ENV=production tsx server.ts
```

### CORS Configuration
Update Socket.IO CORS settings in `lib/socket-server.ts` for production domain:
```typescript
cors: {
  origin: process.env.NEXT_PUBLIC_BASE_URL,
  methods: ["GET", "POST"],
  credentials: true,
}
```

## Future Enhancements

Possible improvements for the chat system:

1. **Typing Indicators**: Show when other user is typing
2. **Read Receipts**: Track when messages are read
3. **File Attachments**: Support for images and documents
4. **Group Chats**: Support for multi-user conversations
5. **Push Notifications**: Notify users of new messages
6. **Message Threading**: Reply to specific messages
7. **Search**: Search messages within conversations
8. **Archive**: Archive old conversations
9. **Multi-device Support**: Sync across multiple devices
10. **Online Presence**: Show when users are online

## Troubleshooting

### Socket Connection Issues
- Verify JWT token is valid and not expired
- Check CORS configuration matches client origin
- Ensure WebSocket connections are allowed by firewall
- Check browser console for connection errors

### Message Not Appearing
- Verify user is participant in conversation
- Check Socket.IO room membership
- Validate message is saved to database
- Ensure `message_received` event is properly emitted

### Performance Issues
- Implement message pagination to limit initial load
- Add database indexes on frequently queried fields
- Consider caching frequently accessed conversations
- Monitor Socket.IO connection count

## Testing

To test the chat system:

1. Create two test users
2. Start a conversation from user A to user B
3. Verify conversation appears in both users' lists
4. Send messages from both users
5. Verify real-time message delivery
6. Test reconnection after network interruption
7. Verify security by attempting unauthorized access

## Code Quality

All code follows:
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commit messages

Run checks:
```bash
npm run format      # Format code
npm run lint        # Run linter
npm run typecheck   # Check TypeScript types
npm run build       # Build application
```
