const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['workshop', 'meetup', 'course'],
    default: 'workshop'
  },
  skills: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: 'https://source.unsplash.com/random/800x600?event'
  },
  maxAttendees: {
    type: Number,
    required: true,
    min: 1
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'pending'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: String,
    default: 'Online'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for calculating number of attendees
EventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.filter(a => a.status === 'confirmed').length;
});

// Virtual for checking if event is full
EventSchema.virtual('isFull').get(function() {
  return this.attendeeCount >= this.maxAttendees;
});

// Virtual for checking if event has passed
EventSchema.virtual('isPast').get(function() {
  return new Date(this.date) < new Date();
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event; 