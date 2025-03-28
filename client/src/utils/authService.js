import api from './api';

// Register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
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
    console.log('Attempting login with:', { email, password: '******' });
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      console.error('Invalid server response:', response.data);
      throw new Error('Invalid response from server - missing token');
    }
  } catch (error) {
    console.error('Login error details:', error);
    
    // Handle Axios error specifically
    if (error.response) {
      console.error('Error response from server:', error.response.data);
      console.error('Error status code:', error.response.status);
      throw error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw { message: 'Server is not responding. Please try again later.' };
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message);
      throw { message: error.message || 'Login failed. Please check your credentials.' };
    }
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