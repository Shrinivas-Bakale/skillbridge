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
  Alert,
  Paper,
  Avatar,
  useTheme,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';
import eventService from '../utils/eventService';

const MotionContainer = motion(Container);
const MotionBox = motion(Box);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [userEvents, setUserEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchUserEvents = async () => {
    try {
      setRefreshing(true);
      const data = await eventService.getUserEvents();
      console.log('Fetched user events:', data);
      
      // Add detailed logging for debugging
      if (!data.registered || data.registered.length === 0) {
        console.log('No registered events found in response');
      } else {
        console.log(`Found ${data.registered.length} registered events`);
      }
      
      if (!data.hosted || data.hosted.length === 0) {
        console.log('No hosted events found in response');
      } else {
        console.log(`Found ${data.hosted.length} hosted events`);
      }
      
      setUserEvents(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch your events. Please try again later.');
      console.error('Error fetching user events:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
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

  const handleRefreshEvents = () => {
    fetchUserEvents();
  };

  // Filter events based on the selected tab
  const getDisplayedEvents = () => {
    if (!userEvents) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log('Filtering events for tab:', value);
    
    switch (value) {
      case 0: // Upcoming events the user is registered for
        if (!userEvents.registered || !Array.isArray(userEvents.registered)) {
          console.log('No registered events array found');
          return [];
        }
        
        const upcomingEvents = userEvents.registered.filter(event => {
          if (!event || !event.date) return false;
          const eventDate = new Date(event.date);
          return eventDate >= today;
        });
        
        console.log(`Found ${upcomingEvents.length} upcoming events`);
        return upcomingEvents;
        
      case 1: // Past events the user attended
        if (!userEvents.registered || !Array.isArray(userEvents.registered)) {
          console.log('No registered events array found');
          return [];
        }
        
        const pastEvents = userEvents.registered.filter(event => {
          if (!event || !event.date) return false;
          const eventDate = new Date(event.date);
          return eventDate < today;
        });
        
        console.log(`Found ${pastEvents.length} past events`);
        return pastEvents;
        
      case 2: // Events hosted by the user
        if (!userEvents.hosted || !Array.isArray(userEvents.hosted)) {
          console.log('No hosted events array found');
          return [];
        }
        
        console.log(`Found ${userEvents.hosted.length} hosted events`);
        return userEvents.hosted;
        
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: 'linear-gradient(45deg, #4A00E0, #8E2DE2)'
          }}
        />
      </Container>
    );
  }

  const displayedEvents = getDisplayedEvents();

  return (
    <MotionContainer 
      maxWidth="lg" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{ py: 4 }}
    >
      <MotionBox 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{ mb: 4 }}
      >
        <Paper
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            background: 'linear-gradient(to right, rgba(74, 0, 224, 0.05), rgba(142, 45, 226, 0.1))',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'primary.main',
              boxShadow: '0 4px 12px rgba(142, 45, 226, 0.4)'
            }}
          >
            {user?.name?.charAt(0) || <PersonIcon />}
          </Avatar>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Welcome, {user?.name || 'Student'}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your events and discover new opportunities
            </Typography>
          </Box>
        </Paper>
      </MotionBox>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <MotionBox 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{ mb: 3 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Your Events
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    onClick={handleRefreshEvents} 
                    disabled={refreshing}
                    sx={{ color: 'primary.main' }}
                  >
                    {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
                  </IconButton>
                  <Button 
                    variant="contained" 
                    onClick={handleCreateEvent}
                    startIcon={<AddIcon />}
                    sx={{ 
                      background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #3b00b3, #7526b6)',
                        boxShadow: '0 8px 20px rgba(142, 45, 226, 0.4)'
                      },
                      boxShadow: '0 4px 15px rgba(142, 45, 226, 0.3)'
                    }}
                  >
                    Create Event
                  </Button>
                </Box>
              </Box>
              
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ 
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#8E2DE2',
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  },
                  '& .Mui-selected': {
                    color: '#4A00E0',
                    fontWeight: 'bold'
                  }
                }}
              >
                <Tab label="Upcoming" />
                <Tab label="Past" />
                <Tab label="Hosted" />
              </Tabs>
              
              {refreshing && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              )}
              
              {!refreshing && displayedEvents.length > 0 ? (
                <Grid container spacing={3}>
                  {displayedEvents.map((event) => (
                    <Grid item xs={12} sm={6} key={event._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <EventCard event={event} onEventAction={fetchUserEvents} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              ) : !refreshing && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 6, 
                  backgroundColor: 'rgba(0,0,0,0.02)', 
                  borderRadius: 2 
                }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {value === 0
                      ? "You're not registered for any upcoming events."
                      : value === 1
                      ? "You haven't attended any events yet."
                      : "You haven't hosted any events yet."}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleViewAllEvents}
                    sx={{ 
                      mt: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: 'rgba(74, 0, 224, 0.04)'
                      }
                    }}
                  >
                    Explore Events
                  </Button>
                </Box>
              )}
            </Paper>
          </MotionBox>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" component="div" gutterBottom fontWeight={600}>
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
                          background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                          color: 'white',
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
                          backgroundColor: 'rgba(142, 45, 226, 0.2)',
                          color: '#8E2DE2',
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
              <Box sx={{ mt: 2 }}>
                <Button 
                  onClick={() => navigate('/profile')}
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 1,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: 'rgba(74, 0, 224, 0.04)'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Paper>
          
            <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
              <Typography variant="h6" component="div" gutterBottom fontWeight={600}>
                Quick Stats
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {userEvents?.registered?.filter(event => 
                        event?.date && new Date(event.date) >= new Date(new Date().setHours(0,0,0,0))
                      ).length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Upcoming</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {userEvents?.registered?.filter(event => 
                        event?.date && new Date(event.date) < new Date(new Date().setHours(0,0,0,0))
                      ).length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Attended</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {Array.isArray(userEvents?.hosted) ? userEvents.hosted.length : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Hosted</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </MotionBox>
        </Grid>
      </Grid>
    </MotionContainer>
  );
};

export default Dashboard; 