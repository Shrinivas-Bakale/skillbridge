import api from './api';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { message: 'Registration failed. Please try again.' };
  }
};

// Login a user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { message: error.message || 'Login failed. Please check your credentials.' };
  }
};

// Logout a user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { message: 'Failed to get user data' };
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw { message: 'Failed to update profile' };
  }
}; 