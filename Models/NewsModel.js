const mongoose = require("mongoose");

const NewSchema = new mongoose.Schema({
  
title: { type: String },
description: { type: String },
  date: { type: String },
});


module.exports = mongoose.model("News", NewSchema);
