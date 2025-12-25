const mongoose = require('mongoose');

const OfficeSchema = new mongoose.Schema({
  officeAddress: { type: String, required: true, trim: true },
  province: { type: String, required: true },
  cityState: { type: String, required: true },
  
  phoneNumbers: [{
    number: { type: String, required: true },
    type: { type: String, enum: ['Office', 'Mobile', 'Fax'], default: 'Office' }
  }],
  
  emails: [{
    address: { type: String, required: true, lowercase: true, trim: true }
  }],

  hoursSummary: { 
    type: String, 
    default: "Sunday - Friday: 09:00 AM - 05:00 PM" 
  },
  closedDaysSummary: { 
    type: String, 
    default: "Closed on Saturdays and Public Holidays" 
  },
  
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

  visitHeading: { type: String, default: "Our office is located in the heart of Kathmandu." },
  visitDescription: { type: String, default: "Interactive Map\nKathmandu, Nepal" },

  // --- NEW FOOTER FIELDS ---
  footerGmail: { type: String, trim: true, default: "contact@girirajpokhrel.com" },
  footerPhone: { type: String, trim: true, default: "+977-01-XXXXXXX" },
  footerLocation: { type: String, trim: true, default: "Campaign Office, Main Street, City" }

}, { timestamps: true });

module.exports = mongoose.model('Office', OfficeSchema);