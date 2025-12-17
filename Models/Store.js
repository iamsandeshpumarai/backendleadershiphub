const  mongoose = require("mongoose")



const BookSchema = new mongoose.Schema(
  {

    tags: {
      type: [String], // Changed to array for multiple tags; trim each via setter if needed
    },
    title: {
      type: String,
      required: true, // Re-added: Books need titles
      trim: true,
      minlength: 3,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    publishTime: {
      type: Date,
      default: Date.now, // Keep, but you can override
    },
    publishDesc: {
      type: String,
      trim: true,
    },
    price: {
      type: Number, // Changed to Number for better handling
      min: 0, // Prevent negative prices
    },
  },
  { timestamps: true }
);

// Index for faster title searches
BookSchema.index({ title: 1 });

const Book = mongoose.model("Book", BookSchema);

module.exports =  Book;