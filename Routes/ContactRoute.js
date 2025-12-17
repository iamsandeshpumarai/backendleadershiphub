const express = require('express');
const router = express.Router();
const { getContactData, deleteContactData , updateContact} = require('../Controller/ContactController');

router.get('/', getContactData);
 // Uses POST for both create/update logic
router.delete('/delete', deleteContactData);
router.put('/create', updateContact);

module.exports = router;