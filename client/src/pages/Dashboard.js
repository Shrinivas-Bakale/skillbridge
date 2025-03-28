import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatPrice } from '../utils/helpers';

const MotionCard = motion(Card);

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - replace with API calls
  const upcomingEvents = [
    {
      id: 1,
      title: 'Web Development Workshop',
      date: '2024-04-15',
      status: 'confirmed',
      price: 49.99,
    },
    {
      id: 2,
      title: 'Data Science Meetup',
      date: '2024-04-20',
      status: 'pending',
      price: 0,
    },
  ];

  const hostedEvents = [
    {
      id: 3,
      title: 'UI/UX Design Workshop',
      date: '2024-04-25',
      participants: 12,
      status: 'active',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'active':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name || 'User'}!
      </Typography>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Upcoming Events
              </Typography>
              <Typography variant="h4">
                {upcomingEvents.length}
              </Typography>
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
              <Typography color="text.secondary" gutterBottom>
                Hosted Events
              </Typography>
              <Typography variant="h4">
                {hostedEvents.length}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Participants
              </Typography>
              <Typography variant="h4">
                {hostedEvents.reduce((sum, event) => sum + event.participants, 0)}
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Events Tabs */}
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CardContent>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Upcoming Events" />
                <Tab label="Hosted Events" />
                <Tab label="Past Events" />
              </Tabs>

              {activeTab === 0 && (
                <List>
                  {upcomingEvents.map((event) => (
                    <ListItem key={event.id} divider>
                      <ListItemAvatar>
                        <Avatar>{event.title[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={formatDate(event.date)}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status)}
                          size="small"
                        />
                        <Typography variant="body2" color="primary">
                          {formatPrice(event.price)}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          href={`/event/${event.id}`}
                        >
                          View
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}

              {activeTab === 1 && (
                <List>
                  {hostedEvents.map((event) => (
                    <ListItem key={event.id} divider>
                      <ListItemAvatar>
                        <Avatar>{event.title[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={formatDate(event.date)}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status)}
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {event.participants} participants
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          href={`/event/${event.id}`}
                        >
                          Manage
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}

              {activeTab === 2 && (
                <Typography color="text.secondary" align="center">
                  No past events found
                </Typography>
              )}
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 