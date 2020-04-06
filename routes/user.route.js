const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/auth')
const uploader = require('../middlewares/multer.js')
const user = require('../controllers/user.controller')
const multer = require('multer')

router.post('/register', user.userRegister)
router.get('/activation/:token', user.activation)
router.post('/login', user.loginUser)
router.post('/forgotPassword', user.forgotPassword)
router.post('/resetPassword/:token', multer().any(), user.resetPassword)
router.put('/uploadImage', authenticate, uploader, user.uploadImage)
router.put('/updateProfile', authenticate, user.editProfile)
router.get('/userProfile', authenticate, user.viewProfile)
router.get('/getAndCount', authenticate, user.count)

module.exports = router;