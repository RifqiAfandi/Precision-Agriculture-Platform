/**
 * Plant API - Plant management endpoints
 * 
 * Handles CRUD operations for plants, history retrieval,
 * and readings management.
 */

import apiClient from './apiClient';

/**
 * Plant API methods
 */
export const plantApi = {
  /**
   * Get all plants
   * @returns {Promise<Array>} List of plants
   */
  async getAll() {
    const data = await apiClient.get('/agriino/plants/');
    // Handle pagination - return results array or data itself
    return Array.isArray(data) ? data : (data.results || []);
  },

  /**
   * Get plant by ID with history
   * @param {string|number} plantId - Plant ID
   * @returns {Promise<Object>} Plant details with history
   */
  async getById(plantId) {
    return apiClient.get(`/agriino/plants/${plantId}/`);
  },

  /**
   * Create new plant
   * @param {Object} plantData - Plant data
   * @param {string} plantData.name - Plant name
   * @param {string} plantData.species - Plant species
   * @param {string} plantData.device - Associated device ID
   * @returns {Promise<Object>} Created plant
   */
  async create(plantData) {
    return apiClient.post('/agriino/plants/', plantData);
  },

  /**
   * Update plant
   * @param {string|number} plantId - Plant ID
   * @param {Object} plantData - Plant data to update
   * @returns {Promise<Object>} Updated plant
   */
  async update(plantId, plantData) {
    return apiClient.patch(`/agriino/plants/${plantId}/`, plantData);
  },

  /**
   * Delete plant
   * @param {string|number} plantId - Plant ID
   * @returns {Promise<void>}
   */
  async delete(plantId) {
    return apiClient.delete(`/agriino/plants/${plantId}/`);
  },

  /**
   * Get plant history
   * @param {string|number} plantId - Plant ID
   * @param {number} days - Number of days (default: 7)
   * @param {number} limit - Max records (default: 100)
   * @returns {Promise<Array>} Plant history records
   */
  async getHistory(plantId, days = 7, limit = 100) {
    return apiClient.get(`/agriino/plants/${plantId}/history/?days=${days}&limit=${limit}`);
  },

  /**
   * Get plant's latest reading
   * @param {string|number} plantId - Plant ID
   * @returns {Promise<Object>} Latest reading data
   */
  async getLatestReading(plantId) {
    return apiClient.get(`/agriino/plants/${plantId}/latest_reading/`);
  },
};

/**
 * Readings API methods
 */
export const readingsApi = {
  /**
   * Get all readings
   * @returns {Promise<Array>} List of readings
   */
  async getAll() {
    return apiClient.get('/agriino/readings/');
  },

  /**
   * Get reading by ID
   * @param {string|number} readingId - Reading ID
   * @returns {Promise<Object>} Reading details
   */
  async getById(readingId) {
    return apiClient.get(`/agriino/readings/${readingId}/`);
  },

  /**
   * Create manual reading
   * @param {Object} readingData - Reading data
   * @param {string} readingData.plant - Plant ID
   * @param {number} readingData.nitrogen - Nitrogen value
   * @param {number} readingData.spad - SPAD value
   * @returns {Promise<Object>} Created reading
   */
  async create(readingData) {
    return apiClient.post('/agriino/readings/', readingData);
  },
};

export default plantApi;
