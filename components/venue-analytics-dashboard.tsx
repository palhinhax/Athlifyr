"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartTooltipWrapper,
  ChartGradient,
  AXIS_TICK_STYLE,
  AXIS_TICK_STYLE_SM,
  CLEAN_AXIS_PROPS,
  GRID_PROPS,
} from "@/components/charts/chart-helpers";
import { DonutChart } from "@/components/charts/donut-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Users,
  TrendingUp,
  DollarSign,
  CalendarCheck,
  ShoppingBag,
  BarChart3,
  RefreshCw,
  UserPlus,
  UserCheck,
  CreditCard,
  Target,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Link } from "@/i18n/routing";

interface VenueAnalyticsDashboardProps {
  venueId: string;
  venueName: string;
  venueSlug: string;
}

interface AnalyticsData {
  period: { days: number; start: string };
  members: {
    byRole: Array<{ role: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
    growth: Array<{ month: string; count: number }>;
    totalActive: number;
  };
  subscriptions: {
    active: number;
    totalPaid: number;
    totalRevenue: number;
  };
  bookings: {
    byStatus: Array<{ status: string; count: number }>;
    byDayOfWeek: Array<{ day_of_week: number; count: number }>;
    trend: Array<{ week: string; count: number }>;
    total: number;
    attended: number;
    noShow: number;
    cancelled: number;
    attendanceRate: number | null;
    trials: number;
  };
  sessions: {
    total: number;
    avgCapacity: number | null;
    popular: Array<{
      title: string;
      session_count: number;
      total_bookings: number;
      avg_capacity: number | null;
    }>;
  };
  products: {
    totalSales: number;
    totalRevenue: number;
    topProducts: Array<{
      name: string;
      total_quantity: number;
      total_revenue: number;
    }>;
  };
  revenue: {
    monthly: Array<{
      month: string;
      subscriptions: number;
      products: number;
      total: number;
    }>;
    totalSubscriptions: number;
    totalProducts: number;
    grandTotal: number;
  };
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(220, 70%, 55%)",
  "hsl(280, 65%, 55%)",
  "hsl(340, 70%, 55%)",
];

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function VenueAnalyticsDashboard({
  venueId,
  venueName,
  venueSlug,
}: VenueAnalyticsDashboardProps) {
  const t = useTranslations("venues.analytics");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/venues/${venueId}/analytics?days=${period}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const result = await response.json();
      setData(result);
    } catch {
      setError(t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [venueId, period, t]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-8 w-8" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="mb-4 text-destructive">{error || t("fetchError")}</p>
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const memberRoleData = data.members.byRole.map((m) => ({
    name: t(`roles.${m.role}`),
    value: m.count,
  }));

  const bookingStatusData = data.bookings.byStatus.map((b) => ({
    name: t(`bookingStatuses.${b.status}`),
    value: b.count,
  }));

  const dayOfWeekData = DAY_KEYS.map((day, i) => ({
    name: t(`days.${day}`),
    bookings:
      data.bookings.byDayOfWeek.find((d) => d.day_of_week === i)?.count || 0,
  }));

  const formatMonth = (month: string) => {
    const [year, m] = month.split("-");
    return `${t(`months.m${parseInt(m)}`)} ${year.slice(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/venues/${venueSlug}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{venueName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t("periods.7days")}</SelectItem>
              <SelectItem value="30">{t("periods.30days")}</SelectItem>
              <SelectItem value="90">{t("periods.90days")}</SelectItem>
              <SelectItem value="180">{t("periods.180days")}</SelectItem>
              <SelectItem value="365">{t("periods.365days")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPICard
          icon={Users}
          label={t("kpi.activeMembers")}
          value={data.members.totalActive}
          color="text-blue-500"
        />
        <KPICard
          icon={UserCheck}
          label={t("kpi.activeSubscriptions")}
          value={data.subscriptions.active}
          color="text-green-500"
        />
        <KPICard
          icon={CalendarCheck}
          label={t("kpi.totalBookings")}
          value={data.bookings.total}
          color="text-purple-500"
        />
        <KPICard
          icon={Target}
          label={t("kpi.attendanceRate")}
          value={
            data.bookings.attendanceRate !== null
              ? `${data.bookings.attendanceRate}%`
              : "—"
          }
          color="text-amber-500"
        />
        <KPICard
          icon={ShoppingBag}
          label={t("kpi.productSales")}
          value={data.products.totalSales}
          color="text-pink-500"
        />
        <KPICard
          icon={DollarSign}
          label={t("kpi.totalRevenue")}
          value={`€${data.revenue.grandTotal.toFixed(0)}`}
          color="text-emerald-500"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t("tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            {t("tabs.members")}
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <CalendarCheck className="mr-2 h-4 w-4" />
            {t("tabs.bookings")}
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <DollarSign className="mr-2 h-4 w-4" />
            {t("tabs.revenue")}
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Clock className="mr-2 h-4 w-4" />
            {t("tabs.sessions")}
          </TabsTrigger>
        </TabsList>

        {/* ============== OVERVIEW TAB ============== */}
        <TabsContent value="overview" className="space-y-4">
          {/* Revenue chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                {t("charts.revenueOverTime")}
              </CardTitle>
              <CardDescription>
                {t("charts.revenueOverTimeDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={data.revenue.monthly}>
                    <defs>
                      <ChartGradient
                        id="subGradient"
                        color="hsl(var(--chart-1))"
                        startOpacity={0.3}
                      />
                      <ChartGradient
                        id="prodGradient"
                        color="hsl(var(--chart-2))"
                        startOpacity={0.3}
                      />
                    </defs>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                    />
                    <YAxis
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                      tickFormatter={(v: number) => `€${v}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => (
                        <ChartTooltipWrapper active={active} payload={payload}>
                          <p className="mb-1 font-medium">
                            {formatMonth(String(label ?? ""))}
                          </p>
                          {payload?.map((entry) => (
                            <p
                              key={entry.name}
                              className="text-sm"
                              style={{ color: entry.color as string }}
                            >
                              {entry.name === "subscriptions"
                                ? t("charts.subscriptions")
                                : t("charts.products")}
                              : €{Number(entry.value).toFixed(2)}
                            </p>
                          ))}
                        </ChartTooltipWrapper>
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="subscriptions"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#subGradient)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="products"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#prodGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Two columns: bookings trend + member growth */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-purple-500" />
                  {t("charts.bookingsTrend")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={data.bookings.trend}>
                      <CartesianGrid {...GRID_PROPS} />
                      <XAxis
                        dataKey="week"
                        tickFormatter={(v: string) => {
                          const d = new Date(v);
                          return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                        tick={AXIS_TICK_STYLE_SM}
                        {...CLEAN_AXIS_PROPS}
                      />
                      <YAxis
                        tick={AXIS_TICK_STYLE_SM}
                        {...CLEAN_AXIS_PROPS}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          const d = new Date(String(label));
                          return (
                            <ChartTooltipWrapper
                              active={active}
                              payload={payload}
                            >
                              <p className="mb-1 text-sm font-medium">
                                {t("charts.weekOf")} {d.getDate()}/
                                {d.getMonth() + 1}
                              </p>
                              <p className="text-sm text-purple-500">
                                {payload?.[0]?.value}{" "}
                                {t("charts.bookingsLabel")}
                              </p>
                            </ChartTooltipWrapper>
                          );
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-3))", r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                  {t("charts.memberGrowth")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data.members.growth}>
                      <CartesianGrid {...GRID_PROPS} />
                      <XAxis
                        dataKey="month"
                        tickFormatter={formatMonth}
                        tick={AXIS_TICK_STYLE_SM}
                        {...CLEAN_AXIS_PROPS}
                      />
                      <YAxis
                        tick={AXIS_TICK_STYLE_SM}
                        {...CLEAN_AXIS_PROPS}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => (
                          <ChartTooltipWrapper
                            active={active}
                            payload={payload}
                          >
                            <p className="mb-1 text-sm font-medium">
                              {formatMonth(String(label ?? ""))}
                            </p>
                            <p className="text-sm text-blue-500">
                              {payload?.[0]?.value} {t("charts.newMembers")}
                            </p>
                          </ChartTooltipWrapper>
                        )}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--chart-1))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============== MEMBERS TAB ============== */}
        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Members by role pie chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.membersByRole")}</CardTitle>
                <CardDescription>
                  {t("charts.membersByRoleDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <DonutChart
                    data={memberRoleData}
                    colors={CHART_COLORS}
                    unitLabel={t("charts.members")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Members by status */}
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.membersByStatus")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.members.byStatus.map((s) => {
                    const total = data.members.byStatus.reduce(
                      (sum, m) => sum + m.count,
                      0
                    );
                    const pct =
                      total > 0 ? Math.round((s.count / total) * 100) : 0;
                    return (
                      <div key={s.status} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{t(`memberStatuses.${s.status}`)}</span>
                          <span className="font-medium">
                            {s.count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Member growth over time (larger chart) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                {t("charts.memberGrowthDetailed")}
              </CardTitle>
              <CardDescription>
                {t("charts.memberGrowthDetailedDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={data.members.growth}>
                    <defs>
                      <ChartGradient
                        id="memberGradient"
                        color="hsl(var(--chart-1))"
                      />
                    </defs>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                    />
                    <YAxis
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => (
                        <ChartTooltipWrapper active={active} payload={payload}>
                          <p className="mb-1 font-medium">
                            {formatMonth(String(label ?? ""))}
                          </p>
                          <p className="text-sm text-blue-500">
                            {payload?.[0]?.value} {t("charts.newMembers")}
                          </p>
                        </ChartTooltipWrapper>
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#memberGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============== BOOKINGS TAB ============== */}
        <TabsContent value="bookings" className="space-y-4">
          {/* KPI row for bookings */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPICard
              icon={CalendarCheck}
              label={t("kpi.totalBookings")}
              value={data.bookings.total}
              color="text-purple-500"
            />
            <KPICard
              icon={UserCheck}
              label={t("kpi.attended")}
              value={data.bookings.attended}
              color="text-green-500"
            />
            <KPICard
              icon={Target}
              label={t("kpi.noShow")}
              value={data.bookings.noShow}
              color="text-red-500"
            />
            <KPICard
              icon={CreditCard}
              label={t("kpi.trials")}
              value={data.bookings.trials}
              color="text-amber-500"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Bookings by status pie chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.bookingsByStatus")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <DonutChart
                    data={bookingStatusData}
                    colors={CHART_COLORS}
                    unitLabel={t("charts.bookingsLabel")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bookings by day of week */}
            <Card>
              <CardHeader>
                <CardTitle>{t("charts.bookingsByDay")}</CardTitle>
                <CardDescription>
                  {t("charts.bookingsByDayDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={dayOfWeekData}>
                      <CartesianGrid {...GRID_PROPS} />
                      <XAxis
                        dataKey="name"
                        tick={AXIS_TICK_STYLE_SM}
                        {...CLEAN_AXIS_PROPS}
                      />
                      <YAxis
                        tick={AXIS_TICK_STYLE_SM}
                        {...CLEAN_AXIS_PROPS}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => (
                          <ChartTooltipWrapper
                            active={active}
                            payload={payload}
                          >
                            <p className="font-medium">
                              {
                                (
                                  payload?.[0]?.payload as Record<
                                    string,
                                    unknown
                                  >
                                )?.name as string
                              }
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payload?.[0]?.value} {t("charts.bookingsLabel")}
                            </p>
                          </ChartTooltipWrapper>
                        )}
                      />
                      <Bar
                        dataKey="bookings"
                        fill="hsl(var(--chart-3))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly trend (full width) */}
          <Card>
            <CardHeader>
              <CardTitle>{t("charts.weeklyBookingsTrend")}</CardTitle>
              <CardDescription>
                {t("charts.weeklyBookingsTrendDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={data.bookings.trend}>
                    <defs>
                      <ChartGradient
                        id="bookingGradient"
                        color="hsl(var(--chart-3))"
                      />
                    </defs>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis
                      dataKey="week"
                      tickFormatter={(v: string) => {
                        const d = new Date(v);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                    />
                    <YAxis
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        const d = new Date(String(label));
                        return (
                          <ChartTooltipWrapper
                            active={active}
                            payload={payload}
                          >
                            <p className="mb-1 text-sm font-medium">
                              {t("charts.weekOf")} {d.getDate()}/
                              {d.getMonth() + 1}
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: "hsl(var(--chart-3))" }}
                            >
                              {payload?.[0]?.value} {t("charts.bookingsLabel")}
                            </p>
                          </ChartTooltipWrapper>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--chart-3))"
                      fill="url(#bookingGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============== REVENUE TAB ============== */}
        <TabsContent value="revenue" className="space-y-4">
          {/* Revenue KPIs */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <KPICard
              icon={DollarSign}
              label={t("kpi.totalRevenue")}
              value={`€${data.revenue.grandTotal.toFixed(2)}`}
              color="text-emerald-500"
            />
            <KPICard
              icon={CreditCard}
              label={t("kpi.subscriptionRevenue")}
              value={`€${data.revenue.totalSubscriptions.toFixed(2)}`}
              color="text-blue-500"
            />
            <KPICard
              icon={ShoppingBag}
              label={t("kpi.productRevenue")}
              value={`€${data.revenue.totalProducts.toFixed(2)}`}
              color="text-pink-500"
            />
          </div>

          {/* Revenue chart (full) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                {t("charts.monthlyRevenue")}
              </CardTitle>
              <CardDescription>
                {t("charts.monthlyRevenueDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={data.revenue.monthly}>
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonth}
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                    />
                    <YAxis
                      tick={AXIS_TICK_STYLE}
                      {...CLEAN_AXIS_PROPS}
                      tickFormatter={(v: number) => `€${v}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => (
                        <ChartTooltipWrapper active={active} payload={payload}>
                          <p className="mb-2 font-medium">
                            {formatMonth(String(label ?? ""))}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "hsl(var(--chart-1))" }}
                          >
                            {t("charts.subscriptions")}: €
                            {Number(payload?.[0]?.value || 0).toFixed(2)}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "hsl(var(--chart-2))" }}
                          >
                            {t("charts.products")}: €
                            {Number(payload?.[1]?.value || 0).toFixed(2)}
                          </p>
                          <p className="mt-1 border-t pt-1 text-sm font-medium">
                            Total: €
                            {(
                              Number(payload?.[0]?.value || 0) +
                              Number(payload?.[1]?.value || 0)
                            ).toFixed(2)}
                          </p>
                        </ChartTooltipWrapper>
                      )}
                    />
                    <Bar
                      dataKey="subscriptions"
                      stackId="a"
                      fill="hsl(var(--chart-1))"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="products"
                      stackId="a"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top products table */}
          {data.products.topProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-pink-500" />
                  {t("charts.topProducts")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.products.topProducts.map((product, i) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.total_quantity} {t("charts.unitsSold")}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-semibold text-emerald-600">
                        €{product.total_revenue.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ============== SESSIONS TAB ============== */}
        <TabsContent value="sessions" className="space-y-4">
          {/* Sessions KPIs */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <KPICard
              icon={Clock}
              label={t("kpi.totalSessions")}
              value={data.sessions.total}
              color="text-indigo-500"
            />
            <KPICard
              icon={Users}
              label={t("kpi.avgCapacity")}
              value={data.sessions.avgCapacity ?? "—"}
              color="text-blue-500"
            />
            <KPICard
              icon={CalendarCheck}
              label={t("kpi.trials")}
              value={data.bookings.trials}
              color="text-amber-500"
            />
          </div>

          {/* Popular sessions */}
          {data.sessions.popular.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                  {t("charts.popularSessions")}
                </CardTitle>
                <CardDescription>
                  {t("charts.popularSessionsDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data.sessions.popular} layout="vertical">
                      <CartesianGrid {...GRID_PROPS} />
                      <XAxis
                        type="number"
                        tick={AXIS_TICK_STYLE}
                        {...CLEAN_AXIS_PROPS}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="title"
                        width={140}
                        tick={AXIS_TICK_STYLE}
                        {...CLEAN_AXIS_PROPS}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          const d = payload?.[0]?.payload as
                            | Record<string, unknown>
                            | undefined;
                          return (
                            <ChartTooltipWrapper
                              active={active}
                              payload={payload}
                            >
                              <p className="mb-1 font-medium">
                                {d?.title as string}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {d?.total_bookings as number}{" "}
                                {t("charts.bookingsLabel")} /{" "}
                                {d?.session_count as number}{" "}
                                {t("charts.sessionsLabel")}
                              </p>
                              {d?.avg_capacity != null && (
                                <p className="text-sm text-muted-foreground">
                                  {t("charts.avgCapacityLabel")}:{" "}
                                  {Math.round(d.avg_capacity as number)}
                                </p>
                              )}
                            </ChartTooltipWrapper>
                          );
                        }}
                      />
                      <Bar
                        dataKey="total_bookings"
                        fill="hsl(var(--chart-4))"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =====================================================================
// KPI Card component
// =====================================================================
function KPICard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Icon className={`h-8 w-8 shrink-0 ${color}`} />
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {label}
          </p>
          <p className="text-xl font-bold sm:text-2xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
