const db = require("../models");
const Otp = db.otps;
const date = () => new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)

module.exports = class otpController {

  static async generate(req, res) {
    let otp = "";
    let x = 6;

    for (let i = 0; i < x; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    res.status(200).json({
      code: 200,
      success: true,
      data: otp,
      message: "Generate OTP successfully.",
    });
  };

  static async cekPhone(req, res) {
    const phones = req.body.phone;
    const cek_phones = await Otp.findOne({
      where: {
        phone: phones
      }
    }).catch(error => {
      return res.status(400).json({
        code: 400,
        success: true,
        message: error.message
      });
    });

    if (!cek_phones) {
      res.status(200).json({
        code: 200,
        success: true,
        data: null,
        message: "Phone successfully register",
      });
    } else {
      res.status(400).json({
        code: 400,
        success: false,
        data: null,
        message: "Phone already registered",
      });

    }
  };

  static async createOtp(req, res) {
    const { phone, otp } = req.body;
    let validity = 300;

    await Otp.create({
      phone: phone,
      otp: otp,
      date: date(),
      time: Math.round(Date.now() / 1000) + validity,
      is_process: 1
    }).catch(error => {
      return res.status(400).json({
        code: 400,
        success: true,
        message: error.message
      });
    });

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        phone: phone,
        otp: otp,
        date: date(),
        time: Math.round(Date.now() / 1000) + validity,
        is_process: 1
      },
      message: "Otp successfully create"
    });

  };

}