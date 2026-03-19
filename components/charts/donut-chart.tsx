"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltipWrapper } from "./chart-helpers";

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  unitLabel: string;
}

/**
 * Reusable donut (inner-radius pie) chart with a standard tooltip.
 */
export function DonutChart({ data, colors, unitLabel }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => (
            <ChartTooltipWrapper active={active} payload={payload}>
              <p className="font-medium">{payload?.[0]?.name}</p>
              <p className="text-sm text-muted-foreground">
                {payload?.[0]?.value} {unitLabel}
              </p>
            </ChartTooltipWrapper>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
