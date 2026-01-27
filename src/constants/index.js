/**
 * Constants Module Index
 * 
 * Central export point for all application constants.
 * Import from '@/constants' for easy access.
 */

// Threshold constants and functions
export {
  NITROGEN_THRESHOLDS,
  DEFAULT_DEFICIENT_THRESHOLD,
  DEFAULT_SUBNORMAL_THRESHOLD,
  DEFAULT_NORMAL_THRESHOLD,
  DEFAULT_LOW_THRESHOLD,
  DEFAULT_HIGH_THRESHOLD,
  DEFAULT_INFLUENCE_RADIUS_KM,
  DEFAULT_GRID_RESOLUTION,
  DEFAULT_MAX_NEIGHBORS,
  DEFAULT_MIN_NEIGHBORS,
  VARIOGRAM_MODELS,
  classifyNitrogenValue,
  getClassificationLabelId,
  getThresholdInfo,
} from './thresholds';

// Color constants and functions
export {
  MARKER_COLORS,
  CLASSIFICATION_BG_COLORS,
  KRIGING_GRID_COLORS,
  CHART_COLORS,
  CHART_GRADIENTS,
  DEVICE_STATUS_COLORS,
  ALERT_COLORS,
  getMarkerColor,
  getClassificationFillColor,
  getClassificationBgColor,
  getClassificationLabel,
} from './colors';

// Configuration constants
export {
  MAP_CONFIG,
  API_CONFIG,
  FIREBASE_CONFIG,
  PAGINATION_CONFIG,
  REFRESH_INTERVALS,
  TOAST_DURATIONS,
  DATA_LIMITS,
  FEATURE_FLAGS,
  getMapStyleUrl,
} from './config';
