import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';
import * as eventService from '../utils/eventService'; 