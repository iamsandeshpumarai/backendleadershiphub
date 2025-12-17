const { Types: { ObjectId } } = require('mongoose');
const Event = require('../Models/EventModel');
const { errorHandler, dataHandler } = require('../utils/responseHelper');

// GET all events
const getEventData = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return errorHandler(res, 400, "There are no events");
    }
    return dataHandler(res, 200, "Events fetched successfully", events);
  } catch (err) {
    console.error(err);
    return errorHandler(res, 500, err.message);
  }
};


// ... keep getEventData as is ...

// INSERT / SYNC all events
const insertEventData = async (req, res) => {
  try {
    // 1. Parse the text data
    const rawEvents = JSON.parse(req.body.events);
    if (!rawEvents || !Array.isArray(rawEvents) || rawEvents.length === 0) {
      return errorHandler(res, 400, "The events field is empty or invalid");
    }

    const operations = [];
    const validIds = []; // This list protects items from being deleted

    for (const eventItem of rawEvents) {
      // 2. Find the matching image file using the ID sent from frontend
      const uploadedFile = req.files?.find(f => f.fieldname === `image-${eventItem.id}`);
      
      let finalImageUrl = eventItem.imageUrl; 
      if (uploadedFile) {
        // Use .path for local uploads or .location for S3/Cloudinary
        finalImageUrl = uploadedFile.path || uploadedFile.location; 
      }

      // 3. Construct the data object
      const eventData = {
        title: eventItem.title,
        date: eventItem.date,
        description: eventItem.description,
        status: eventItem.status,
        day: eventItem.day,
        month: eventItem.month,
        imageUrl: finalImageUrl,
      };

      // Validation
      if (!eventData.title || !eventData.date || !eventData.description) {
        throw new Error(`Invalid data for event: Missing required fields`);
      }

      // 4. Check if it's an existing MongoDB ID
      const isExistingEvent = eventItem.id && ObjectId.isValid(eventItem.id);

      if (isExistingEvent) {
        // --- UPDATE LOGIC ---
        const existingId = new ObjectId(eventItem.id);
        operations.push({
          updateOne: {
            filter: { _id: existingId },
            update: { $set: eventData }
          }
        });
        // Add to safe list so it doesn't get deleted
        validIds.push(existingId);
      } else {
        // --- INSERT LOGIC ---
        // FIX: Generate the ID manually here!
        const newId = new ObjectId(); 
        eventData._id = newId; // Assign the ID to the data

        operations.push({
          insertOne: { document: eventData }
        });
        // Add this NEW ID to the safe list so deleteMany ignores it
        validIds.push(newId);
      }
    }

    // 5. Execute Transaction
    const session = await Event.db.startSession();
    try {
      session.startTransaction();

      // Perform Updates and Inserts
      if (operations.length > 0) {
        await Event.bulkWrite(operations, { session });
      }

      // Delete anything that is NOT in our validIds list
      // This will now SAFELY delete only the items removed from the Frontend
      if (validIds.length > 0) {
        await Event.deleteMany({ _id: { $nin: validIds } }, { session });
      } else {
        // If frontend sent empty list, delete everything
        await Event.deleteMany({}, { session });
      }

      await session.commitTransaction();

      // Return the fresh list of events to the frontend
      const savedEvents = await Event.find().sort({ createdAt: -1 });
      return dataHandler(res, 200, "Events successfully synced!", savedEvents);

    } catch (txErr) {
      await session.abortTransaction();
      throw txErr;
    } finally {
      session.endSession();
    }

  } catch (err) {
    console.error("Error in insertEventData:", err);
    return errorHandler(res, 500, "Server error processing events", err.message);
  }
};

// UPDATE single event
const updateEventData = async (req, res) => {
  try {
    const { id, field, value } = req.body;
    if (!id || !field) return errorHandler(res, 400, "Required fields missing");

    const event = await Event.findById(id);
    if (!event) return errorHandler(res, 404, "Event not found");

    event[field] = value;

    if (field === 'date' && value) {
      const d = new Date(value);
      event.day = d.getDate().toString();
      event.month = d.toLocaleString('default', { month: 'short' });
    }

    await event.save();
    return dataHandler(res, 200, "Event updated successfully", event);
  } catch (err) {
    return errorHandler(res, 500, err.message);
  }
};

// DELETE single event (FIXED: Renamed for consistency)
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return errorHandler(res, 404, "Item not found");
    return dataHandler(res, 200, "Deleted successfully", deleted);
  } catch (err) {
    return errorHandler(res, 500, "Error deleting event", err.message);
  }
};

module.exports = {
  getEventData,
  insertEventData,
  updateEventData,
  deleteEvent // FIXED: Renamed from deleteNews
};