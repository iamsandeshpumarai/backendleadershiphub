const express = require('express');
const router = express.Router();
const upload = require('../utils/multer'); // Import your multer config (assuming Cloudinary integration)
const { insertGallery, updateGallery, deleteGallery, getGallery } = require('../Controller/GalleryController'); // Note: Added deleteGallery

// @route   POST /gallery/insertgallery
// @desc    Insert new gallery item
router.post('/insertgallery', upload.single('image'), insertGallery);

// @route   PUT /gallery/update/:id
// @desc    Update existing gallery item
router.put('/update/:id', upload.single('image'), updateGallery);

// @route   DELETE /gallery/delete/:id
// @desc    Delete gallery item
router.delete('/delete/:id', deleteGallery); // New: Completes CRUD

// @route   GET /gallery/getdata
// @desc    Get all gallery items (sorted newest first)
router.get('/getdata', getGallery);

module.exports = router;