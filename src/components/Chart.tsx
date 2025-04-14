
import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    name?: string;
    date?: string;
    value?: number;
    price?: number;
  }[];
  xAxis?: string;
  yAxis?: string;
  height?: number;
  strokeColor?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  className?: string;
}

export function Chart({
  data,
  xAxis = "date",
  yAxis = "price",
  height = 400,
  strokeColor = "#118AB2",
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  showGrid = false,
  className,
  ...props
}: ChartProps) {
  // Format large numbers
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  // Format date for tooltip
  const formatTooltipDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className={cn("p-4", className)} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          {showGrid && (
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}

          {showXAxis && (
            <XAxis
              dataKey={xAxis}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: "#888888", fontSize: 12 }}
              tickFormatter={(value) => {
                // Short date format for x-axis
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
          )}

          {showYAxis && (
            <YAxis
              dataKey={yAxis}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: "#888888", fontSize: 12 }}
              domain={["auto", "auto"]}
              tickFormatter={formatYAxis}
            />
          )}

          {showTooltip && (
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              labelFormatter={formatTooltipDate}
              contentStyle={{
                backgroundColor: "#fff",
                borderColor: "#e2e8f0",
                borderRadius: "6px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey={yAxis}
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: strokeColor, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
