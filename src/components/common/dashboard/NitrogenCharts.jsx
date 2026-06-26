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
import { CHART_COLORS } from '@/constants/colors';

/**
 * Extended Chart Colors for Nitrogen-specific charts
 * Combines centralized CHART_COLORS with nitrogen-specific mapping
 */
const NITROGEN_CHART_COLORS = {
  nitrogen: CHART_COLORS.primary,  // green for nitrogen
  spad: CHART_COLORS.secondary,    // blue for SPAD
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
  const color = NITROGEN_CHART_COLORS[dataKey] || CHART_COLORS.primary;
  const label = dataKey === 'nitrogen' ? 'Nitrogen (%)' : 'SPAD';

  return (
    <div className={`h-${height / 4} ${className}`} style={{ height }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis dataKey={xAxisKey} fontSize={12} className="dark:fill-gray-400" />
            <YAxis
              fontSize={12}
              className="dark:fill-gray-400"
              domain={dataKey === 'nitrogen' ? [(dataMin) => Math.max(0, parseFloat((dataMin - 0.2).toFixed(2))), (dataMax) => parseFloat((dataMax + 0.2).toFixed(2))] : [(dataMin) => Math.max(0, Math.floor(dataMin - 5)), (dataMax) => Math.ceil(dataMax + 5)]}
              allowDataOverflow={true}
            />
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
  const color = NITROGEN_CHART_COLORS[dataKey] || CHART_COLORS.primary;
  const label = dataKey === 'nitrogen' ? 'Nitrogen (%)' : 'SPAD';

  return (
    <div className={className} style={{ height }}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
            <XAxis dataKey={xAxisKey} fontSize={12} className="dark:fill-gray-400" />
            <YAxis
              fontSize={12}
              className="dark:fill-gray-400"
              domain={dataKey === 'nitrogen' ? [(dataMin) => Math.max(0, parseFloat((dataMin - 0.2).toFixed(2))), (dataMax) => parseFloat((dataMax + 0.2).toFixed(2))] : [(dataMin) => Math.max(0, Math.floor(dataMin - 5)), (dataMax) => Math.ceil(dataMax + 5)]}
              allowDataOverflow={true}
            />
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
