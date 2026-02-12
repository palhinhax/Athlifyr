/**
 * Script to test push token authentication
 *
 * Run: npx ts-node scripts/test-push-token-auth.ts
 */

import { prisma } from "@/lib/prisma";
import { generateAccessToken } from "@/lib/jwt";

async function testPushTokenAuth() {
  console.log("🧪 Testing push token authentication...\n");

  // Find a test user
  const user = await prisma.user.findFirst({
    where: {
      email: { contains: "@" },
    },
  });

  if (!user) {
    console.error("❌ No user found in database");
    return;
  }

  console.log("✅ Test user found:", {
    id: user.id,
    email: user.email,
    name: user.name,
  });

  // Generate a JWT token
  const token = generateAccessToken({
    userId: user.id,
    email: user.email || "",
    role: user.role,
  });
  console.log("\n🔑 Generated JWT token:");
  console.log("Token:", token);
  console.log("Token length:", token.length);
  console.log("Token prefix:", token.substring(0, 50));

  console.log("\n📝 To test with curl:");
  console.log(`
curl -X POST https://www.athlifyr.com/api/push-tokens \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{
    "token": "ExponentPushToken[test-token-123]",
    "platform": "android",
    "deviceId": "test-device-123",
    "deviceName": "Test Device"
  }'
  `);

  console.log("\n💡 Next steps:");
  console.log(
    "1. Check server logs when mobile app tries to register push token"
  );
  console.log("2. Verify the auth token exists in SecureStore on mobile");
  console.log("3. Check if the token is being sent in Authorization header");
  console.log("4. Verify the token is not expired (check exp claim)");
}

testPushTokenAuth()
  .then(() => {
    console.log("\n✅ Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
