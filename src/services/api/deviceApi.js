/**
 * Device API - Device management endpoints
 * 
 * Handles CRUD operations for devices, API key regeneration,
 * and device-related queries.
 */

import apiClient from './apiClient';

/**
 * Device API methods
 */
export const deviceApi = {
  /**
   * Get all user's devices
   * @returns {Promise<Array>} List of devices
   */
  async getAll() {
    const data = await apiClient.get('/agriino/devices/');
    // Handle pagination - return results array or data itself
    return Array.isArray(data) ? data : (data.results || []);
  },

  /**
   * Get device by ID
   * @param {string|number} deviceId - Device ID
   * @returns {Promise<Object>} Device details
   */
  async getById(deviceId) {
    return apiClient.get(`/agriino/devices/${deviceId}/`);
  },

  /**
   * Create new device
   * @param {Object} deviceData - Device data
   * @param {string} deviceData.name - Device name
   * @param {string} deviceData.device_type - Device type
   * @param {number} deviceData.latitude - Device latitude
   * @param {number} deviceData.longitude - Device longitude
   * @returns {Promise<Object>} Created device
   */
  async create(deviceData) {
    return apiClient.post('/agriino/devices/', deviceData);
  },

  /**
   * Update device
   * @param {string|number} deviceId - Device ID
   * @param {Object} deviceData - Device data to update
   * @returns {Promise<Object>} Updated device
   */
  async update(deviceId, deviceData) {
    return apiClient.patch(`/agriino/devices/${deviceId}/`, deviceData);
  },

  /**
   * Delete device
   * @param {string|number} deviceId - Device ID
   * @returns {Promise<void>}
   */
  async delete(deviceId) {
    return apiClient.delete(`/agriino/devices/${deviceId}/`);
  },

  /**
   * Get device data points
   * @param {string|number} deviceId - Device ID
   * @returns {Promise<Array>} List of data points for device
   */
  async getData(deviceId) {
    return apiClient.get(`/agriino/devices/${deviceId}/data/`);
  },

  /**
   * Sync device data from Firebase
   * @param {Array} devices - Array of device data from Firebase
   * @param {boolean} saveToDb - Whether to persist data (default: false)
   * @returns {Promise<Object>} Sync result
   */
  async syncFromFirebase(devices, saveToDb = false) {
    return apiClient.post('/agriino/sync/', {
      devices,
      save_to_db: saveToDb,
    });
  },
};

export default deviceApi;
