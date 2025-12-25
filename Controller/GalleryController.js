const Gallery = require('../Models/GalleryModel');
const cloudinary = require('cloudinary').v2;
const { dataHandler, errorHandler } = require('../utils/responseHelper');

// @desc    Insert a new Gallery Item
const insertGallery = async (req, res) => {
  try {
    const { title, description, category, year, location } = req.body;

    // 1. Correctly access the Cover Image (it's the first item in the array)
    const coverFile = req.files?.coverImage ? req.files.coverImage[0] : null;
    
    if (!coverFile) {
      return errorHandler(res, 400, "Cover image is required");
    }

    // 2. Safely map the Gallery Images array
    const galleryFiles = req.files?.galleryImages || [];
    const galleryImagesData = galleryFiles.map((file) => ({
      url: file.path,
      cloudinary_id: file.filename
    }));

    // 3. Create the document
    const newItem = await Gallery.create({
      title,
      description,
      category,
      year: parseInt(year, 10),
      location,
      coverImage: coverFile.path,
      cover_cloudinary_id: coverFile.filename,
      galleryImages: galleryImagesData
    });

    return dataHandler(res, 201, "Gallery item added successfully", newItem);
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
    
    if (!existingItem) return errorHandler(res, 404, "Item not found");

    const updates = { ...req.body };

    // 1. Handle Cover Image Update
    if (req.files?.coverImage) {
      // Delete old cover from Cloudinary
      await cloudinary.uploader.destroy(existingItem.cover_cloudinary_id);
      
      updates.coverImage = req.files.coverImage[0].path;
      updates.cover_cloudinary_id = req.files.coverImage[0].filename;
    }

    // 2. Handle Additional Gallery Images (Append new ones to existing list)
    if (req.files?.galleryImages) {
      const newImages = req.files.galleryImages.map(file => ({
        url: file.path,
        cloudinary_id: file.filename
      }));
      updates.galleryImages = [...existingItem.galleryImages, ...newImages];
    }

    const updatedItem = await Gallery.findByIdAndUpdate(id, updates, { new: true });
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

    if (!item) return errorHandler(res, 404, "Item not found");

    // 1. Delete Cover Image from Cloudinary
    if (item.cover_cloudinary_id) {
      await cloudinary.uploader.destroy(item.cover_cloudinary_id);
    }

    // 2. Delete ALL Gallery Images from Cloudinary
    if (item.galleryImages && item.galleryImages.length > 0) {
      const deletePromises = item.galleryImages.map(img => 
        cloudinary.uploader.destroy(img.cloudinary_id)
      );
      await Promise.all(deletePromises);
    }

    // 3. Delete from MongoDB
    await Gallery.findByIdAndDelete(id);

    return dataHandler(res, 200, "Gallery item and all associated images deleted");
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
    return errorHandler(res, 500, "Server Error", err.message);
  }
};

module.exports = { insertGallery, updateGallery, deleteGallery, getGallery };