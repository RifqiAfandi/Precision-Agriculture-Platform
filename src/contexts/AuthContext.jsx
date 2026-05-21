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

  const getRegisterErrorMessage = (error) => {
    const emailError = error.data?.email?.[0] || error.data?.email;
    if (emailError) {
      return 'Email sudah terdaftar';
    }

    const passwordError = error.data?.password?.[0] || error.data?.password;
    if (passwordError) {
      const normalizedMessage = String(passwordError).toLowerCase();
      if (normalizedMessage.includes('konfirmasi')) {
        return 'Password dan konfirmasi password tidak cocok';
      }
      return 'Password minimal 6 karakter';
    }

    return null;
  };

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
            console.error('Profile fetch error:', error);
            // Don't clear tokens on profile fetch error if it's a server error
            // Only clear if it's an auth error (401)
            if (error.status === 401) {
              apiService.clearTokens();
              setUser(null);
              setIsAuthenticated(false);
            } else {
              // Use stored user data for other errors (e.g., network, server issues)
              setUser(storedUser);
              setIsAuthenticated(true);
            }
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
      toast.success('Registrasi berhasil! Silakan login.');
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = getRegisterErrorMessage(error);
      if (errorMessage) {
        toast.error(errorMessage);
      }
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
