const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  year: { type: Number, required: true },
  location: { type: String },
  coverImage: { type: String, default:"https://media.licdn.com/dms/image/v2/D5622AQFgvJII8AhkQg/feedshare-shrink_2048_1536/B56ZtRJwA2G4Aw-/0/1766593070945?e=1769040000&v=beta&t=re_BSxR7_RXvg_wX5LaLk_4VpO-nLJ7kBvkygH_s9Jw"  },
  cover_cloudinary_id: { type: String, required: true },
  galleryFiles: [
    {
      url: { type: String, required: true },
      cloudinary_id: { type: String, required: true },
      type: { type: String, required: true, enum: ['image', 'video'] }
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model('Gallery', gallerySchema);