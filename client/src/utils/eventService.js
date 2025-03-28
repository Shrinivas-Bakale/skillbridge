import api from './api';

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create event' };
  }
};

// Get all events with optional filtering
export const getEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch events' };
  }
};

// Get a single event by ID
export const getEvent = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch event details' };
  }
};

// Update an event
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update event' };
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete event' };
  }
};

// Register for an event
export const registerForEvent = async (id) => {
  try {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register for event' };
  }
};

// Cancel registration for an event
export const cancelRegistration = async (id) => {
  try {
    const response = await api.delete(`/events/${id}/register`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cancel registration' };
  }
};

// Get user's events (registered and hosted)
export const getUserEvents = async () => {
  try {
    const response = await api.get('/events/user/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user events' };
  }
}; 