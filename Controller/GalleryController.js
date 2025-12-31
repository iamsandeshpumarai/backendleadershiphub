const Gallery = require('../Models/GalleryModel');
const cloudinary = require('cloudinary').v2;
const { dataHandler, errorHandler } = require('../utils/responseHelper');

// --- Helper: Delete from Cloudinary ---
const deleteFromCloudinary = async (publicId, type) => {
  if (!publicId) return;
  try {
    const resourceType = type === "video" ? "video" : "image";
    // Cloudinary destroy needs the exact public_id stored in DB
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    
  } catch (err) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, err);
  }
};

// @desc    Insert a new Gallery Item
const insertGallery = async (req, res) => {
  try {
    const { title, description, category, year, location } = req.body;

    if (!req.files || !req.files.coverImage) {
      return errorHandler(res, 400, "Cover image is required");
    }

    // Use file.filename as it contains the folder/public_id from Cloudinary
    const coverFile = req.files.coverImage[0];
    const coverData = {
      path: coverFile.path,
      id: coverFile.filename 
    };

    const galleryFiles = req.files.galleryFiles
      ? req.files.galleryFiles.map(file => ({
          url: file.path,
          cloudinary_id: file.filename, // Correct Cloudinary Public ID
          type: file.mimetype.startsWith("video/") ? "video" : "image"
        }))
      : [];

    const newItem = await Gallery.create({
      title,
      description,
      category,
      year: parseInt(year, 10),
      location,
      coverImage: coverData.path,
      cover_cloudinary_id: coverData.id,
      galleryFiles
    });

    return dataHandler(res, 201, "Gallery memory created successfully", newItem);
  } catch (error) {
    
    return errorHandler(res, 500, "Server Error", error.message);
  }
};

// @desc    Update a Gallery Item
const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const existingItem = await Gallery.findById(id);
    if (!existingItem) return errorHandler(res, 404, "Memory not found");

    const updates = { ...req.body };
    if (updates.year) updates.year = parseInt(updates.year, 10);

    // 1. HANDLE COVER IMAGE
    if (req.files && req.files.coverImage) {
      // Delete old one
      await deleteFromCloudinary(existingItem.cover_cloudinary_id, "image");

      const coverFile = req.files.coverImage[0];
      updates.coverImage = coverFile.path;
      updates.cover_cloudinary_id = coverFile.filename;
    }

    // 2. HANDLE GALLERY SYNC (DELETIONS)
    let finalGalleryFiles = [];

    if (req.body.existingGalleryFiles) {
      const keptFiles = JSON.parse(req.body.existingGalleryFiles);

      // Find files present in DB but NOT in the "kept" list from frontend
      const filesToDelete = existingItem.galleryFiles.filter(
        dbFile => !keptFiles.some(kept => kept.cloudinary_id === dbFile.cloudinary_id)
      );

      for (const file of filesToDelete) {
        await deleteFromCloudinary(file.cloudinary_id, file.type);
      }

      finalGalleryFiles = keptFiles;
    } else {
      // If no existing files sent, delete all old files
      for (const file of existingItem.galleryFiles) {
        await deleteFromCloudinary(file.cloudinary_id, file.type);
      }
      finalGalleryFiles = [];
    }

    // 3. HANDLE NEW UPLOADS
    if (req.files && req.files.galleryFiles) {
      const newUploads = req.files.galleryFiles.map(file => ({
        url: file.path,
        cloudinary_id: file.filename,
        type: file.mimetype.startsWith("video/") ? "video" : "image"
      }));
      finalGalleryFiles = [...finalGalleryFiles, ...newUploads];
    }

    updates.galleryFiles = finalGalleryFiles;

    const updatedItem = await Gallery.findByIdAndUpdate(id, updates, { new: true });
    return dataHandler(res, 200, "Gallery updated successfully", updatedItem);
  } catch (error) {

    return errorHandler(res, 500, "Server Error", error.message);
  }
};

// @desc    Delete a Gallery Item
const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) return errorHandler(res, 404, "Item not found");

    // Delete Cover
    await deleteFromCloudinary(item.cover_cloudinary_id, "image");
    
    // Delete Gallery Array
    await Promise.all(item.galleryFiles.map(file => deleteFromCloudinary(file.cloudinary_id, file.type)));

    await Gallery.findByIdAndDelete(id);
    return dataHandler(res, 200, "Memory and all files deleted successfully");
  } catch (error) {
    return errorHandler(res, 500, "Server Error", error.message);
  }
};

const getGallery = async (req, res) => {
  try {
    const galleryData = await Gallery.find().sort({ createdAt: -1 });
    return dataHandler(res, 200, "Success", galleryData);
  } catch (err) {
    return errorHandler(res, 500, "Server Error", err.message);
  }
};

module.exports = { insertGallery, updateGallery, deleteGallery, getGallery };