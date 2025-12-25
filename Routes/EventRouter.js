const express = require('express');
const EventRouter = express.Router();
const {
  getEventData,
  insertEventData,
  updateEventData,
  deleteEventAll,
  deleteEvent
} = require('../Controller/EventController');
const upload = require('../utils/multer');

// GET: Matches /api/events (If you use proxy) or /event/getevent
EventRouter.get('/getevent', getEventData);

// POST: Main logic for 'Save All'
EventRouter.post('/inserteventdata', upload.single(["image"]), insertEventData);

// PUT: Single update
EventRouter.put('/updateevent/:id',upload.single(["image"]),updateEventData);

// DELETE: Single delete
EventRouter.delete('/deleteevent/:id', deleteEvent);
// DELETE: Single delete
EventRouter.delete('/deletenewsall', deleteEventAll);

module.exports = EventRouter;