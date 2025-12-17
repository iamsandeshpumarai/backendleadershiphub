// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
           // remove extra spaces
  },
  password: {
    type: String,
    required: true       // password is mandatory
  }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

// Create model
const Login = mongoose.model("loggein", userSchema);

module.exports = Login;
