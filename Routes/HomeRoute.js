const express = require('express')
const HomeRouter = express.Router()
const {updateHomeData,getHomeData,insertHomeData, deleteHomeData} = require('../Controller/HomeController.js')
const upload = require('../utils/multer.js')
HomeRouter.get('/gethomedata',getHomeData)
HomeRouter.put('/updatehomedata',upload.single('herosecimage'),updateHomeData)
HomeRouter.delete('/deletehomedata',deleteHomeData)
HomeRouter.post('/insertdata', upload.single('herosecimage'), insertHomeData);
module.exports = HomeRouter