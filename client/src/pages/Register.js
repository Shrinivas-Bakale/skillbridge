import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Interests as InterestsIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/helpers';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const steps = ['Account Details', 'Profile Information', 'Skills & Interests'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    bio: '',
    skills: '',
    interests: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate account details
      if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      if (!validatePassword(formData.password)) {
        setError('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (activeStep === 1) {
      // Validate profile information
      if (!formData.name) {
        setError('Name is required');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Format skills and interests as arrays
      const userData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : []
      };
      
      console.log('Attempting registration...');
      await register(userData);
      console.log('Registration successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText="Password must be at least 8 characters with uppercase, lowercase, numbers and special characters"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CheckCircleIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              sx={{ 
                mt: 2, 
                mb: 2,
                py: 1.2,
                background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #3b00b3, #7526b6)',
                  boxShadow: '0 8px 20px rgba(142, 45, 226, 0.4)'
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(142, 45, 226, 0.3)'
              }}
              disabled={loading}
            >
              Next
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="Bio"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: 'rgba(74, 0, 224, 0.04)'
                  }
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleNext}
                sx={{ 
                  py: 1.2,
                  background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3b00b3, #7526b6)',
                    boxShadow: '0 8px 20px rgba(142, 45, 226, 0.4)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(142, 45, 226, 0.3)'
                }}
                disabled={loading}
              >
                Next
              </Button>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <TextField
              margin="normal"
              fullWidth
              id="skills"
              label="Skills (comma-separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. JavaScript, React, Node.js"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CodeIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="interests"
              label="Interests (comma-separated)"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Web Development, UI/UX Design, Mobile Apps"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InterestsIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{
                  py: 1.2,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: 'rgba(74, 0, 224, 0.04)'
                  }
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ 
                  py: 1.2,
                  background: 'linear-gradient(45deg, #4A00E0, #8E2DE2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #3b00b3, #7526b6)',
                    boxShadow: '0 8px 20px rgba(142, 45, 226, 0.4)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(142, 45, 226, 0.3)'
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </Box>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="sm">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh'
        }}
      >
        <MotionPaper
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          elevation={3}
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
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
              Join SkillBridge
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account in a few steps
            </Typography>
          </Box>

          {error && (
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </MotionBox>
          )}

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-active': {
                color: '#8E2DE2',
              },
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#4A00E0',
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{!isMobile ? label : ''}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={(e) => {
            e.preventDefault();
            if (activeStep === steps.length - 1) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}>
            {getStepContent(activeStep)}
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link 
                component={RouterLink} 
                to="/login"
                variant="body2"
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </MotionPaper>
      </MotionBox>
    </Container>
  );
};

export default Register; 