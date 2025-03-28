import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  MonetizationOn as PriceIcon
} from '@mui/icons-material';
import { formatDate, formatPrice } from '../utils/helpers';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // Calculate if the event is in the past
  const isEventPast = new Date(event.date) < new Date();
  
  // Format the date
  const formattedDate = formatDate(event.date);
  
  // Get appropriate price display
  const priceDisplay = formatPrice(event.price);
  
  // Check if event is full
  const isEventFull = event.maxParticipants && event.participants?.length >= event.maxParticipants;

  const getEventStatusColor = () => {
    if (isEventPast) return 'default';
    if (isEventFull) return 'error';
    if (event.isRegistered) return 'success';
    return 'primary';
  };

  const getEventStatusText = () => {
    if (isEventPast) return 'Past Event';
    if (isEventFull) return 'Sold Out';
    if (event.isRegistered) return 'Registered';
    return 'Available';
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: 1.2,
              height: '2.4em'
            }}
          >
            {event.title}
          </Typography>
          <Chip 
            size="small" 
            label={event.type} 
            color="primary" 
            variant="outlined"
            sx={{ ml: 1, flexShrink: 0 }}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            mb: 2,
            height: '2.5em'
          }}
        >
          {event.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '90%'
            }}
          >
            <Tooltip title={event.location}>
              <span>{event.location}</span>
            </Tooltip>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PriceIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {priceDisplay}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Host: {event.host?.name || 'Unknown'}
          </Typography>
        </Box>
        
        {event.maxParticipants && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {event.participants?.length || 0} / {event.maxParticipants} participants
            </Typography>
            <Chip 
              size="small" 
              label={getEventStatusText()}
              color={getEventStatusColor()}
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          fullWidth 
          variant="outlined" 
          onClick={() => navigate(`/event/${event._id}`)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard; 