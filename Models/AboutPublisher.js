const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({
  role: {
    type: String,
    trim: true,
  },
  badge: {
    type: String,
    enum: ["publisher", "achievement"], // Fixed typo from "ennum"
  },
});

const authorSchema = new mongoose.Schema({

    aboutauthor: {
      type: String,
      trim: true,
    },
    authortags: [tagSchema], // Embedded subdocs
})

module.exports = mongoose.model("Author",authorSchema)