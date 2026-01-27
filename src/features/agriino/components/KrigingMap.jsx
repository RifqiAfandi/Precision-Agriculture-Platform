/**
 * KrigingMap.jsx - Backward Compatibility Export
 * 
 * This file maintains backward compatibility for imports from the original location.
 * The component has been refactored and split into smaller modules in the ./kriging folder.
 * 
 * Original: 1588 lines -> Refactored to multiple files:
 * - ./kriging/KrigingMapContainer.jsx (~200 lines) - Main container
 * - ./kriging/panels/DeviceDetailsPanel.jsx (~130 lines) - Device details
 * - ./kriging/panels/AnalysisResultsPanel.jsx (~230 lines) - Analysis results
 * - ./kriging/MapLegend.jsx (~50 lines) - Map legend component
 * - ./kriging/DeviceListCard.jsx (~90 lines) - Device list
 * - ./kriging/hooks/useKrigingMap.js (~270 lines) - Map logic hook
 * - ./kriging/utils/krigingUtils.js (~420 lines) - Kriging utilities
 * - ./kriging/utils/mapHelpers.js (~230 lines) - Map helper functions
 * 
 * @deprecated Import from './kriging' instead for explicit imports
 */

// Re-export everything from the new module structure
export * from './kriging';

// Default export for backward compatibility
export { KrigingMapContainer as KrigingMap } from './kriging';
export { default } from './kriging';
