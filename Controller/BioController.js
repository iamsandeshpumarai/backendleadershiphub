const Biography = require("../Models/BioModel");
const { dataHandler, errorHandler } = require("../utils/responseHelper");

// Controller to get biography data (assuming single document)
const getBioGraphyData = async (req, res) => {
  try {
    const bio = await Biography.find();
    if (!bio || bio.length === 0) {
      return errorHandler(res, 400, "No Biography Data Found");
    }
    return dataHandler(res, 200, "Biography fetched successfully", bio);
  } catch (error) {
    return errorHandler(res, 500, error.message);
  }
};

// Controller to insert new biography data (only if none exists)
const insertBioGraphyData = async (req, res) => {
  try {
    const imageUrl = req.file?.path;
    const data = JSON.parse(req.body.data);

    const finalData = {
      ...data,
      profile: {
        ...data.profile,
        photoUrl: imageUrl,
      },
    };

    const returnData = await Biography.create(finalData);
    return dataHandler(res, 200, "Data Saved Successfully", returnData);
  } catch (error) {
    return errorHandler(res, 500, error.message);
  }
};

// Controller to update existing biography data (upserts if none exists)
const updateBioGraphyData = async (req, res) => {
  console.log(req.body.data)
  try {
    const imageUrl = req.file?.path;
    const data = JSON.parse(req.body.data);

    const finalData = {
      ...data,
      profile: {
        ...data.profile,
        photoUrl: imageUrl,
      },
    };

    const updatedBio = await Biography.findOneAndUpdate(
      {}, // Empty filter to match the single document
      finalData,
      { new: true, upsert: true, runValidators: true }
    );

    return dataHandler(res, 200, "Biography data updated successfully", updatedBio);
  } catch (error) {
    return errorHandler(res, 400, "Invalid data", error.message);
  }
};

// Controller to delete all biography data
const deleteBioGraphyData = async (req, res) => {
  try {
    const deleted = await Biography.deleteMany({});
    return dataHandler(res, 200, "All Biography data deleted successfully", deleted);
  } catch (error) {
    return errorHandler(res, 500, "Failed to delete data", error.message);
  }
};

module.exports = {
  getBioGraphyData,
  insertBioGraphyData,
  updateBioGraphyData,
  deleteBioGraphyData,
};
