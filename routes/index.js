var express = require('express');
var router = express.Router();
var db = require('../db');
var Utils = require('../utils');

/* GET home page. */
router.get('/', async function(req, res, next) {

  var sql = "SELECT * from books order by id DESC";
  var results = await db.query(sql,{});
  // console.log('result::', result);
  res.render('index', { title: 'Express', results: results });
});


router.post('/crawl', async function(req, res, next) {
  var page = req.body.page || 1;
  // await Utils.crawl(page);
  var list = await Utils.crawl(page);
  // console.log('list::', list);
  list.forEach(async item => {
    await db.insert(item);
  })

  res.redirect('/');
});

module.exports = router;
