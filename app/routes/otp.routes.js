const otpController = require('../controllers/otp.controller');
const router = require('express').Router();

router.post('/create-otp', otpController.createOtp);
router.post('/cek-otp', otpController.cekOtp);

module.exports = router;