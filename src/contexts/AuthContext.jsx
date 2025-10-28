import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '@/services/api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = apiService.getStoredUser();
        const hasToken = apiService.isAuthenticated();

        if (storedUser && hasToken) {
          try {
            const user = await apiService.getProfile();
            setUser(user);
            setIsAuthenticated(true);
          } catch (error) {
            apiService.clearTokens();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Login berhasil!');
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = 
        error.status === 401 
          ? 'Email atau password salah' 
          : error.data?.error || 'Terjadi kesalahan saat login';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (formData) => {
    try {
      const response = await apiService.register(formData);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Registrasi berhasil!');
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = 
        error.data?.email?.[0] || 
        error.data?.password?.[0] || 
        error.data?.error ||
        'Terjadi kesalahan saat registrasi';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logout berhasil');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiService.updateProfile(profileData);
      setUser(response.user);
      toast.success('Profil berhasil diperbarui');
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.data?.error || 'Gagal memperbarui profil';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await apiService.changePassword(passwordData);
      toast.success('Password berhasil diubah');
      return { success: true };
    } catch (error) {
      const errorMessage = 
        error.data?.current_password?.[0] || 
        error.data?.new_password?.[0] || 
        error.data?.error ||
        'Gagal mengubah password';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
