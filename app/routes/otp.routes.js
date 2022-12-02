const otpController = require('../controllers/otp.controller');
const router = require('express').Router();

router.get('/generate', otpController.generate);
router.post('/cek-phone', otpController.cekPhone);
router.post('/create-otp', otpController.createOtp);

module.exports = router;