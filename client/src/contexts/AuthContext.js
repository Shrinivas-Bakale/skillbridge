import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../utils/authService';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component that wraps the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Check if user is logged in from API
    const verifyUser = async () => {
      try {
        if (localStorage.getItem('token')) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // Token might be invalid, remove it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    verifyUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      if (!data || !data.user) {
        throw new Error('Login response is missing user data');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await authService.register(userData);
      if (!data || !data.user) {
        throw new Error('Registration response is missing user data');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Register error in context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setLoading(true);
    authService.logout();
    setUser(null);
    setLoading(false);
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const data = await authService.updateProfile(profileData);
      if (!data || !data.user) {
        throw new Error('Update profile response is missing user data');
      }
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Update profile error in context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context values
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  // Don't render children until auth is initialized
  if (!authInitialized) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 