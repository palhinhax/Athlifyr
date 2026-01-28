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

interface ChartPoint {
  date: string;
  e1rm: number;
}

interface PerformanceStrengthChartProps {
  data: ChartPoint[];
}

export function PerformanceStrengthChart({
  data,
}: PerformanceStrengthChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      // Format date for display
      dateFormatted: new Date(d.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data]);

  if (data.length < 2) {
    return null;
  }

  const e1rms = data.map((d) => d.e1rm);
  const minE1rm = Math.min(...e1rms);
  const maxE1rm = Math.max(...e1rms);
  const padding = (maxE1rm - minE1rm) * 0.1 || 5;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="e1rmGradient" x1="0" y1="0" x2="0" y2="1">
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
            domain={[minE1rm - padding, maxE1rm + padding]}
            tickFormatter={(value: number) => `${value.toFixed(0)}`}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={40}
            unit=" kg"
          />
          <Tooltip
            content={({
              active,
              payload,
            }: {
              active?: boolean;
              payload?: readonly unknown[];
            }) => {
              if (
                active &&
                payload &&
                payload.length &&
                typeof payload[0] === "object" &&
                payload[0] !== null &&
                "payload" in payload[0]
              ) {
                const data = (payload[0] as { payload: unknown })
                  .payload as (typeof chartData)[0];
                return (
                  <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
                    <p className="text-sm font-medium">{data.dateFormatted}</p>
                    <p className="text-sm text-muted-foreground">
                      e1RM:{" "}
                      <span className="font-medium text-foreground">
                        {data.e1rm.toFixed(1)} kg
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
            dataKey="e1rm"
            stroke="none"
            fill="url(#e1rmGradient)"
          />
          <Line
            type="monotone"
            dataKey="e1rm"
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
