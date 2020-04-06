const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/auth.js')
const support = require('../controllers/support.controller')

router.post('/', authenticate, support.addSupport);
router.get('/', authenticate, support.getSupport);
router.delete('/', authenticate, support.deleteAll);
router.delete('/:_id', authenticate, support.deleteSupport);

module.exports = router;