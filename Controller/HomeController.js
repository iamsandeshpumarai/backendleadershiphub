const HomeData = require("../Models/HomeModel.js");
const { dataHandler, errorHandler } = require("../utils/responseHelper");

// UPDATE Home Data
const updateHomeData = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    console.log(req.file);
    const data = JSON.parse(req.body.data);
    console.log(data)
    const imageUrl = req?.file?.path || data.hero.imageUrl;
    console.log("Updating home data:", data, imageUrl);

    const formatedData = { ...data,hero :{ ...data.hero,imageUrl}  }
    // Update DB (assumes only one document; replace ID if needed)
    const saved = await HomeData.findByIdAndUpdate(
      '6939372d3c36225c129a2ac2',formatedData
      ,
      { upsert: true, new: true, runValidators: true }
    );
    console.log(saved,"this is the saved data")

    return dataHandler(res, 200, "All data saved successfully!", saved);
  } catch (err) {
    console.error('Error updating home data:', err);
    return errorHandler(res, 500, "Failed to update home data", err.message);
  }
};

// GET Home Data
const getHomeData = async (req, res) => {
  try {
    const data = await HomeData.find();
    return dataHandler(res, 200, "Home data fetched successfully", data || { hero: {}, experience: { cards: [] } });
  } catch (err) {
    console.error('Error fetching home data:', err);
    return errorHandler(res, 500, "Failed to load home data", err.message);
  }
};

// DELETE Home Data
const deleteHomeData = async (req, res) => {
  try {
    const deleted = await HomeData.deleteMany();
    return dataHandler(res, 200, "Home data deleted successfully", deleted);
  } catch (err) {
    console.error('Error deleting home data:', err);
    return errorHandler(res, 500, "Failed to delete home data", err.message);
  }
};

// INSERT Home Data
const insertHomeData = async (req, res) => {
  try {
    console.log("Inserting home data:", req.body, req.file?.path);
    const data = JSON.parse(req.body.data);
    const imageUrl = req.file?.path;

    const returnData = await HomeData.create({ ...data, ...data.hero, imageUrl });
    return dataHandler(res, 201, "Home data saved successfully", returnData);
  } catch (err) {
    console.error('Error inserting home data:', err);
    return errorHandler(res, 500, "Failed to insert home data", err.message);
  }
};

module.exports = { updateHomeData, getHomeData, insertHomeData, deleteHomeData };
