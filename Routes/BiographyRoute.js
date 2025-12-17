const express = require('express')
const BioRouter = express.Router()
const {getBioGraphyData,
  insertBioGraphyData,
  updateBioGraphyData,deleteBioGraphyData} = require('../Controller/BioController')
const upload = require('../utils/multer')

BioRouter.get('/getbio',getBioGraphyData)
BioRouter.put('/updatebio',upload.single("image"),updateBioGraphyData)
BioRouter.delete('/deletebio',deleteBioGraphyData)
BioRouter.post('/insertbio',upload.single("image"),insertBioGraphyData)
module.exports = BioRouter