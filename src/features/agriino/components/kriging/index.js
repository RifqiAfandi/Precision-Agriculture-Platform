/**
 * Kriging Map Components
 * 
 * This module contains all components related to Kriging analysis visualization.
 * Split from the original KrigingMap.jsx (1588 lines) for better maintainability.
 * 
 * Structure:
 * - KrigingMapContainer: Main container (~200 lines)
 * - panels/: DeviceDetailsPanel, AnalysisResultsPanel
 * - hooks/: useKrigingMap custom hook
 * - utils/: krigingUtils, mapHelpers
 * - MapLegend, DeviceListCard: UI components
 */

// Panels
export { DeviceDetailsPanel } from './panels/DeviceDetailsPanel';
export { AnalysisResultsPanel } from './panels/AnalysisResultsPanel';

// Map Components
export { MapLegend } from './MapLegend';
export { DeviceListCard } from './DeviceListCard';

// Utilities
export * from './utils/krigingUtils';
export * from './utils/mapHelpers';

// Hooks
export { useKrigingMap } from './hooks/useKrigingMap';

// Main Component - default export for backward compatibility
export { KrigingMapContainer } from './KrigingMapContainer';
export { KrigingMapContainer as KrigingMap } from './KrigingMapContainer';
export { default } from './KrigingMapContainer';
