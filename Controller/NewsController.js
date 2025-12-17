const NewsModel = require('../Models/NewsModel');
const { dataHandler, errorHandler } = require('../utils/responseHelper');

// INSERT News
const insertNews = async (req, res) => {
  try {
    const returnData = await NewsModel.create(req.body);
    return dataHandler(res, 201, "News added successfully", returnData);
  } catch (error) {
    console.error("Error inserting news:", error);
    return errorHandler(res, 500, "Server error", error.message);
  }
};

// GET all News
const getNews = async (req, res) => {
  try {
    const data = await NewsModel.find().sort({ date: -1 });
    return dataHandler(res, 200, "News fetched successfully", data);
  } catch (err) {
    console.error("Error fetching news:", err);
    return errorHandler(res, 500, "Failed to fetch news", err.message);
  }
};

// DELETE News by ID
const deleteDataNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NewsModel.findByIdAndDelete(id);
    if (!deleted) return errorHandler(res, 404, "News not found");
    return dataHandler(res, 200, "News deleted successfully", deleted);
  } catch (err) {
    console.error("Error deleting news:", err);
    return errorHandler(res, 500, "Server error", err.message);
  }
};

// UPDATE News by ID
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await NewsModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return errorHandler(res, 404, "News not found");
    return dataHandler(res, 200, "News updated successfully", updated);
  } catch (error) {
    console.error("Error updating news:", error);
    return errorHandler(res, 500, "Server error", error.message);
  }
};

module.exports = { insertNews, getNews, deleteDataNews, updateNews };
