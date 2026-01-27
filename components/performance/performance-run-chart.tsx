"use client";

import { useMemo } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { formatPace } from "@/lib/performance/scoring";

interface ChartPoint {
  date: string;
  pace: number;
  distanceKm: number;
}

interface PerformanceRunChartProps {
  data: ChartPoint[];
}

export function PerformanceRunChart({ data }: PerformanceRunChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      // Format date for display
      dateFormatted: new Date(d.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      // Pace formatted for tooltip
      paceFormatted: formatPace(d.pace),
    }));
  }, [data]);

  if (data.length < 2) {
    return null;
  }

  const paces = data.map((d) => d.pace);
  const minPace = Math.min(...paces);
  const maxPace = Math.max(...paces);
  const padding = (maxPace - minPace) * 0.1 || 30;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="paceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--muted-foreground))"
            opacity={0.2}
          />
          <XAxis
            dataKey="dateFormatted"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[maxPace + padding, minPace - padding]}
            tickFormatter={(value: number) => formatPace(value)}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as (typeof chartData)[0];
                return (
                  <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
                    <p className="text-sm font-medium">{data.dateFormatted}</p>
                    <p className="text-sm text-muted-foreground">
                      Pace:{" "}
                      <span className="font-medium text-foreground">
                        {data.paceFormatted}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Distance:{" "}
                      <span className="font-medium text-foreground">
                        {data.distanceKm.toFixed(1)} km
                      </span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="pace"
            stroke="none"
            fill="url(#paceGradient)"
          />
          <Line
            type="monotone"
            dataKey="pace"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
