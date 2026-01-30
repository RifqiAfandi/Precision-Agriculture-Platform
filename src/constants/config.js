/**
 * Application Configuration Constants
 * 
 * This module contains global configuration values used throughout
 * the Precision Agriculture Platform frontend.
 */

// =============================================================================
// MAP CONFIGURATION
// =============================================================================

/**
 * MapTiler API configuration
 */
export const MAP_CONFIG = {
  // API Key - uses environment variable with fallback
  MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY || 'bedLj81C0j3GdguncpGN',
  
  // Default map center (Jember, East Java, Indonesia)
  DEFAULT_CENTER: {
    lng: 113.7176052,
    lat: -8.1653927,
  },
  
  // Default zoom level
  DEFAULT_ZOOM: 17,
  
  // Map style URL
  SATELLITE_STYLE: 'https://api.maptiler.com/maps/satellite/style.json',
  STREETS_STYLE: 'https://api.maptiler.com/maps/streets/style.json',
  
  // Bounds padding for fitBounds
  BOUNDS_PADDING: 50,
  
  // Coordinate precision for display
  COORDINATE_PRECISION: 6,
};

/**
 * Get full map style URL with API key
 * 
 * @param {string} style - Style type: 'satellite' or 'streets'
 * @returns {string} Full style URL with API key
 */
export function getMapStyleUrl(style = 'satellite') {
  const baseUrl = style === 'streets' ? MAP_CONFIG.STREETS_STYLE : MAP_CONFIG.SATELLITE_STYLE;
  return `${baseUrl}?key=${MAP_CONFIG.MAPTILER_API_KEY}`;
}


// =============================================================================
// API CONFIGURATION
// =============================================================================

/**
 * Backend API configuration
 */
export const API_CONFIG = {
  // Base URL - uses environment variable with fallback
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};


// =============================================================================
// FIREBASE CONFIGURATION
// =============================================================================

/**
 * Firebase configuration
 * Uses environment variables for security
 */
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


// =============================================================================
// UI CONFIGURATION
// =============================================================================

/**
 * Pagination defaults
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

/**
 * Data refresh intervals in milliseconds
 */
export const REFRESH_INTERVALS = {
  REAL_TIME: 5000,      // 5 seconds
  NORMAL: 30000,        // 30 seconds
  SLOW: 60000,          // 1 minute
  VERY_SLOW: 300000,    // 5 minutes
};

/**
 * Toast notification durations in milliseconds
 */
export const TOAST_DURATIONS = {
  SHORT: 2000,
  NORMAL: 4000,
  LONG: 6000,
};


// =============================================================================
// DATA LIMITS
// =============================================================================

/**
 * Data fetch and display limits
 */
export const DATA_LIMITS = {
  // Maximum data points to fetch
  MAX_DATA_POINTS: 100,
  
  // Maximum devices to display
  MAX_DEVICES_DISPLAY: 50,
  
  // Maximum history records
  MAX_HISTORY_RECORDS: 1000,
  
  // Chart data point limits
  MAX_CHART_POINTS: 50,
};


// =============================================================================
// FEATURE FLAGS
// =============================================================================

/**
 * Feature flags for enabling/disabling features
 */
export const FEATURE_FLAGS = {
  // Enable mock data when backend is unavailable
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  
  // Enable debug logging
  ENABLE_DEBUG: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',
  
  // Enable analytics
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};


// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

/**
 * Keys for localStorage persistence
 * Centralized to avoid key collisions and typos
 */
export const STORAGE_KEYS = {
  // Kriging area selection persistence
  KRIGING_SELECTED_AREA: 'precision-agriculture:kriging-selected-area',
  KRIGING_ANALYSIS_RESULT: 'precision-agriculture:kriging-analysis-result',
  
  // User preferences
  USER_PREFERENCES: 'precision-agriculture:user-preferences',
  THEME: 'precision-agriculture:theme',
  
  // Auth tokens (if needed)
  AUTH_TOKEN: 'precision-agriculture:auth-token',
  REFRESH_TOKEN: 'precision-agriculture:refresh-token',
};
