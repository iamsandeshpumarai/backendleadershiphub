const express = require('express');
const EventRouter = express.Router();
const {
  getEventData,
  insertEventData,
  updateEventData,
  deleteEvent 
} = require('../Controller/EventController');
const upload = require('../utils/multer');

// GET: Matches /api/events (If you use proxy) or /event/getevent
EventRouter.get('/getevent', getEventData);

// POST: Main logic for 'Save All'
EventRouter.post('/inserteventdata', upload.any(), insertEventData);

// PUT: Single update
EventRouter.put('/updateevent', updateEventData);

// DELETE: Single delete
EventRouter.delete('/deletenews/:id', deleteEvent);

module.exports = EventRouter;