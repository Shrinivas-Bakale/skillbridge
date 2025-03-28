import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { formatDate, formatPrice, truncateText } from '../utils/helpers';

const MotionCard = motion(Card);

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Mock data - replace with API call
  const events = [
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
      image: 'https://source.unsplash.com/random/800x600?web',
      date: '2024-04-15',
      price: 49.99,
      type: 'workshop',
      skills: ['HTML', 'CSS', 'JavaScript'],
      host: 'John Doe',
    },
    {
      id: 2,
      title: 'Data Science Meetup',
      description: 'Join us for a networking event with data science professionals.',
      image: 'https://source.unsplash.com/random/800x600?data',
      date: '2024-04-20',
      price: 0,
      type: 'meetup',
      skills: ['Data Science', 'Networking'],
      host: 'Jane Smith',
    },
    // Add more mock events as needed
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventType === 'all' || event.type === eventType;
    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'free' && event.price === 0) ||
      (priceRange === 'paid' && event.price > 0);

    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Events
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={eventType}
                label="Event Type"
                onChange={(e) => setEventType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="workshop">Workshop</MenuItem>
                <MenuItem value="meetup">Meetup</MenuItem>
                <MenuItem value="course">Course</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                label="Price Range"
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.image}
                alt={event.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {truncateText(event.description, 100)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Host: {event.host}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {formatDate(event.date)}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  {event.price === 0 ? 'Free' : formatPrice(event.price)}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {event.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" />
                  ))}
                </Stack>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  View Details
                </Button>
              </Box>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Events; 