import { NextResponse } from "next/server";

// This is a placeholder route for Socket.IO
// The actual Socket.IO server is initialized in server.ts
// This endpoint exists to provide information about the WebSocket connection
export async function GET() {
  return NextResponse.json({
    message: "Socket.IO server is running",
    path: "/api/socket",
    info: "Connect your Socket.IO client to this path",
  });
}
