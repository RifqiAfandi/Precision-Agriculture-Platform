import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/**
 * Chart Colors Configuration
 * Centralized color palette for consistent chart styling
 */
export const CHART_COLORS = {
  nitrogen: '#22c55e', // green-500
  spad: '#3b82f6',     // blue-500
  primary: '#16a34a',  // green-600
  secondary: '#2563eb', // blue-600
  warning: '#f59e0b',  // amber-500
  danger: '#ef4444',   // red-500
};

/**
 * Default Tooltip Styles
 * Consistent styling for chart tooltips with dark mode support
 */
export const DEFAULT_TOOLTIP_STYLE = {
  fontSize: 12,
  backgroundColor: 'var(--background)',
  borderColor: 'var(--border)',
  color: 'var(--foreground)',
};

/**
 * Nitrogen Line Chart Component
 * 
 * Pre-configured line chart for nitrogen/SPAD time series data
 * 
 * @example
 * <NitrogenLineChart
 *   data={chartData}
 *   dataKey="nitrogen"
 *   height={256}
 * />
 */
export function NitrogenLineChart({
  data,
  dataKey = 'nitrogen',
  xAxisKey = 'time',
  height = 256,
  showLegend = true,
  className = '',
}) {
  const color = dataKey === 'nitrogen' ? CHART_COLORS.nitrogen : CHART_COLORS.spad;
  const label = dataKey === 'nitrogen' ? 'Nitrogen (%)' : 'SPAD';

  return (
    <div className={`h-${height / 4} ${className}`} style={{ height }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis dataKey={xAxisKey} fontSize={12} className="dark:fill-gray-400" />
            <YAxis fontSize={12} className="dark:fill-gray-400" />
            <Tooltip
              contentStyle={DEFAULT_TOOLTIP_STYLE}
              formatter={(value) => [value, label]}
            />
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={label}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>Memuat data...</p>
        </div>
      )}
    </div>
  );
}

NitrogenLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.oneOf(['nitrogen', 'spad']),
  xAxisKey: PropTypes.string,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * Nitrogen Bar Chart Component
 * 
 * Pre-configured bar chart for nitrogen/SPAD comparison data
 * 
 * @example
 * <NitrogenBarChart
 *   data={weeklyData}
 *   dataKey="nitrogen"
 *   height={256}
 * />
 */
export function NitrogenBarChart({
  data,
  dataKey = 'nitrogen',
  xAxisKey = 'name',
  height = 256,
  showLegend = true,
  className = '',
}) {
  const color = dataKey === 'nitrogen' ? CHART_COLORS.nitrogen : CHART_COLORS.spad;
  const label = dataKey === 'nitrogen' ? 'Nitrogen (%)' : 'SPAD';

  return (
    <div className={className} style={{ height }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis dataKey={xAxisKey} fontSize={12} className="dark:fill-gray-400" />
            <YAxis fontSize={12} className="dark:fill-gray-400" />
            <Tooltip
              contentStyle={DEFAULT_TOOLTIP_STYLE}
              formatter={(value) => [value, label]}
            />
            {showLegend && <Legend />}
            <Bar
              dataKey={dataKey}
              fill={color}
              name={label}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>Memuat data...</p>
        </div>
      )}
    </div>
  );
}

NitrogenBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.oneOf(['nitrogen', 'spad']),
  xAxisKey: PropTypes.string,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  className: PropTypes.string,
};

export default { NitrogenLineChart, NitrogenBarChart };
