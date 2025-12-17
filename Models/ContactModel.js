const mongoose = require('mongoose');

const OfficeSchema =  new mongoose.Schema({
  // Address Section
  officeAddress: { type: String, required: true, trim: true },
  province: { type: String, required: true }, // Dropdown value
  cityState: { type: String, required: true }, // E.g., "Kathmandu, Nepal" for Map integration
  
  // Dynamic Arrays
  phoneNumbers: [{
    number: { type: String, required: true },
    type: { type: String, enum: ['Office', 'Mobile', 'Fax'], default: 'Office' }
  }],
  
  emails: [{
    address: { type: String, required: true, lowercase: true, trim: true }
  }],

  // --- MODIFIED SECTION: Simplified Office Hours ---
  // Replaced the 'officeHours' array with two descriptive strings
  hoursSummary: { 
    type: String, 
    default: "Sunday - Friday: 09:00 AM - 05:00 PM" 
  },
  closedDaysSummary: { 
    type: String, 
    default: "Closed on Saturdays and Public Holidays" 
  },
  // ----------------------------------------------------
  
  // New Fields: Office Highlights
  Parking: {
    type: String,
    enum: ["Available", "Not Available"],
    default: "Available"
  },
  Accessible: {
    type: String,
    default: "By Public Transport"
  },
  location: { 
    type: String,
    default: "Central"
  },

  // For the "Visit Office" text section
  visitHeading: { type: String, default: "Our office is located in the heart of Kathmandu. We welcome scheduled visits." },
  visitDescription: { type: String, default: "Interactive Map\nKathmandu, Bagmati Province, Nepal" }

}, { timestamps: true });

const Office = mongoose.model('Office', OfficeSchema);
module.exports = Office;