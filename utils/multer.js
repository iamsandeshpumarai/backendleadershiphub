const cloudinary = require("./Setup.js");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 1. Remove file extension from original name
    const originalNameWithoutExt = file.originalname.split('.').slice(0, -1).join('.');
    
    // 2. Replace spaces and special characters with underscores
    const cleanName = originalNameWithoutExt
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .replace(/_+/g, '_');

    return {
      folder: "media",
      resource_type: "auto", 
      allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mov", "webm"],
      // Use the cleaned name with a timestamp
      public_id: `${Date.now()}-${cleanName}`, 
    };
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 400 * 1024 * 1024 } 
});

module.exports = upload;