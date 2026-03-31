import { prisma } from "@/lib/prisma";

interface FriendGoingUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface FriendsGoingResult {
  friendsGoing: FriendGoingUser[];
  friendsGoingCount: number;
}

export async function getFriendsGoing(
  eventId: string,
  userId?: string
): Promise<FriendsGoingResult> {
  if (!userId) {
    return { friendsGoing: [], friendsGoingCount: 0 };
  }

  // Get user's accepted friendships
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { senderId: userId, status: "ACCEPTED" },
        { receiverId: userId, status: "ACCEPTED" },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  const friendIds = friendships.map((f) =>
    f.senderId === userId ? f.receiverId : f.senderId
  );

  if (friendIds.length === 0) {
    return { friendsGoing: [], friendsGoingCount: 0 };
  }

  // Get friends participating in this event
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      userId: { in: friendIds },
      status: "going",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    take: 10,
  });

  const friendsGoing = participations.map((p) => p.user);

  const friendsGoingCount = await prisma.participation.count({
    where: {
      eventId,
      userId: { in: friendIds },
      status: "going",
    },
  });

  return { friendsGoing, friendsGoingCount };
}
