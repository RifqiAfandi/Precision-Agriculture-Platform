/**
 * Nitrogen Classification Thresholds and Constants
 * 
 * This module contains all threshold values used for nitrogen level
 * classification in the Precision Agriculture Platform.
 * 
 * Classification Categories (based on nitrogen percentage):
 * - deficient: <1.80% (Red) - Needs immediate attention
 * - subnormal: 1.80-2.71% (Orange) - Below optimal
 * - normal: 2.71-3.31% (Yellow) - Optimal range
 * - high: >3.31% (Green) - Above optimal
 */

// =============================================================================
// NITROGEN CLASSIFICATION THRESHOLDS
// =============================================================================

/**
 * Default threshold values for nitrogen classification
 */
export const DEFAULT_DEFICIENT_THRESHOLD = 1.80;
export const DEFAULT_SUBNORMAL_THRESHOLD = 2.71;
export const DEFAULT_NORMAL_THRESHOLD = 3.31;

// Legacy thresholds for backward compatibility
export const DEFAULT_LOW_THRESHOLD = 1.80;
export const DEFAULT_HIGH_THRESHOLD = 3.31;

/**
 * Complete nitrogen threshold configuration
 * Used throughout the application for classification
 */
export const NITROGEN_THRESHOLDS = {
  deficient: {
    min: 0,
    max: DEFAULT_DEFICIENT_THRESHOLD,
    label: 'Deficient',
    labelId: 'Defisien',
    description: 'Needs immediate nitrogen supplementation',
  },
  subnormal: {
    min: DEFAULT_DEFICIENT_THRESHOLD,
    max: DEFAULT_SUBNORMAL_THRESHOLD,
    label: 'Subnormal',
    labelId: 'Subnormal',
    description: 'Below optimal, consider fertilization',
  },
  normal: {
    min: DEFAULT_SUBNORMAL_THRESHOLD,
    max: DEFAULT_NORMAL_THRESHOLD,
    label: 'Normal',
    labelId: 'Normal',
    description: 'Optimal nitrogen levels',
  },
  high: {
    min: DEFAULT_NORMAL_THRESHOLD,
    max: Infinity,
    label: 'High',
    labelId: 'Tinggi',
    description: 'Above optimal, reduce fertilization',
  },
};


// =============================================================================
// KRIGING ANALYSIS PARAMETERS
// =============================================================================

/**
 * Default influence radius in kilometers (0.015 km = 15 meters)
 * Reduced for more localized device influence
 */
export const DEFAULT_INFLUENCE_RADIUS_KM = 0.015;

/**
 * Default grid resolution for Kriging interpolation
 */
export const DEFAULT_GRID_RESOLUTION = 50;

/**
 * Search neighborhood parameters for local Kriging
 */
export const DEFAULT_MAX_NEIGHBORS = 12;
export const DEFAULT_MIN_NEIGHBORS = 3;

/**
 * Available variogram models for Kriging analysis
 */
export const VARIOGRAM_MODELS = ['spherical', 'exponential', 'gaussian', 'linear'];


// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Classify a nitrogen value based on thresholds
 * 
 * @param {number} value - Nitrogen percentage value
 * @returns {string} Classification: 'deficient', 'subnormal', 'normal', or 'high'
 */
export function classifyNitrogenValue(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'unknown';
  }
  
  if (value < DEFAULT_DEFICIENT_THRESHOLD) {
    return 'deficient';
  } else if (value < DEFAULT_SUBNORMAL_THRESHOLD) {
    return 'subnormal';
  } else if (value < DEFAULT_NORMAL_THRESHOLD) {
    return 'normal';
  } else {
    return 'high';
  }
}

/**
 * Get the label for a classification in Indonesian
 * 
 * @param {string} classification - Classification string
 * @returns {string} Indonesian label
 */
export function getClassificationLabelId(classification) {
  const threshold = NITROGEN_THRESHOLDS[classification];
  return threshold?.labelId || 'Unknown';
}

/**
 * Get threshold info for a classification
 * 
 * @param {string} classification - Classification string
 * @returns {object} Threshold configuration object
 */
export function getThresholdInfo(classification) {
  return NITROGEN_THRESHOLDS[classification] || null;
}
