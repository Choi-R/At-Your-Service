const express = require('express')
const router = express.Router()

const user = require('./user.route');
const article = require('./article.route');
const comment = require('./comment.route');
const business = require('./business.route');
const inquiry = require('./inquiry.route');
const like = require('./like.route');
const support = require('./suppport.route');
const ads = require('../routes/ads.route');

router.use('/user', user);
router.use('/article', article);
router.use('/comment', comment);
router.use('/business', business);
router.use('/inquiry', inquiry);
router.use('/like', like);
router.use('/support', support);
router.use('/ads', ads);

module.exports = router;