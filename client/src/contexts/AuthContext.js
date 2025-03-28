import React, { createContext, useState, useContext, useEffect } from 'react';

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

  useEffect(() => {
    // Check if user is logged in (from localStorage token)
    const token = localStorage.getItem('token');
    if (token) {
      // For demo purposes, we'll create a mock user
      // In a real app, you would verify the token with your backend
      setUser({
        id: '1',
        name: 'Demo User',
        email: 'user@example.com',
        bio: 'I am a software developer interested in web technologies.',
        skills: ['JavaScript', 'React', 'Node.js'],
        interests: ['Web Development', 'UI/UX Design', 'Open Source']
      });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // Mock login - in a real app, you would call your API
    try {
      // Mock successful login
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: email,
        bio: 'I am a software developer interested in web technologies.',
        skills: ['JavaScript', 'React', 'Node.js'],
        interests: ['Web Development', 'UI/UX Design', 'Open Source']
      };
      
      // Store token in localStorage
      localStorage.setItem('token', 'demo-token');
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    // Mock registration - in a real app, you would call your API
    try {
      // Create mock user from registration data
      const mockUser = {
        id: '1',
        name: userData.name || 'New User',
        email: userData.email,
        bio: userData.bio || '',
        skills: userData.skills || [],
        interests: userData.interests || []
      };
      
      // Store token in localStorage
      localStorage.setItem('token', 'demo-token');
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Provide auth context values
  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 