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
import * as eventService from '../utils/eventService';
import { formatDate, formatPrice } from '../utils/helpers';

// ... rest of the file remains unchanged ... 