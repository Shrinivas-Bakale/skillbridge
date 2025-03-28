import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Discover Events',
      description: 'Find local events that match your interests and skills',
      icon: '🎯',
    },
    {
      title: 'Share Skills',
      description: 'Teach and learn from others in your community',
      icon: '🤝',
    },
    {
      title: 'Build Network',
      description: 'Connect with like-minded individuals',
      icon: '🌐',
    },
    {
      title: 'Track Progress',
      description: 'Monitor your skill development journey',
      icon: '📈',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(45deg, #3498db 30%, #2ecc71 90%)',
          color: 'white',
          borderRadius: 2,
          mb: 6,
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to SkillBridge
          </Typography>
          <Typography variant="h5" gutterBottom>
            Connect, Learn, and Grow Together
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/events')}
            sx={{ mt: 2 }}
          >
            Explore Events
          </Button>
        </Container>
      </MotionBox>

      {/* Features Section */}
      <Container>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h1" component="div" gutterBottom>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 