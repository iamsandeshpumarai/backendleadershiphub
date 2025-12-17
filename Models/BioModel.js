const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
  key:{
    type:String,

  },
  Value:{
    type:String,
    
  }
})

const politicalPositionSchema = new mongoose.Schema({
   position: { type: String, required: true },
  period: { type: String, required: true },
  details:[dataSchema]
});

const politicalAffiliationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  period: { type: String, required: true }
});

const biographySchema = new mongoose.Schema({
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photoUrl: { type: String, required: true },
    birthDate: { type: String, required: true },
    birthPlace: { type: String, required: true },
    residence: { type: String, required: true }
  },
  biographyDesc: { type: String, required: true },
  stats: {
    ministerialPositions: { type: String, required: true },
    yearsInPolitics: { type: String, required: true },
    mpStatus: { type: String, required: true }
  },
  politicalPositionDesc:{type:String,required:true},
  politicalPositions: [politicalPositionSchema],
  politicalAffiliations: [politicalAffiliationSchema],
  keyAchievements: [{ type: String }],
  politicalLife: [{ type: String }]
});

module.exports = mongoose.model('Biography', biographySchema);