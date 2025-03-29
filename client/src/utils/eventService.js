import api from "./api";

// Create a new event
export const createEvent = async (eventData) => {
  try {
    console.log("Creating event with data:", eventData);
    const response = await api.post("/events", eventData);
    console.log("Create event response:", response.data);
    
    // Check if the response contains the event object and extract the ID
    if (response.data && response.data.event && response.data.event._id) {
      return response.data.event;
    } else if (response.data && response.data._id) {
      return response.data;
    } else {
      console.error("Invalid event data in response:", response.data);
      throw new Error("Failed to create event: Invalid response format");
    }
  } catch (error) {
    console.error("Error creating event:", error);
    throw error.response?.data || { message: "Failed to create event" };
  }
};

// Get all events with optional filtering
export const getEvents = async (params = {}) => {
  try {
    console.log("Fetching events with params:", params);
    const response = await api.get("/events", { params });
    if (!response.data) {
      throw new Error("No data received when fetching events");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error.response?.data || { message: "Failed to fetch events" };
  }
};

// Get a single event by ID
export const getEvent = async (id) => {
  try {
    console.log("Fetching event with ID:", id);
    
    // Validate the event ID
    if (!id || id === "undefined" || id === "null") {
      console.error("Invalid event ID provided:", id);
      throw new Error("Invalid event ID");
    }
    
    const response = await api.get(`/events/${id}`);
    
    // Validate the response data
    if (!response.data) {
      console.error("No event data found in response:", response.data);
      throw new Error("Event not found or has been removed");
    }
    
    // Check if the data is already in the right format or needs to be extracted
    const eventData = response.data.event || response.data;
    
    // Final validation to ensure we have an event object with an _id
    if (!eventData || !eventData._id) {
      console.error("Invalid event data structure:", eventData);
      throw new Error("Event not found or has been removed");
    }
    
    console.log("Successfully fetched event:", eventData);
    return { event: eventData };
  } catch (error) {
    console.error("Error fetching event details:", error);
    if (error.response?.status === 404) {
      throw { message: "Event not found or has been removed" };
    }
    throw error.response?.data || { message: "Failed to fetch event details" };
  }
};

// Update an event
export const updateEvent = async (id, eventData) => {
  try {
    console.log("Updating event with ID:", id, "Data:", eventData);
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error.response?.data || { message: "Failed to update event" };
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  try {
    console.log("Deleting event with ID:", id);
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error.response?.data || { message: "Failed to delete event" };
  }
};

// Register for an event
export const registerForEvent = async (id) => {
  try {
    console.log("Registering for event with ID:", id);
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error.response?.data || { message: "Failed to register for event" };
  }
};

// Cancel registration for an event
export const cancelRegistration = async (id) => {
  try {
    console.log("Cancelling registration for event with ID:", id);
    const response = await api.delete(`/events/${id}/register`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling registration:", error);
    throw error.response?.data || { message: "Failed to cancel registration" };
  }
};

// Get user's events (registered and hosted)
export const getUserEvents = async () => {
  try {
    console.log("Fetching user events");
    const response = await api.get("/events/user/me");
    
    // Validate the response data
    if (!response.data) {
      console.error("No data received when fetching user events");
      throw new Error("Failed to fetch user events - no data received");
    }
    
    // Handle both old and new response formats
    const result = {
      hosted: response.data.hosted || response.data.hostedEvents || [],
      registered: response.data.registered || response.data.registeredEvents || []
    };
    
    // Filter out any invalid events (missing _id or other critical properties)
    if (Array.isArray(result.hosted)) {
      result.hosted = result.hosted.filter(event => event && event._id);
    }
    
    if (Array.isArray(result.registered)) {
      result.registered = result.registered.filter(event => event && event._id);
    }
    
    console.log("User events fetched successfully:", result);
    return result;
  } catch (error) {
    console.error("Error fetching user events:", error);
    // Return empty arrays instead of throwing to prevent dashboard from breaking
    return { hosted: [], registered: [] };
  }
};

// Export as a default object as well
const eventService = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getUserEvents,
};

export default eventService;
