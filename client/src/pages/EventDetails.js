import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Avatar,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Event as EventIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  MonetizationOn as MoneyIcon,
  Share as ShareIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../utils/eventService';
import { formatDate, formatPrice } from '../utils/helpers';

const MotionBox = motion(Box);

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvent(id);
        setEvent(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load event details. Please try again later.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await eventService.registerForEvent(id);
      
      // Update the event data with the current user added to participants
      setEvent(prev => ({
        ...prev,
        participants: [...prev.participants, {
          _id: user._id,
          name: user.name,
          email: user.email
        }],
        isRegistered: true
      }));
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to register for this event. Please try again later.');
      console.error('Error registering for event:', err);
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setRegistering(true);
      await eventService.cancelRegistration(id);
      
      // Update the event data with the current user removed from participants
      setEvent(prev => ({
        ...prev,
        participants: prev.participants.filter(p => p._id !== user._id),
        isRegistered: false
      }));
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to cancel registration. Please try again later.');
      console.error('Error canceling registration:', err);
    } finally {
      setRegistering(false);
    }
  };

  const isUserRegistered = event?.isRegistered;
  const isUserHost = event?.host?._id === user?._id;
  const isEventFull = event?.maxParticipants && event?.participants?.length >= event.maxParticipants;
  const isEventPast = event?.date && new Date(event.date) < new Date();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!event && !loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">
          Event not found or has been removed.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/events')}
          sx={{ mt: 2 }}
        >
          Go Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<CategoryIcon />} 
                      label={event.type} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                    />
                    <Chip 
                      icon={<MoneyIcon />} 
                      label={formatPrice(event.price)} 
                      color="secondary" 
                      variant="outlined" 
                      size="small" 
                    />
                    {isEventPast && (
                      <Chip 
                        label="Past Event" 
                        color="default" 
                        size="small" 
                      />
                    )}
                  </Box>
                </Box>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(event.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RoomIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Host
                      </Typography>
                      <Typography variant="body1">
                        {event.host?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GroupsIcon color="action" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Participants
                      </Typography>
                      <Typography variant="body1">
                        {event.participants?.length || 0} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              
              {event.requirements && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {event.requirements}
                  </Typography>
                </>
              )}
              
              {!isUserHost && !isEventPast && (
                <Box sx={{ mt: 4 }}>
                  {isUserRegistered ? (
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="large" 
                      fullWidth
                      onClick={handleCancelRegistration}
                      disabled={registering}
                    >
                      {registering ? <CircularProgress size={24} /> : 'Cancel Registration'}
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large" 
                      fullWidth
                      onClick={handleRegister}
                      disabled={registering || isEventFull}
                    >
                      {registering ? (
                        <CircularProgress size={24} />
                      ) : isEventFull ? (
                        'Event is Full'
                      ) : (
                        'Register for Event'
                      )}
                    </Button>
                  )}
                </Box>
              )}
              
              {isUserHost && (
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate(`/edit-event/${id}`)}
                    sx={{ flex: 1 }}
                  >
                    Edit Event
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => {
                      // TODO: Add confirmation dialog
                      eventService.deleteEvent(id)
                        .then(() => {
                          navigate('/dashboard');
                        })
                        .catch(err => {
                          setError(err.message || 'Failed to delete event');
                        });
                    }}
                    sx={{ flex: 1 }}
                  >
                    Delete Event
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
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card elevation={3} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Host Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {event.host?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {event.host?.name || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.host?.email || 'No email provided'}
                    </Typography>
                  </Box>
                </Box>
                {event.host?.bio && (
                  <Typography variant="body2" paragraph>
                    {event.host.bio}
                  </Typography>
                )}
              </CardContent>
            </Card>
            
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Participants ({event.participants?.length || 0})
                </Typography>
                {event.participants && event.participants.length > 0 ? (
                  <List>
                    {event.participants.slice(0, 5).map((participant) => (
                      <ListItem key={participant._id} disableGutters>
                        <ListItemAvatar>
                          <Avatar>{participant.name?.charAt(0) || 'U'}</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={participant.name} 
                          secondary={participant.email} 
                        />
                      </ListItem>
                    ))}
                    {event.participants.length > 5 && (
                      <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          +{event.participants.length - 5} more participants
                        </Typography>
                      </Box>
                    )}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No participants have registered yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </MotionBox>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetails; 