import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { formatDate, formatPrice, truncateText } from '../utils/helpers';
import * as eventService from '../utils/eventService';

const MotionCard = motion(Card);

const Events = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventType, setEventType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    // Fetch events when filters change
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: pagination.page,
          limit: 12
        };
        
        if (searchQuery) params.search = searchQuery;
        if (eventType !== 'all') params.type = eventType;
        if (priceRange !== 'all') params.price = priceRange;
        
        const data = await eventService.getEvents(params);
        setEvents(data.events);
        setPagination(data.pagination);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, eventType, priceRange, pagination.page]);

  const handleViewEvent = (id) => {
    navigate(`/event/${id}`);
  };

  if (loading && events.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Discover Events
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
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
                <MenuItem value="workshop">Workshops</MenuItem>
                <MenuItem value="meetup">Meetups</MenuItem>
                <MenuItem value="course">Courses</MenuItem>
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

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {events.length === 0 && !loading ? (
        <Typography variant="h6" align="center" sx={{ my: 4 }}>
          No events found. Try adjusting your filters.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
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
                    Host: {event.host?.name || 'Anonymous'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {formatDate(event.date)}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {event.price === 0 ? 'Free' : formatPrice(event.price)}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {event.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Stack>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleViewEvent(event._id)}
                  >
                    View Details
                  </Button>
                </Box>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Events; 