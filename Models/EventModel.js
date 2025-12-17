const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  day: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['Past Event', 'Upcoming Event']
  },
  imageUrl: {
    type: String,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;