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
}

export default new ApiService();
