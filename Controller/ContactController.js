const Office = require('../Models/ContactModel'); // Ensure this path is correct
const { errorHandler, dataHandler } = require('../utils/responseHelper');

// GET: Fetch the contact data
const getContactData = async (req, res) => {
  try {
    const contact = await Office.findOne();
   
    return dataHandler(res, 200, "Contact data fetched successfully", contact);
  } catch (err) {
    return errorHandler(res, 500, err.message);
  }
};


//createcontact
const updateContact = async(req,res)=>{
  console.log("iam inisde thre createcontact")
  console.log(req.body)
  try {
    // Destructure the data directly from the request body
    const {
      officeAddress,
      province,
      cityState,
      phoneNumbers,
      emails,
      hoursSummary,
      closedDaysSummary,
      Parking,
      Accessible,
      location,
      visitHeading,
      visitDescription,
    } = req.body;

    // --- 1. Construct the data object ---
    // The data object matches the structure of the Mongoose Schema
    const contactFields = {
      officeAddress,
      province,
      cityState,
      phoneNumbers,
      emails,
      hoursSummary,
      closedDaysSummary,
      Parking,
      Accessible,
      location,
      visitHeading,
      visitDescription,
    };

    // --- 2. Check for existing document and Upsert (Create or Update) ---
    
    // We search for ANY existing Office document. Since this is an 'AdminContactPanel',
    // the business logic usually dictates there should only be one document for contact info.
    let contactInfo = await Office.findOne();

    if (contactInfo) {
      // Document exists, perform an update
      contactInfo = await Office.findOneAndUpdate(
        { _id: contactInfo._id }, // Find the existing document
        { $set: contactFields }, // Update all fields with the new data
        { new: true } // Return the updated document
      );
      return res.json({ message: 'Contact Information updated successfully.', data: contactInfo });
    } else {
      // No document exists, create a new one
      contactInfo = new Office(contactFields);
      await contactInfo.save();
      return res.status(201).json({ message: 'Contact Information created successfully.', data: contactInfo });
    }
  } catch (err) {
    console.error(err.message);

    // Handle validation errors from Mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: messages 
      });
    }

    res.status(500).send('Server Error during save operation');
  }

}


// DELETE: Delete the contact info (Optional)
const deleteContactData = async (req, res) => {
  try {
    const deleted = await Office.deleteMany({});
    return dataHandler(res, 200, "Contact information deleted", deleted);
  } catch (err) {
    return errorHandler(res, 500, "Error deleting data", err.message);
  }
};

module.exports = { getContactData, deleteContactData,  updateContact};
