const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.js');
const uploader = require('../middlewares/multer.js');
const ads = require('../controllers/ads.controller');

router.post('/', authenticate, uploader, ads.create);
router.get('/', authenticate, ads.get);
router.get('/:ads_id', authenticate, ads.getByDetailsId);
router.put('/:ads_id/updateBanner', authenticate, uploader, ads.updateImage);
router.delete('/:ads_id', authenticate, ads.deleteAd);
router.put('/:ads_id', authenticate, ads.approve)

module.exports = router;