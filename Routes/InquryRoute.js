const {getInqiryMessages,insertInquiryMessage,deleteInquiryMessage} = require('../Controller/InquiryMessageController');

const express = require('express');
const router = express.Router();
router.get('/getmessages',getInqiryMessages);
router.post('/insertmessage',insertInquiryMessage);
router.delete('/deletemessage/:id',deleteInquiryMessage);

module.exports = router;