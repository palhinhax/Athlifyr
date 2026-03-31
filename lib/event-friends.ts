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

  // Get users that the current user follows (senderId = follower, receiverId = followed)
  const follows = await prisma.friendship.findMany({
    where: {
      senderId: userId,
      status: "ACCEPTED",
    },
    select: {
      receiverId: true,
    },
  });

  const followingIds = follows.map((f) => f.receiverId);

  if (followingIds.length === 0) {
    return { friendsGoing: [], friendsGoingCount: 0 };
  }

  // Get followed users participating in this event
  const participations = await prisma.participation.findMany({
    where: {
      eventId,
      userId: { in: followingIds },
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
      userId: { in: followingIds },
      status: "going",
    },
  });

  return { friendsGoing, friendsGoingCount };
}
