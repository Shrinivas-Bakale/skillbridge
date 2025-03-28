import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const MotionCard = motion(Card);

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  src={user?.avatar}
                >
                  {user?.name?.[0]}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {user?.name || 'User Name'}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {user?.email || 'user@example.com'}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>
                  Edit Profile
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About Me
                </Typography>
                <Typography paragraph>
                  {user?.bio || 'No bio available.'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user?.skills?.map((skill, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      {skill}
                    </Button>
                  )) || 'No skills listed.'}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user?.interests?.map((interest, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      {interest}
                    </Button>
                  )) || 'No interests listed.'}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 