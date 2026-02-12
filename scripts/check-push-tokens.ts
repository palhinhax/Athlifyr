import { prisma } from "../lib/prisma";

async function checkPushTokens() {
  console.log("🔍 Checking push tokens in database...\n");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      pushTokens: {
        select: {
          id: true,
          token: true,
          platform: true,
          deviceName: true,
          isActive: true,
          lastSeenAt: true,
          createdAt: true,
        },
      },
    },
  });

  console.log(`Found ${users.length} users:\n`);

  users.forEach((user) => {
    console.log(`👤 ${user.name} (${user.email})`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Push Tokens: ${user.pushTokens.length}`);

    if (user.pushTokens.length > 0) {
      user.pushTokens.forEach((token, index) => {
        console.log(`\n   📱 Token ${index + 1}:`);
        console.log(`      ID: ${token.id}`);
        console.log(`      Platform: ${token.platform}`);
        console.log(`      Device: ${token.deviceName || "N/A"}`);
        console.log(`      Active: ${token.isActive ? "✅" : "❌"}`);
        console.log(`      Token: ${token.token.substring(0, 20)}...`);
        console.log(`      Created: ${token.createdAt.toLocaleString()}`);
        console.log(`      Last Seen: ${token.lastSeenAt.toLocaleString()}`);
      });
    } else {
      console.log("   ❌ No push tokens registered");
    }

    console.log("\n---\n");
  });

  await prisma.$disconnect();
}

checkPushTokens().catch(console.error);
