const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/auth.js')
const uploader = require('../middlewares/multer.js')
const article = require('../controllers/article.controller')

router.post('/addArticle', authenticate, uploader, article.create);
router.get('/', article.get);
router.put('/:article_id/updateThumbnail', authenticate, uploader, article.updateImage);
router.put('/:article_id', authenticate, article.update);
router.post('/:article_id', authenticate, article.bookmark)
router.delete('/:article_id', authenticate, article.delete);
router.get('/details/:article_id', article.detailsById);


module.exports = router;