const Gallery = require('../Models/GalleryModel');
const cloudinary = require('cloudinary').v2;
const { dataHandler, errorHandler } = require('../utils/responseHelper');

// @desc    Insert a new Gallery Item
const insertGallery = async (req, res) => {
  try {
    if (!req.file) {
      return errorHandler(res, 400, "Image file is required");
    }

    const { title, description, category, year, location } = req.body;
    if (!title || !year) {
      return errorHandler(res, 400, "Title and year are required");
    }

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      return errorHandler(res, 400, "Invalid year format");
    }

    const newGalleryItem = new Gallery({
      title,
      description,
      category: category || 'Uncategorized',
      year: parsedYear,
      location,
      image: req.file.path,
      cloudinary_id: req.file.filename,
    });

    const savedGallery = await newGalleryItem.save();
    return dataHandler(res, 201, "Gallery item added successfully", savedGallery);
  } catch (error) {
    console.error("Error in insertGallery:", error);
    return errorHandler(res, 500, "Server Error", error.message);
  }
};

// @desc    Update a Gallery Item
const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const existingItem = await Gallery.findById(id);
    if (!existingItem) {
      return errorHandler(res, 404, "Item not found");
    }

    const updates = { ...req.body };
    if (updates.year) {
      const parsedYear = parseInt(updates.year, 10);
      if (isNaN(parsedYear)) {
        return errorHandler(res, 400, "Invalid year format");
      }
      updates.year = parsedYear;
    }

    if (req.file) {
      await cloudinary.uploader.destroy(existingItem.cloudinary_id);
      updates.image = req.file.path;
      updates.cloudinary_id = req.file.filename;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    return dataHandler(res, 200, "Gallery item updated successfully", updatedItem);
  } catch (error) {
    console.error("Error in updateGallery:", error);
    return errorHandler(res, 500, "Server Error", error.message);
  }
};

// @desc    Delete a Gallery Item
const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      return errorHandler(res, 404, "Item not found");
    }

    await cloudinary.uploader.destroy(item.cloudinary_id);
    await Gallery.findByIdAndDelete(id);

    return dataHandler(res, 200, "Gallery item deleted successfully", item);
  } catch (error) {
    console.error("Error in deleteGallery:", error);
    return errorHandler(res, 500, "Server Error", error.message);
  }
};

// @desc    Get all Gallery Items
const getGallery = async (req, res) => {
  try {
    const galleryData = await Gallery.find().sort({ createdAt: -1 });
    return dataHandler(res, 200, "Data fetched successfully", galleryData);
  } catch (err) {
    console.error("Error in getGallery:", err);
    return errorHandler(res, 500, "Server Error", err.message);
  }
};

module.exports = { insertGallery, updateGallery, deleteGallery, getGallery };
