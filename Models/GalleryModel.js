const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
  },
  location: {
    type: String,
    trim: true
  },
  // --- NEW FIELDS FOR COVER PHOTO ---
  coverImage: {
    type: String, // Cloudinary URL
    required: [true, 'Cover image is required']
  },
  cover_cloudinary_id: {
    type: String, // Cloudinary public_id
    required: [true, 'Cover Cloudinary ID is required']
  },
  // --- NEW FIELDS FOR ADDITIONAL IMAGES ---
  galleryImages: [{
    url: String,        // Cloudinary URL
    cloudinary_id: String // Cloudinary public_id
  }]
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);