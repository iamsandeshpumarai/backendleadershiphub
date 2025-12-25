const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, // Better than String for sorting/querying
    default: Date.now 
  },
  newsurl: {
    type: String,
    trim: true // Removes accidental whitespace
  }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model("News", NewsSchema);