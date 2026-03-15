import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageVenue } from "@/lib/venues/authorization";

/**
 * GET /api/venues/[id]/analytics — Business intelligence data for venue dashboard
 * Only accessible by venue owners, admins, and app admins.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const venueId = (await params).id;

    const authResult = await canManageVenue(session.user.id, venueId);
    if (!authResult.authorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const periodDays = Math.min(
      parseInt(searchParams.get("days") || "30", 10),
      365
    );
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - periodDays);

    // Run all queries in parallel for performance
    const [
      membersByRole,
      memberGrowth,
      activeSubscriptions,
      subscriptionRevenue,
      bookingsByStatus,
      bookingsByDay,
      bookingsTrend,
      sessionsStats,
      popularSessions,
      productSales,
      topProducts,
      revenueByMonth,
      totalMembers,
      trialBookings,
    ] = await Promise.all([
      // 1. Members by role
      prisma.venueMember.groupBy({
        by: ["role"],
        where: { venueId, status: "ACTIVE" },
        _count: true,
      }),

      // 2. Member growth (new members per month, last 12 months)
      prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
        SELECT TO_CHAR("joinedAt", 'YYYY-MM') as month, COUNT(*) as count
        FROM "VenueMember"
        WHERE "venueId" = ${venueId}
          AND "status" = 'ACTIVE'
          AND "joinedAt" IS NOT NULL
          AND "joinedAt" >= NOW() - INTERVAL '12 months'
        GROUP BY TO_CHAR("joinedAt", 'YYYY-MM')
        ORDER BY month ASC
      `,

      // 3. Active subscriptions count
      prisma.venueSubscription.count({
        where: {
          venueId,
          status: { in: ["ACTIVE", "CANCELLING"] },
        },
      }),

      // 4. Subscription revenue (confirmed payments)
      prisma.venueSubscription.aggregate({
        where: {
          venueId,
          paymentStatus: "PAID",
          paymentAmount: { not: null },
        },
        _sum: { paymentAmount: true },
        _count: true,
      }),

      // 5. Bookings by status (within period)
      prisma.venueBooking.groupBy({
        by: ["status"],
        where: {
          venueId,
          createdAt: { gte: periodStart },
        },
        _count: true,
      }),

      // 6. Bookings by day of week (all time)
      prisma.$queryRaw<Array<{ day_of_week: number; count: bigint }>>`
        SELECT EXTRACT(DOW FROM s."startsAt")::int as day_of_week, COUNT(b.id) as count
        FROM "VenueBooking" b
        JOIN "VenueSession" s ON b."sessionId" = s.id
        WHERE b."venueId" = ${venueId}
          AND b."status" IN ('BOOKED', 'ATTENDED')
          AND b."createdAt" >= ${periodStart}
        GROUP BY EXTRACT(DOW FROM s."startsAt")
        ORDER BY day_of_week ASC
      `,

      // 7. Bookings trend (per week, last 12 weeks)
      prisma.$queryRaw<Array<{ week: string; count: bigint }>>`
        SELECT TO_CHAR(DATE_TRUNC('week', "createdAt"), 'YYYY-MM-DD') as week, COUNT(*) as count
        FROM "VenueBooking"
        WHERE "venueId" = ${venueId}
          AND "status" IN ('BOOKED', 'ATTENDED')
          AND "createdAt" >= NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', "createdAt")
        ORDER BY week ASC
      `,

      // 8. Sessions statistics (this period)
      prisma.venueSession.aggregate({
        where: {
          venueId,
          startsAt: { gte: periodStart },
        },
        _count: true,
        _avg: { capacity: true },
      }),

      // 9. Popular sessions by attendance (top 10)
      prisma.$queryRaw<
        Array<{
          title: string;
          session_count: bigint;
          total_bookings: bigint;
          avg_capacity: number | null;
        }>
      >`
        SELECT 
          s.title,
          COUNT(DISTINCT s.id) as session_count,
          COUNT(b.id) as total_bookings,
          AVG(s.capacity) as avg_capacity
        FROM "VenueSession" s
        LEFT JOIN "VenueBooking" b ON b."sessionId" = s.id AND b."status" IN ('BOOKED', 'ATTENDED')
        WHERE s."venueId" = ${venueId}
          AND s."startsAt" >= ${periodStart}
        GROUP BY s.title
        ORDER BY total_bookings DESC
        LIMIT 10
      `,

      // 10. Product sales totals (confirmed only)
      prisma.venueProductPurchase.aggregate({
        where: {
          venueId,
          status: "CONFIRMED",
        },
        _sum: { totalAmount: true },
        _count: true,
      }),

      // 11. Top-selling products
      prisma.$queryRaw<
        Array<{
          name: string;
          total_quantity: bigint;
          total_revenue: number;
        }>
      >`
        SELECT 
          p.name,
          SUM(pp.quantity)::bigint as total_quantity,
          SUM(pp."totalAmount") as total_revenue
        FROM "VenueProductPurchase" pp
        JOIN "VenueProduct" p ON pp."productId" = p.id
        WHERE pp."venueId" = ${venueId}
          AND pp.status = 'CONFIRMED'
        GROUP BY p.name
        ORDER BY total_revenue DESC
        LIMIT 10
      `,

      // 12. Revenue by month (subscriptions + products, last 12 months)
      prisma.$queryRaw<
        Array<{
          month: string;
          subscription_revenue: number;
          product_revenue: number;
        }>
      >`
        SELECT 
          months.month,
          COALESCE(sub_rev.revenue, 0) as subscription_revenue,
          COALESCE(prod_rev.revenue, 0) as product_revenue
        FROM (
          SELECT TO_CHAR(generate_series(
            DATE_TRUNC('month', NOW() - INTERVAL '11 months'),
            DATE_TRUNC('month', NOW()),
            '1 month'
          ), 'YYYY-MM') as month
        ) months
        LEFT JOIN (
          SELECT TO_CHAR("paymentConfirmedAt", 'YYYY-MM') as month,
            SUM("paymentAmount") as revenue
          FROM "VenueSubscription"
          WHERE "venueId" = ${venueId}
            AND "paymentStatus" = 'PAID'
            AND "paymentAmount" IS NOT NULL
            AND "paymentConfirmedAt" >= NOW() - INTERVAL '12 months'
          GROUP BY TO_CHAR("paymentConfirmedAt", 'YYYY-MM')
        ) sub_rev ON months.month = sub_rev.month
        LEFT JOIN (
          SELECT TO_CHAR("confirmedAt", 'YYYY-MM') as month,
            SUM("totalAmount") as revenue
          FROM "VenueProductPurchase"
          WHERE "venueId" = ${venueId}
            AND status = 'CONFIRMED'
            AND "confirmedAt" >= NOW() - INTERVAL '12 months'
          GROUP BY TO_CHAR("confirmedAt", 'YYYY-MM')
        ) prod_rev ON months.month = prod_rev.month
        ORDER BY months.month ASC
      `,

      // 13. Total members (all statuses)
      prisma.venueMember.groupBy({
        by: ["status"],
        where: { venueId },
        _count: true,
      }),

      // 14. Trial bookings count
      prisma.venueBooking.count({
        where: {
          venueId,
          bookingType: "TRIAL",
          createdAt: { gte: periodStart },
        },
      }),
    ]);

    // Calculate attendance rate
    const totalBookingsInPeriod = bookingsByStatus.reduce(
      (sum, b) => sum + b._count,
      0
    );
    const attendedBookings =
      bookingsByStatus.find((b) => b.status === "ATTENDED")?._count || 0;
    const noShowBookings =
      bookingsByStatus.find((b) => b.status === "NO_SHOW")?._count || 0;
    const cancelledBookings =
      bookingsByStatus.find((b) => b.status === "CANCELLED")?._count || 0;
    const attendanceRate =
      attendedBookings + noShowBookings > 0
        ? Math.round(
            (attendedBookings / (attendedBookings + noShowBookings)) * 100
          )
        : null;

    // Serialize bigint values
    const serializeBigInt = <T extends Record<string, unknown>>(
      arr: T[]
    ): T[] =>
      arr.map((item) => {
        const serialized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(item)) {
          serialized[key] = typeof value === "bigint" ? Number(value) : value;
        }
        return serialized as T;
      });

    return NextResponse.json({
      period: { days: periodDays, start: periodStart.toISOString() },
      members: {
        byRole: membersByRole.map((m) => ({
          role: m.role,
          count: m._count,
        })),
        byStatus: totalMembers.map((m) => ({
          status: m.status,
          count: m._count,
        })),
        growth: serializeBigInt(memberGrowth),
        totalActive: membersByRole.reduce((sum, m) => sum + m._count, 0),
      },
      subscriptions: {
        active: activeSubscriptions,
        totalPaid: subscriptionRevenue._count,
        totalRevenue: subscriptionRevenue._sum.paymentAmount || 0,
      },
      bookings: {
        byStatus: bookingsByStatus.map((b) => ({
          status: b.status,
          count: b._count,
        })),
        byDayOfWeek: serializeBigInt(bookingsByDay),
        trend: serializeBigInt(bookingsTrend),
        total: totalBookingsInPeriod,
        attended: attendedBookings,
        noShow: noShowBookings,
        cancelled: cancelledBookings,
        attendanceRate,
        trials: trialBookings,
      },
      sessions: {
        total: sessionsStats._count,
        avgCapacity: sessionsStats._avg.capacity
          ? Math.round(sessionsStats._avg.capacity)
          : null,
        popular: serializeBigInt(popularSessions),
      },
      products: {
        totalSales: productSales._count,
        totalRevenue: productSales._sum.totalAmount || 0,
        topProducts: serializeBigInt(topProducts),
      },
      revenue: {
        monthly: revenueByMonth.map((m) => ({
          month: m.month,
          subscriptions: Number(m.subscription_revenue) || 0,
          products: Number(m.product_revenue) || 0,
          total:
            (Number(m.subscription_revenue) || 0) +
            (Number(m.product_revenue) || 0),
        })),
        totalSubscriptions: subscriptionRevenue._sum.paymentAmount || 0,
        totalProducts: productSales._sum.totalAmount || 0,
        grandTotal:
          (subscriptionRevenue._sum.paymentAmount || 0) +
          (productSales._sum.totalAmount || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching venue analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
