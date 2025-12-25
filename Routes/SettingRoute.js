const express = require('express');
const  updateAdmin  = require('../Controller/SettingController');
const Router = express.Router();


Router.put('/updatecredentails',updateAdmin)


module.exports = Router;