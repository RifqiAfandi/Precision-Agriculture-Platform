/**
 * API Client - Base HTTP Client
 * 
 * Provides core HTTP functionality with authentication, token management,
 * and automatic token refresh.
 */

import { API_CONFIG } from '@/constants/config';

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.refreshPromise = null;
  }

  // ==========================================
  // TOKEN MANAGEMENT
  // ==========================================

  /**
   * Get access token from localStorage
   * @returns {string|null} Access token
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token from localStorage
   * @returns {string|null} Refresh token
   */
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Store tokens in localStorage
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Clear all auth tokens and user data from localStorage
   */
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('agri-user');
  }

  /**
   * Check if a JWT token is expired
   * @param {string} token - JWT token string
   * @returns {boolean} True if expired or invalid
   */
  isTokenExpired(token) {
    if (!token) return true;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (!payload.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (!accessToken || !refreshToken) return false;
    
    // Pre-emptively clear tokens if the refresh token is expired
    if (this.isTokenExpired(refreshToken)) {
      this.clearTokens();
      return false;
    }
    
    return true;
  }

  /**
   * Get stored user data from localStorage
   * @returns {Object|null} User object
   */
  getStoredUser() {
    const userStr = localStorage.getItem('agri-user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Store user data in localStorage
   * @param {Object} user - User object
   */
  setStoredUser(user) {
    localStorage.setItem('agri-user', JSON.stringify(user));
  }

  // ==========================================
  // CORE REQUEST METHOD
  // ==========================================

  /**
   * Make HTTP request to API
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} options - Fetch options
   * @param {string} options.method - HTTP method (GET, POST, PATCH, DELETE)
   * @param {Object} options.headers - Additional headers
   * @param {string} options.body - Request body (JSON string)
   * @param {boolean} options.skipAuth - Skip authorization header
   * @returns {Promise<Object>} Response data
   */
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
      // Handle 401 Unauthorized - try token refresh
      if (error.status === 401 && !options.skipAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request(endpoint, options);
        }
      }
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @returns {Promise<boolean>} Success status
   */
  async refreshAccessToken() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.refreshPromise = null;
        return false;
      }

      // Check if the refresh token itself is expired before calling API
      if (this.isTokenExpired(refreshToken)) {
        this.clearTokens();
        this.refreshPromise = null;
        return false;
      }

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
          if (data.refresh) {
            localStorage.setItem('refresh_token', data.refresh);
          }
          this.refreshPromise = null;
          return true;
        }
        
        this.clearTokens();
        this.refreshPromise = null;
        return false;
      } catch {
        this.clearTokens();
        this.refreshPromise = null;
        return false;
      }
    })();

    return this.refreshPromise;
  }

  // ==========================================
  // CONVENIENCE METHODS
  // ==========================================

  /**
   * Make GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Make POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Make PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Make DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
