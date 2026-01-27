/**
 * Auth API - Authentication related endpoints
 * 
 * Handles user registration, login, logout, profile management,
 * and password changes.
 */

import apiClient from './apiClient';

/**
 * Auth API methods
 */
export const authApi = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.first_name - First name
   * @param {string} userData.last_name - Last name
   * @returns {Promise<Object>} User data with tokens
   */
  async register(userData) {
    const data = await apiClient.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true,
    });

    apiClient.setTokens(data.tokens.access, data.tokens.refresh);
    apiClient.setStoredUser(data.user);

    return data;
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with tokens
   */
  async login(email, password) {
    const data = await apiClient.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });

    apiClient.setTokens(data.tokens.access, data.tokens.refresh);
    apiClient.setStoredUser(data.user);

    return data;
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    const refreshToken = apiClient.getRefreshToken();
    
    try {
      await apiClient.request('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.clearTokens();
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    const data = await apiClient.get('/auth/profile/');
    apiClient.setStoredUser(data.user);
    return data.user;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(profileData) {
    const data = await apiClient.patch('/auth/profile/update/', profileData);
    apiClient.setStoredUser(data.user);
    return data;
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.old_password - Current password
   * @param {string} passwordData.new_password - New password
   * @returns {Promise<Object>} Response data
   */
  async changePassword(passwordData) {
    return apiClient.post('/auth/change-password/', passwordData);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return apiClient.isAuthenticated();
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getStoredUser() {
    return apiClient.getStoredUser();
  },
};

export default authApi;
