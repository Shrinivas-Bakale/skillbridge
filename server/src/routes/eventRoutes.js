const express = require('express');
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', authenticateToken, eventController.createEvent);

// @route   GET /api/events
// @desc    Get all events with filtering
// @access  Public
router.get('/', eventController.getEvents);

// @route   GET /api/events/:id
// @desc    Get a single event by ID
// @access  Public
router.get('/:id', eventController.getEvent);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (event host only)
router.put('/:id', authenticateToken, eventController.updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (event host only)
router.delete('/:id', authenticateToken, eventController.deleteEvent);

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', authenticateToken, eventController.registerForEvent);

// @route   DELETE /api/events/:id/register
// @desc    Cancel registration for an event
// @access  Private
router.delete('/:id/register', authenticateToken, eventController.cancelRegistration);

// @route   GET /api/events/user/me
// @desc    Get user's events (registered and hosted)
// @access  Private
router.get('/user/me', authenticateToken, eventController.getUserEvents);

module.exports = router; 