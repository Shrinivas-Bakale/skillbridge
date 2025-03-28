import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../utils/eventService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [userEvents, setUserEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getUserEvents();
        setUserEvents(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch your events. Please try again later.');
        console.error('Error fetching user events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleViewAllEvents = () => {
    navigate('/events');
  };

  // Filter events based on the selected tab
  const getDisplayedEvents = () => {
    if (!userEvents) return [];
    
    switch (value) {
      case 0: // Upcoming events the user is registered for
        return userEvents.registered?.filter(event => new Date(event.date) >= new Date()) || [];
      case 1: // Past events the user attended
        return userEvents.registered?.filter(event => new Date(event.date) < new Date()) || [];
      case 2: // Events hosted by the user
        return userEvents.hosted || [];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  const displayedEvents = getDisplayedEvents();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'Student'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage your events and discover new opportunities
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Your Events
              </Typography>
              <Button variant="contained" onClick={handleCreateEvent}>
                Create Event
              </Button>
            </Box>
            
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab label="Upcoming" />
              <Tab label="Past" />
              <Tab label="Hosted" />
            </Tabs>
            
            {displayedEvents.length > 0 ? (
              <Grid container spacing={3}>
                {displayedEvents.map((event) => (
                  <Grid item xs={12} sm={6} key={event._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  {value === 0
                    ? "You're not registered for any upcoming events."
                    : value === 1
                    ? "You haven't attended any events yet."
                    : "You haven't hosted any events yet."}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleViewAllEvents}
                  sx={{ mt: 2 }}
                >
                  Explore Events
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Your Profile
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {user?.name || 'Not set'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Bio:</strong> {user?.bio || 'No bio provided'}
              </Typography>
              
              {user?.skills?.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Skills:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {user.skills.map((skill, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          fontSize: '0.75rem',
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
              
              {user?.interests?.length > 0 && (
                <>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Interests:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {user.interests.map((interest, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: 'secondary.light',
                          color: 'secondary.contrastText',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          fontSize: '0.75rem',
                        }}
                      >
                        {interest}
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/profile')}>
                Edit Profile
              </Button>
            </CardActions>
          </Card>
          
          <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Quick Stats
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {userEvents?.registered?.filter(event => new Date(event.date) >= new Date()).length || 0}
                    </Typography>
                    <Typography variant="body2">Upcoming</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {userEvents?.registered?.filter(event => new Date(event.date) < new Date()).length || 0}
                    </Typography>
                    <Typography variant="body2">Attended</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {userEvents?.hosted?.length || 0}
                    </Typography>
                    <Typography variant="body2">Hosted</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 