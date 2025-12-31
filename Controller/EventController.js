const Event = require('../Models/EventModel');
const { errorHandler, dataHandler } = require('../utils/responseHelper');

const getDayMonthStatus = (date) => {
  const eventDate = new Date(date);
  const today = new Date();

  const day = eventDate.getDate().toString();
  const month = eventDate.toLocaleString("en-US", { month: "short" });

  const status =
    eventDate.setHours(0, 0, 0, 0) <
    today.setHours(0, 0, 0, 0)
      ? "Past Event"
      : "Upcoming Event";

  return { day, month, status };
};

const insertEventData = async (req, res) => {
   const { title, date, description } = req.body;

console.log(title,date,description)
const {day,month,status} = getDayMonthStatus(date)

const image = req?.file?.path
try {
const Insertdata = {
  title,
  date,
  day,
  month,
  description,
  status,
  imageUrl:image || ""

}

const data = await Event.create(Insertdata)

    dataHandler(res, 201, "Event added successfully", data);

  } catch (err) {
    
    return errorHandler(res, 500, "Server error processing events", err.message);
  }
};

//deleteallevent
const deleteEventAll = async (req,res)=>{
  try{
await Event.deleteMany({})
res.status(200).json({message:"All events deleted successfully"}) 
  }
  catch(err){
    
  }
}
// GET all events
const getEventData = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return errorHandler(res, 400, "There are no events");
    }
    return dataHandler(res, 200, "Events fetched successfully", events);
  } catch (err) {
    
    return errorHandler(res, 500, err.message);
  }
};


// ... keep getEventData as is ...

// INSERT / SYNC all events


// UPDATE single event
const updateEventData = async (req, res) => {
  const id = req.params.id

  const {title,date,description,status} = req.body
  const {day,month} = getDayMonthStatus(date)
  try {
const updatedData = {
title,
date,
day,
month,
description,
status,
imageUrl:req?.file?.path || req.body?.imageUrl 
}
const data = await Event.findByIdAndUpdate(id,updatedData,{new:true})

res.status(200).json({message:"Update endpoint hit",})  
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
  deleteEventAll,
  deleteEvent 
};