// API Service - Precision Agriculture Platform

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
}

export default new ApiService();
