const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/auth');
const uploader = require('../middlewares/multer')
const business = require('../controllers/business.controller')

router.post('/', authenticate, business.add)
router.get('/', authenticate, business.show)
router.post('/:_id', authenticate, business.bookmark)
router.get('/:_id', authenticate, business.approve)
router.put('/:_id', authenticate, business.update)
router.delete('/:_id', authenticate, business.removeB)
router.put('/logo/:_id', authenticate, uploader, business.image)

module.exports = router;