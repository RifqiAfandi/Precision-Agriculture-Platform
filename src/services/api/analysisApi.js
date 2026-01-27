/**
 * Analysis API - Kriging analysis endpoints
 * 
 * Handles Kriging interpolation analysis, quick analysis,
 * and analysis results management.
 */

import apiClient from './apiClient';

/**
 * Analysis API methods
 */
export const analysisApi = {
  /**
   * Perform Kriging analysis on nitrogen data
   * @param {Object} analysisData - Analysis request data
   * @param {Array} analysisData.device_data - Array of device readings with lat, lng, nitrogen
   * @param {number} analysisData.area_id - Area ID (optional)
   * @param {string} analysisData.area_name - Area name (optional)
   * @param {number} analysisData.grid_resolution - Grid resolution (default: 20)
   * @param {string} analysisData.variogram_model - Variogram model (default: 'spherical')
   * @param {number} analysisData.low_threshold - Low nitrogen threshold (default: 1.5)
   * @param {number} analysisData.high_threshold - High nitrogen threshold (default: 2.5)
   * @param {number} analysisData.min_lat - Minimum latitude bound
   * @param {number} analysisData.max_lat - Maximum latitude bound
   * @param {number} analysisData.min_lng - Minimum longitude bound
   * @param {number} analysisData.max_lng - Maximum longitude bound
   * @returns {Promise<Object>} Kriging analysis result
   */
  async performKriging(analysisData) {
    return apiClient.request('/agriino/analyze/', {
      method: 'POST',
      body: JSON.stringify(analysisData),
      skipAuth: true,
    });
  },

  /**
   * Quick Kriging analysis with simplified request format
   * @param {Array} points - Array of {lat, lng, nitrogen} objects
   * @param {Object} options - Optional parameters
   * @param {number} options.resolution - Grid resolution (default: 20)
   * @param {string} options.model - Variogram model (default: 'spherical')
   * @param {number} options.lowThreshold - Low threshold (default: 1.5)
   * @param {number} options.highThreshold - High threshold (default: 2.5)
   * @returns {Promise<Object>} Kriging analysis result
   */
  async quickKriging(points, options = {}) {
    return apiClient.request('/agriino/quick-analyze/', {
      method: 'POST',
      body: JSON.stringify({
        points,
        resolution: options.resolution || 20,
        model: options.model || 'spherical',
        low_threshold: options.lowThreshold || 1.5,
        high_threshold: options.highThreshold || 2.5,
      }),
      skipAuth: true,
    });
  },

  /**
   * Get all analysis results
   * @returns {Promise<Array>} List of analysis results
   */
  async getResults() {
    const data = await apiClient.get('/agriino/analysis-results/');
    return Array.isArray(data) ? data : (data.results || []);
  },

  /**
   * Get analysis result by ID
   * @param {string|number} analysisId - Analysis result ID
   * @returns {Promise<Object>} Analysis result details
   */
  async getResultById(analysisId) {
    return apiClient.get(`/agriino/analysis-results/${analysisId}/`);
  },
};

/**
 * Dashboard/Stats API methods
 */
export const statsApi = {
  /**
   * Get Agriino dashboard statistics
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats() {
    return apiClient.get('/agriino/stats/');
  },

  /**
   * Get recent alerts (plants needing attention)
   * @returns {Promise<Array>} List of alerts
   */
  async getAlerts() {
    return apiClient.get('/agriino/alerts/');
  },

  /**
   * Get API health status
   * @returns {Promise<Object>} Health status
   */
  async getHealth() {
    return apiClient.request('/agriino/health/', {
      method: 'GET',
      skipAuth: true,
    });
  },
};

export default analysisApi;
