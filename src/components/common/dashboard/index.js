/**
 * Shared Dashboard Components
 * 
 * Reusable components for dashboard views across the application
 * Extracted from RealTimeMonitoring, WeeklyHistoryTable, KrigingDashboard
 */

export { StatsOverview } from './StatsOverview';
export { ClassificationDistribution } from './ClassificationDistribution';
export { ConnectionStatus } from './ConnectionStatus';
export { DeviceCard, DeviceGrid } from './DeviceGrid';
export { ChartToggle, CHART_DATA_OPTIONS } from './ChartToggle';
export { NitrogenLegend } from './NitrogenLegend';
export { 
  NitrogenLineChart, 
  NitrogenBarChart,
  DEFAULT_TOOLTIP_STYLE 
} from './NitrogenCharts';

// Re-export CHART_COLORS from constants for backward compatibility
export { CHART_COLORS } from '@/constants/colors';
