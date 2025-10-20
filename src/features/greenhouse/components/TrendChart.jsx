import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * TrendChart component displays 24-hour environmental parameter trends
 * Uses Recharts for responsive line chart visualization
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Chart title
 * @param {string} [props.description] - Chart description
 * @param {Array<Object>} props.data - Chart data points
 * @param {Array<Object>} props.lines - Line configuration
 * @param {string} props.lines[].dataKey - Data key to plot
 * @param {string} props.lines[].stroke - Line color
 * @param {string} props.lines[].name - Line label
 * @param {number} [props.height=256] - Chart height in pixels
 * 
 * @example
 * <TrendChart
 *   title="Tren 24 Jam Terakhir"
 *   description="Suhu, kelembaban, dan CO₂ level"
 *   data={hourlyData}
 *   lines={[
 *     { dataKey: "insideTemp", stroke: "#ef4444", name: "Suhu (°C)" },
 *     { dataKey: "humidity", stroke: "#3b82f6", name: "Kelembaban (%)" },
 *     { dataKey: "co2", stroke: "#8b5cf6", name: "CO₂ (ppm)" }
 *   ]}
 * />
 */
export function TrendChart({
  title,
  description,
  data,
  lines,
  height = 256,
}) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  strokeWidth={2}
                  name={line.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
