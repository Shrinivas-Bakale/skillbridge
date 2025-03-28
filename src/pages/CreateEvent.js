import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Paper,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import * as eventService from '../utils/eventService';
import { useAuth } from '../contexts/AuthContext';

// ... rest of the file remains unchanged ... 