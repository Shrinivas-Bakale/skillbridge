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
  Alert,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Event as EventIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  MonetizationOn as MoneyIcon,
  Share as ShareIcon,
  Groups as GroupsIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import eventService from '../utils/eventService';
import { formatDate, formatPrice } from '../utils/helpers';

const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvent(id);
        console.log("Event details returned:", data);
        if (data && data.event) {
          setEvent(data.event);
          setError('');
        } else {
          throw new Error("Invalid event data structure");
        }
      } catch (err) {
        console.error('Error in event details component:', err);
        setError(err.message || 'Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    } else {
      setError('Invalid event ID');
      setLoading(false);
    }
  }, [id]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await eventService.registerForEvent(id);
      
      // Update the event data with the current user added to participants
      setEvent(prev => ({
        ...prev,
        participants: [...(prev.participants || []), {
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

  const handleDeleteEvent = async () => {
    try {
      setDeleting(true);
      await eventService.deleteEvent(id);
      setDeleteDialog(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to delete event');
      setDeleting(false);
      setDeleteDialog(false);
    }
  };

  const isUserRegistered = event?.isRegistered;
  const isUserHost = event?.host?._id === user?._id;
  const isEventFull = event?.maxParticipants && event?.participants?.length >= event.maxParticipants;
  const isEventPast = event?.date && new Date(event.date) < new Date();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ color: 'primary.main' }}
        />
      </Container>
    );
  }

  if (!event && !loading) {
    return (
      <MotionContainer 
        maxWidth="lg" 
        sx={{ py: 8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MotionPaper
          elevation={3}
          sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Event Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The event you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/events')}
            sx={{ 
              mt: 2,
              py: 1.2,
              px: 4, 
              background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3b00b3, #7526b6)',
                boxShadow: '0 8px 20px rgba(142, 45, 226, 0.4)'
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(142, 45, 226, 0.3)'
            }}
            startIcon={<ArrowBackIcon />}
          >
            Browse Events
          </Button>
        </MotionPaper>
      </MotionContainer>
    );
  }

  return (
    <MotionContainer 
      maxWidth="lg" 
      sx={{ py: 4 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Button
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
              >
                Back
              </Button>
              
              {event.image && (
                <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', height: 300 }}>
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
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
                <IconButton 
                  aria-label="share"
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(74, 0, 224, 0.04)'
                    }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date & Time
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(event.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RoomIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Host
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {event.host?.name || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <GroupsIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Participants
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {event.participants?.length || 0} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              
              {event.requirements && (
                <>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
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
                      sx={{ py: 1.2 }}
                    >
                      {registering ? <CircularProgress size={24} /> : 'Cancel Registration'}
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      size="large" 
                      fullWidth
                      onClick={handleRegister}
                      disabled={registering || isEventFull}
                      sx={{ 
                        py: 1.2,
                        background: isEventFull ? undefined : 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                        '&:hover': {
                          background: isEventFull ? undefined : 'linear-gradient(45deg, #3b00b3, #7526b6)',
                          boxShadow: isEventFull ? undefined : '0 8px 20px rgba(142, 45, 226, 0.4)'
                        },
                        transition: 'all 0.3s ease',
                        boxShadow: isEventFull ? undefined : '0 4px 15px rgba(142, 45, 226, 0.3)'
                      }}
                    >
                      {registering ? (
                        <CircularProgress size={24} color="inherit" />
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
                    onClick={() => navigate(`/edit-event/${id}`)}
                    sx={{ 
                      flex: 1,
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
                    Edit Event
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => setDeleteDialog(true)}
                    sx={{ 
                      flex: 1,
                      py: 1.2 
                    }}
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
            <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Host Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    mr: 2,
                    background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)'
                  }}
                >
                  {event.host?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
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
            </Paper>
            
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Participants ({event.participants?.length || 0})
              </Typography>
              {event.participants && event.participants.length > 0 ? (
                <List>
                  {event.participants.slice(0, 5).map((participant) => (
                    <ListItem key={participant._id} disableGutters>
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            background: 'linear-gradient(45deg, #4A00E0, #8E2DE2, #8E2DE2, #4A00E0)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient 5s ease infinite'
                          }}
                        >
                          {participant.name?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={participant.name} 
                        secondary={participant.email} 
                        primaryTypographyProps={{
                          fontWeight: 500
                        }}
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
            </Paper>
          </MotionBox>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Event
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be undone, and all participants will be notified.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteEvent} color="error" autoFocus disabled={deleting}>
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </MotionContainer>
  );
};

export default EventDetails; 