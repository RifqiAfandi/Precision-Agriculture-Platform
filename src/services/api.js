// API Service - Precision Agriculture Platform

import { API_CONFIG } from '@/constants/config';

const API_BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Token management
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  setTokens(accessToken, refreshToken) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('agri-user');
  }

  // Core request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = this.getAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          data,
        };
      }

      return data;
    } catch (error) {
      if (error.status === 401 && !options.skipAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request(endpoint, options);
        }
      }
      throw error;
    }
  }

  // Token refresh
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      }
      
      this.clearTokens();
      return false;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    const data = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true,
    });

    this.setTokens(data.tokens.access, data.tokens.refresh);
    localStorage.setItem('agri-user', JSON.stringify(data.user));

    return data;
  }

  /**
   * Login user
   */
  async login(email, password) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });

    this.setTokens(data.tokens.access, data.tokens.refresh);
    localStorage.setItem('agri-user', JSON.stringify(data.user));

    return data;
  }

  /**
   * Logout user
   */
  async logout() {
    const refreshToken = this.getRefreshToken();
    
    try {
      await this.request('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    const data = await this.request('/auth/profile/', {
      method: 'GET',
    });

    localStorage.setItem('agri-user', JSON.stringify(data.user));

    return data.user;
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    const data = await this.request('/auth/profile/update/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });

    localStorage.setItem('agri-user', JSON.stringify(data.user));

    return data;
  }

  /**
   * Change password
   */
  async changePassword(passwordData) {
    const data = await this.request('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });

    return data;
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }

  getStoredUser() {
    const userStr = localStorage.getItem('agri-user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ==========================================
  // AGRIINO API METHODS
  // ==========================================

  /**
   * Get dashboard statistics
   */
  async getAgriinoStats() {
    return await this.request('/agriino/stats/', {
      method: 'GET',
    });
  }

  /**
   * Get recent alerts (plants needing attention)
   */
  async getAgriinoAlerts() {
    return await this.request('/agriino/alerts/', {
      method: 'GET',
    });
  }

  // ========== DEVICES ==========

  /**
   * Get all user's devices
   */
  async getDevices() {
    const data = await this.request('/agriino/devices/', {
      method: 'GET',
    });
    // Handle pagination - return results array or data itself
    return Array.isArray(data) ? data : (data.results || []);
  }

  /**
   * Get device details
   */
  async getDevice(deviceId) {
    return await this.request(`/agriino/devices/${deviceId}/`, {
      method: 'GET',
    });
  }

  /**
   * Create new device
   */
  async createDevice(deviceData) {
    return await this.request('/agriino/devices/', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  /**
   * Update device
   */
  async updateDevice(deviceId, deviceData) {
    return await this.request(`/agriino/devices/${deviceId}/`, {
      method: 'PATCH',
      body: JSON.stringify(deviceData),
    });
  }

  /**
   * Delete device
   */
  async deleteDevice(deviceId) {
    return await this.request(`/agriino/devices/${deviceId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Regenerate device API key
   */
  async regenerateDeviceApiKey(deviceId) {
    return await this.request(`/agriino/devices/${deviceId}/regenerate_api_key/`, {
      method: 'POST',
    });
  }

  /**
   * Get device's plants
   */
  async getDevicePlants(deviceId) {
    return await this.request(`/agriino/devices/${deviceId}/plants/`, {
      method: 'GET',
    });
  }

  // ========== PLANTS ==========

  /**
   * Get all plants
   */
  async getPlants() {
    const data = await this.request('/agriino/plants/', {
      method: 'GET',
    });
    // Handle pagination - return results array or data itself
    return Array.isArray(data) ? data : (data.results || []);
  }

  /**
   * Get plant details with history
   */
  async getPlant(plantId) {
    return await this.request(`/agriino/plants/${plantId}/`, {
      method: 'GET',
    });
  }

  /**
   * Create new plant
   */
  async createPlant(plantData) {
    return await this.request('/agriino/plants/', {
      method: 'POST',
      body: JSON.stringify(plantData),
    });
  }

  /**
   * Update plant
   */
  async updatePlant(plantId, plantData) {
    return await this.request(`/agriino/plants/${plantId}/`, {
      method: 'PATCH',
      body: JSON.stringify(plantData),
    });
  }

  /**
   * Delete plant
   */
  async deletePlant(plantId) {
    return await this.request(`/agriino/plants/${plantId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Get plant history
   * @param {string} plantId 
   * @param {number} days - Number of days (default: 7)
   * @param {number} limit - Max records (default: 100)
   */
  async getPlantHistory(plantId, days = 7, limit = 100) {
    return await this.request(`/agriino/plants/${plantId}/history/?days=${days}&limit=${limit}`, {
      method: 'GET',
    });
  }

  /**
   * Get plant latest reading
   */
  async getPlantLatestReading(plantId) {
    return await this.request(`/agriino/plants/${plantId}/latest_reading/`, {
      method: 'GET',
    });
  }

  // ========== READINGS ==========

  /**
   * Get all readings
   */
  async getReadings() {
    return await this.request('/agriino/readings/', {
      method: 'GET',
    });
  }

  /**
   * Create manual reading
   */
  async createReading(readingData) {
    return await this.request('/agriino/readings/', {
      method: 'POST',
      body: JSON.stringify(readingData),
    });
  }

  /**
   * Get reading details
   */
  async getReading(readingId) {
    return await this.request(`/agriino/readings/${readingId}/`, {
      method: 'GET',
    });
  }

  // ==========================================
  // KRIGING ANALYSIS API METHODS
  // ==========================================

  /**
   * Perform Kriging analysis on nitrogen data from Firebase
   * @param {Object} analysisData - Analysis request data
   * @param {Array} analysisData.device_data - Array of device readings with lat, lng, nitrogen
   * @param {number} analysisData.grid_resolution - Grid resolution (default: 20)
   * @param {string} analysisData.variogram_model - Variogram model (default: 'spherical')
   * @param {number} analysisData.low_threshold - Low nitrogen threshold (default: 1.5)
   * @param {number} analysisData.high_threshold - High nitrogen threshold (default: 2.5)
   */
  async performKrigingAnalysis(analysisData) {
    return await this.request('/agriino/analyze/', {
      method: 'POST',
      body: JSON.stringify(analysisData),
      skipAuth: true,
    });
  }

  /**
   * Quick Kriging analysis with simplified request format
   * @param {Array} points - Array of {lat, lng, nitrogen} objects
   * @param {Object} options - Optional parameters (resolution, model, thresholds)
   */
  async quickKrigingAnalysis(points, options = {}) {
    return await this.request('/agriino/quick-analyze/', {
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
  }

  /**
   * Sync device data from Firebase to backend database
   * @param {Array} devices - Array of device data from Firebase
   * @param {boolean} saveToDb - Whether to persist data (default: false)
   */
  async syncFirebaseDevices(devices, saveToDb = false) {
    return await this.request('/agriino/sync/', {
      method: 'POST',
      body: JSON.stringify({
        devices,
        save_to_db: saveToDb,
      }),
      skipAuth: true,
    });
  }

  /**
   * Get API health status
   */
  async getApiHealth() {
    return await this.request('/agriino/health/', {
      method: 'GET',
      skipAuth: true,
    });
  }

  // ==========================================
  // AREA MANAGEMENT API METHODS
  // ==========================================

  /**
   * Get all areas
   */
  async getAreas() {
    const data = await this.request('/agriino/areas/', {
      method: 'GET',
    });
    return Array.isArray(data) ? data : (data.results || []);
  }

  /**
   * Get area details
   */
  async getArea(areaId) {
    return await this.request(`/agriino/areas/${areaId}/`, {
      method: 'GET',
    });
  }

  /**
   * Create new area
   * @param {Object} areaData - Area data
   * @param {string} areaData.name - Area name
   * @param {string} areaData.description - Area description
   * @param {Array} areaData.polygon_coordinates - Array of [lat, lng] pairs
   * @param {number} areaData.center_latitude - Center latitude
   * @param {number} areaData.center_longitude - Center longitude
   * @param {Array} areaData.device_ids - Array of device IDs to add
   */
  async createArea(areaData) {
    return await this.request('/agriino/areas/', {
      method: 'POST',
      body: JSON.stringify(areaData),
    });
  }

  /**
   * Update area
   */
  async updateArea(areaId, areaData) {
    return await this.request(`/agriino/areas/${areaId}/`, {
      method: 'PATCH',
      body: JSON.stringify(areaData),
    });
  }

  /**
   * Delete area
   */
  async deleteArea(areaId) {
    return await this.request(`/agriino/areas/${areaId}/`, {
      method: 'DELETE',
    });
  }

  /**
   * Add device to area
   */
  async addDeviceToArea(areaId, deviceId) {
    return await this.request(`/agriino/areas/${areaId}/add_device/`, {
      method: 'POST',
      body: JSON.stringify({ device_id: deviceId }),
    });
  }

  /**
   * Remove device from area
   */
  async removeDeviceFromArea(areaId, deviceId) {
    return await this.request(`/agriino/areas/${areaId}/remove_device/`, {
      method: 'DELETE',
      body: JSON.stringify({ device_id: deviceId }),
    });
  }

  /**
   * Get devices in an area
   */
  async getAreaDevices(areaId) {
    return await this.request(`/agriino/areas/${areaId}/devices/`, {
      method: 'GET',
    });
  }

  /**
   * Get analysis history for an area
   */
  async getAreaAnalysisHistory(areaId) {
    return await this.request(`/agriino/areas/${areaId}/analysis_history/`, {
      method: 'GET',
    });
  }

  /**
   * Get analysis result details
   */
  async getAnalysisResult(analysisId) {
    return await this.request(`/agriino/analysis-results/${analysisId}/`, {
      method: 'GET',
    });
  }

  /**
   * Get all analysis results
   */
  async getAnalysisResults() {
    const data = await this.request('/agriino/analysis-results/', {
      method: 'GET',
    });
    return Array.isArray(data) ? data : (data.results || []);
  }
}

export default new ApiService();
