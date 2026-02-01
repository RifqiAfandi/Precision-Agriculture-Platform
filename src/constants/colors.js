/**
 * Color Constants for Precision Agriculture Platform
 * 
 * This module contains all color definitions used for:
 * - Nitrogen classification markers and zones
 * - Chart colors
 * - Status indicators
 */

// =============================================================================
// CLASSIFICATION COLORS (Nitrogen Status)
// =============================================================================

/**
 * Marker colors for map markers and classification badges
 * Used in KrigingMap, DeviceCard, and other components
 * Deficient: <1.8% | Subnormal: 1.8-2.71% | Normal: 2.71-3.31% | High: >3.31%
 */
export const MARKER_COLORS = {
  deficient: {
    fill: '#FF0000',
    border: '#CC0000',
    label: 'Deficient',
    labelId: 'Defisien',
  },
  subnormal: {
    fill: '#FF4500',
    border: '#CC3700',
    label: 'Subnormal',
    labelId: 'Subnormal',
  },
  normal: {
    fill: '#FF8C00',
    border: '#CC7000',
    label: 'Normal',
    labelId: 'Normal',
  },
  high: {
    fill: '#FFD700',
    border: '#CCAC00',
    label: 'High',
    labelId: 'Tinggi',
  },
  no_data: {
    fill: '#9ca3af',
    border: '#6b7280',
    label: 'No Data',
    labelId: 'Tidak Ada Data',
  },
  unknown: {
    fill: '#6b7280',
    border: '#4b5563',
    label: 'Unknown',
    labelId: 'Tidak Diketahui',
  },
};

/**
 * Background colors with transparency for classification zones
 * Used in statistics tables and zone indicators
 * Deficient: <1.8% | Subnormal: 1.8-2.71% | Normal: 2.71-3.31% | High: >3.31%
 */
export const CLASSIFICATION_BG_COLORS = {
  deficient: 'rgba(255, 0, 0, 0.2)',
  subnormal: 'rgba(255, 69, 0, 0.2)',
  normal: 'rgba(255, 140, 0, 0.2)',
  high: 'rgba(255, 215, 0, 0.2)',
  no_data: 'rgba(156, 163, 175, 0.2)',
};

/**
 * Kriging grid colors for map visualization
 * Deficient: <1.8% | Subnormal: 1.8-2.71% | Normal: 2.71-3.31% | High: >3.31%
 */
export const KRIGING_GRID_COLORS = {
  deficient: '#FF0000',
  subnormal: '#FF4500',
  normal: '#FF8C00',
  high: '#FFD700',
};


// =============================================================================
// CHART COLORS
// =============================================================================

/**
 * Colors for charts and graphs
 */
export const CHART_COLORS = {
  primary: '#22c55e',    // Green - main data
  secondary: '#3b82f6',  // Blue - secondary data
  tertiary: '#f59e0b',   // Amber - tertiary data
  quaternary: '#8b5cf6', // Purple - quaternary data
  danger: '#ef4444',     // Red - alerts/warnings
  muted: '#6b7280',      // Gray - inactive/muted
};

/**
 * Gradient colors for area charts
 */
export const CHART_GRADIENTS = {
  nitrogen: {
    start: 'rgba(34, 197, 94, 0.3)',
    end: 'rgba(34, 197, 94, 0)',
  },
  spad: {
    start: 'rgba(168, 85, 247, 0.3)',
    end: 'rgba(168, 85, 247, 0)',
  },
};


// =============================================================================
// STATUS COLORS
// =============================================================================

/**
 * Device status colors
 */
export const DEVICE_STATUS_COLORS = {
  online: '#22c55e',
  offline: '#ef4444',
  warning: '#f59e0b',
  maintenance: '#6b7280',
};

/**
 * Alert status colors
 */
export const ALERT_COLORS = {
  critical: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  success: '#22c55e',
};


// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get marker color configuration for a classification
 * 
 * @param {string} classification - Classification string
 * @returns {object} Color configuration with fill, border, label
 */
export function getMarkerColor(classification) {
  return MARKER_COLORS[classification] || MARKER_COLORS.unknown;
}

/**
 * Get fill color for a classification
 * 
 * @param {string} classification - Classification string
 * @returns {string} Fill color hex value
 */
export function getClassificationFillColor(classification) {
  const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;
  return colors.fill;
}

/**
 * Get background color for a classification
 * 
 * @param {string} classification - Classification string
 * @returns {string} Background color with transparency
 */
export function getClassificationBgColor(classification) {
  return CLASSIFICATION_BG_COLORS[classification] || CLASSIFICATION_BG_COLORS.no_data;
}

/**
 * Get classification label in Indonesian
 * 
 * @param {string} classification - Classification string
 * @returns {string} Indonesian label
 */
export function getClassificationLabel(classification) {
  const colors = MARKER_COLORS[classification] || MARKER_COLORS.unknown;
  return colors.labelId || colors.label || 'Unknown';
}
