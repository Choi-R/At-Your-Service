const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/auth.js')
const inquiry = require('../controllers/inquiry.controller.js')

router.post('/:_id', authenticate, inquiry.add)
router.put('/:_id', authenticate, inquiry.update)
router.delete('/:_id', authenticate, inquiry.destroy)
router.get('/', authenticate, inquiry.show)

module.exports = router;