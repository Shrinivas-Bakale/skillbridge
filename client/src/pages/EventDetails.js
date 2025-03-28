import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { formatDate, formatPrice } from '../utils/helpers';

const MotionCard = motion(Card);

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call using the id
    const fetchEvent = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/events/${id}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockEvent = {
          id: parseInt(id),
          title: 'Web Development Workshop',
          description: 'Learn the basics of web development with HTML, CSS, and JavaScript. This workshop will cover fundamental concepts and best practices for building modern web applications.',
          image: 'https://source.unsplash.com/random/800x600?web',
          date: '2024-04-15',
          price: 49.99,
          type: 'workshop',
          skills: ['HTML', 'CSS', 'JavaScript', 'React'],
          host: {
            name: 'John Doe',
            bio: 'Senior Web Developer with 10+ years of experience',
            avatar: 'https://source.unsplash.com/random/100x100?portrait',
          },
          attendees: 12,
          maxAttendees: 20,
          location: 'Virtual',
          duration: '2 hours',
        };
        
        setEvent(mockEvent);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Typography>Event not found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardMedia
                component="img"
                height="400"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {event.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {event.skills.map((skill) => (
                    <Chip key={skill} label={skill} />
                  ))}
                </Stack>
                <Typography variant="body1" paragraph>
                  {event.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date & Time
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(event.date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">{event.duration}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">{event.location}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body1">
                      {formatPrice(event.price)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </MotionCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About the Host
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <img
                    src={event.host.avatar}
                    alt={event.host.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      marginRight: 16,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {event.host.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.host.bio}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Event Status
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {event.attendees} / {event.maxAttendees} attendees
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={event.attendees >= event.maxAttendees}
                >
                  {event.attendees >= event.maxAttendees
                    ? 'Event Full'
                    : 'Register Now'}
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EventDetails; 