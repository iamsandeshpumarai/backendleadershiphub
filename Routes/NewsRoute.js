const express = require('express');
const router = express.Router();
const { insertNews, getNews, deleteDataNews,deleteAllNews,insertManyNews ,updateNews } = require('../Controller/NewsController');

router.post('/insertnews', insertNews);
router.delete('/deleteall', deleteAllNews);
router.post('/insertmanynews', insertManyNews);
router.get('/getnews', getNews);
router.delete('/deletenews/:id', deleteDataNews);
router.put('/updatenews/:id', updateNews);

module.exports = router;