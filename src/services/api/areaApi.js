/**
 * Area API - Area management endpoints
 * 
 * Handles CRUD operations for areas, device assignments,
 * and area-specific analysis history.
 */

import apiClient from './apiClient';

/**
 * Area API methods
 */
export const areaApi = {
  /**
   * Get all areas
   * @returns {Promise<Array>} List of areas
   */
  async getAll() {
    const data = await apiClient.get('/agriino/areas/');
    return Array.isArray(data) ? data : (data.results || []);
  },

  /**
   * Get area by ID
   * @param {string|number} areaId - Area ID
   * @returns {Promise<Object>} Area details
   */
  async getById(areaId) {
    return apiClient.get(`/agriino/areas/${areaId}/`);
  },

  /**
   * Create new area
   * @param {Object} areaData - Area data
   * @param {string} areaData.name - Area name
   * @param {string} areaData.description - Area description
   * @param {Array} areaData.polygon_coordinates - Array of [lat, lng] pairs
   * @param {number} areaData.center_latitude - Center latitude
   * @param {number} areaData.center_longitude - Center longitude
   * @param {Array} areaData.device_ids - Array of device IDs to add
   * @returns {Promise<Object>} Created area
   */
  async create(areaData) {
    return apiClient.post('/agriino/areas/', areaData);
  },

  /**
   * Update area
   * @param {string|number} areaId - Area ID
   * @param {Object} areaData - Area data to update
   * @returns {Promise<Object>} Updated area
   */
  async update(areaId, areaData) {
    return apiClient.patch(`/agriino/areas/${areaId}/`, areaData);
  },

  /**
   * Delete area
   * @param {string|number} areaId - Area ID
   * @returns {Promise<void>}
   */
  async delete(areaId) {
    return apiClient.delete(`/agriino/areas/${areaId}/`);
  },

  /**
   * Add device to area
   * @param {string|number} areaId - Area ID
   * @param {string|number} deviceId - Device ID to add
   * @returns {Promise<Object>} Updated area
   */
  async addDevice(areaId, deviceId) {
    return apiClient.post(`/agriino/areas/${areaId}/add_device/`, { device_id: deviceId });
  },

  /**
   * Remove device from area
   * @param {string|number} areaId - Area ID
   * @param {string|number} deviceId - Device ID to remove
   * @returns {Promise<void>}
   */
  async removeDevice(areaId, deviceId) {
    return apiClient.request(`/agriino/areas/${areaId}/remove_device/`, {
      method: 'DELETE',
      body: JSON.stringify({ device_id: deviceId }),
    });
  },

  /**
   * Get devices in an area
   * @param {string|number} areaId - Area ID
   * @returns {Promise<Array>} List of devices
   */
  async getDevices(areaId) {
    return apiClient.get(`/agriino/areas/${areaId}/devices/`);
  },

  /**
   * Get analysis history for an area
   * @param {string|number} areaId - Area ID
   * @returns {Promise<Array>} Analysis history
   */
  async getAnalysisHistory(areaId) {
    return apiClient.get(`/agriino/areas/${areaId}/analysis_history/`);
  },
};

export default areaApi;
