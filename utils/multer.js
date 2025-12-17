// utils/upload.js
const cloudinary = require("./Setup.js"); // ← now gets configured cloudinary
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hero-images",           // your folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => 'giriraj-mani-hero-' + Date.now(), // unique name
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;