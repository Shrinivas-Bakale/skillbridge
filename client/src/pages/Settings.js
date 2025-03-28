import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const MotionCard = motion(Card);

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle settings update
    console.log(settings);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={user?.email || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={user?.name || ''}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={4}
                        value={user?.bio || ''}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </form>
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
                  Preferences
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleChange}
                        name="emailNotifications"
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.marketingEmails}
                        onChange={handleChange}
                        name="marketingEmails"
                      />
                    }
                    label="Marketing Emails"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={handleChange}
                        name="darkMode"
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <TextField
                  select
                  fullWidth
                  label="Language"
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Timezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ mt: 2 }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Settings; 