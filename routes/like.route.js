const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/auth.js')
const Article = require('../controllers/article.controller');

router.post('/:article_id', authenticate, Article.like);

module.exports = router;