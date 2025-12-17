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
  image: {
    type: String, // Cloudinary URL
    required: [true, 'Image is required']
  },
  cloudinary_id: {
    type: String, // Cloudinary public_id for deletion
    required: [true, 'Cloudinary ID is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);