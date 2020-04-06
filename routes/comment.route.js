const express = require('express');
const router = express.Router();

const comment = require('../controllers/comment.controller')
const authenticate = require('../middlewares/auth')

router.post('/:article_id', authenticate, comment.addComment)
router.get('/:article_id', comment.getCommentByArticle)
router.put('/:article_id', authenticate, comment.editComment)
router.delete('/:article_id', authenticate, comment.deleteComment)

module.exports = router;
