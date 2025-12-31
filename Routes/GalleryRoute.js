// routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { insertGallery, updateGallery, deleteGallery, getGallery } = require('../Controller/GalleryController');

const galleryUploadFields = [
  { name: "coverImage", maxCount: 1 },
  { name: "galleryFiles", maxCount: 50 }
];

router.post('/insertgallery', upload.fields(galleryUploadFields), insertGallery);
router.put('/update/:id', upload.fields(galleryUploadFields), updateGallery); // FIXED THIS
router.delete('/delete/:id', deleteGallery);
router.get('/getdata', getGallery);

module.exports = router;