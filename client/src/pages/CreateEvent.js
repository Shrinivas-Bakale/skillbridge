import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import eventService from "../utils/eventService";
import { useAuth } from "../contexts/AuthContext";

const MotionPaper = motion(Paper);

const eventTypes = ["workshop", "meetup", "course"];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    time: "",
    location: "",
    price: 0,
    maxParticipants: "",
    requirements: "",
    image: null,
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    time: "",
    location: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        image: "Please upload a valid image file (JPEG, PNG, WebP)"
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        image: "Image size should be less than 5MB"
      }));
      return;
    }

    try {
      setImageUploading(true);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Store the file in the form data for later upload
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Clear any previous errors
      setFormErrors(prev => ({
        ...prev,
        image: ""
      }));
    } catch (err) {
      console.error("Error handling image:", err);
      setFormErrors(prev => ({
        ...prev,
        image: "Error processing image"
      }));
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    if (!formData.type) {
      errors.type = "Event type is required";
      isValid = false;
    }

    if (!formData.date) {
      errors.date = "Date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.date = "Date cannot be in the past";
        isValid = false;
      }
    }

    if (!formData.time) {
      errors.time = "Time is required";
      isValid = false;
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;
    
    // First check for environment variables, then fall back to hardcoded values
    // Make sure these values match exactly with your Cloudinary setup
    const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "duztkby9f";
    const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "ml_default";
    
    console.log("Using Cloudinary config:", { 
      cloudName: CLOUD_NAME, 
      uploadPreset: UPLOAD_PRESET,
      usingEnvVars: !!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME 
    });
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    try {
      console.log("Uploading image to Cloudinary...");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        console.error("Cloudinary upload failed with status:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("Cloudinary error details:", errorData);
        throw new Error('Image upload failed: ' + (errorData.error?.message || response.statusText));
      }
      
      const data = await response.json();
      console.log("Image uploaded successfully:", data.secure_url);
      return data.secure_url;
    } catch (err) {
      console.error('Error uploading image to Cloudinary:', err);
      throw new Error('Image upload failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Combine date and time for the backend
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      // Upload image to Cloudinary if exists
      let imageUrl = null;
      if (formData.image) {
        try {
          imageUrl = await uploadImageToCloudinary(formData.image);
        } catch (uploadError) {
          console.error("Image upload failed, continuing with default image:", uploadError);
          // Continue with event creation even if image upload fails
          // We'll just use the default image from the server
        }
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        type: formData.type.toLowerCase(),
        date: dateTime.toISOString(),
        location: formData.location,
        price: Number(formData.price) || 0,
        maxAttendees: formData.maxParticipants
          ? Number(formData.maxParticipants)
          : null,
        requirements: formData.requirements,
        image: imageUrl,
      };

      console.log("Creating event with final data:", eventData);
      const createdEvent = await eventService.createEvent(eventData);
      
      // Verify we have a valid event ID before navigating
      if (createdEvent && createdEvent._id) {
        console.log("Event created successfully with ID:", createdEvent._id);
        navigate(`/event/${createdEvent._id}`);
      } else {
        throw new Error("Failed to get event ID from created event");
      }
    } catch (err) {
      setError(
        err.message || "Failed to create event. Please try again later."
      );
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Create a New Event
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{ p: 4, borderRadius: 2 }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Event Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.type} required>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Event Type"
                  disabled={loading}
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.type && (
                  <FormHelperText>{formErrors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Participants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 1 },
                }}
                disabled={loading}
                helperText="Leave empty for unlimited"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }} fontWeight={600}>
                Event Image
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              {imagePreview ? (
                <Card sx={{ position: 'relative', mb: 2 }}>
                  <CardMedia
                    component="img"
                    image={imagePreview}
                    alt="Event preview"
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                      },
                    }}
                    onClick={removeImage}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={imageUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  sx={{ 
                    width: '100%', 
                    height: '100px', 
                    borderStyle: 'dashed',
                    borderColor: formErrors.image ? 'error.main' : 'primary.main',
                  }}
                  disabled={loading || imageUploading}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ImageIcon sx={{ fontSize: 40, mb: 1, color: 'text.secondary' }} />
                    <Typography>
                      {imageUploading ? 'Uploading...' : 'Upload Event Image'}
                    </Typography>
                  </Box>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading || imageUploading}
                  />
                </Button>
              )}
              {formErrors.image && (
                <FormHelperText error>{formErrors.image}</FormHelperText>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Recommended size: 1200x630 pixels (16:9 ratio). Max size: 5MB.
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }} fontWeight={600}>
                Date and Location
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={!!formErrors.date}
                helperText={
                  formErrors.date || "When will the event take place?"
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                error={!!formErrors.time}
                helperText={
                  formErrors.time || "What time will the event start?"
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimeIcon />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!formErrors.location}
                helperText={
                  formErrors.location ||
                  "Can be a physical address or virtual meeting link"
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }} fontWeight={600}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                  inputProps: { min: 0, step: "1" },
                }}
                helperText="Set 0 for free events"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Requirements (Optional)"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                helperText="Any prerequisites or items participants should bring"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate(-1)}
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'rgba(74, 0, 224, 0.04)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || imageUploading}
                sx={{ 
                  py: 1.2,
                  background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3b00b3, #7526b6)',
                    boxShadow: '0 8px 20px rgba(142, 45, 226, 0.4)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(142, 45, 226, 0.3)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Create Event"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </MotionPaper>
    </Container>
  );
};

export default CreateEvent;
