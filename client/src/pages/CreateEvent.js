import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    price: '',
    type: 'workshop',
    skills: [],
    maxAttendees: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <Container>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Event
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Event Type"
                  onChange={handleChange}
                >
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="meetup">Meetup</MenuItem>
                  <MenuItem value="course">Course</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Maximum Attendees"
                name="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma-separated)"
                name="skills"
                value={formData.skills.join(', ')}
                onChange={(e) => {
                  const skills = e.target.value.split(',').map(skill => skill.trim());
                  setFormData(prev => ({ ...prev, skills }));
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {formData.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => {
                      const newSkills = formData.skills.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, skills: newSkills }));
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
              >
                Create Event
              </Button>
            </Grid>
          </Grid>
        </Box>
      </MotionBox>
    </Container>
  );
};

export default CreateEvent; 