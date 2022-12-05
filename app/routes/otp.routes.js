const otpController = require('../controllers/otp.controller');
const router = require('express').Router();

router.post('/create-otp', otpController.createOtp);
router.post('/cek-otp', otpController.cekOtp);
router.post('/create-account', otpController.newAccount);
router.post('/create-password', otpController.createPassword);


module.exports = router;