const db = require("../models");
const Otp = db.otps;
const Customers = db.customers;
const date = () => new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)
const { Op, literal, fn } = require('sequelize');


const generate = async () => {
  let otp = "";
  let x = 6;

  for (let i = 0; i < x; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

const cekPhone = async (phone) => {

  const cek_phones = await Customers.findOne({
    where: {
      phone: phone
    }
  });

  if (!cek_phones) {
    return {
      code: 200,
      success: true,
      data: null,
      message: "Phone available to register",
    }
  } else {
    return {
      code: 400,
      success: false,
      data: null,
      message: "Phone already registered",
    }
  }
};

const createOtp = async (req, res) => {
  const { phone } = req.body;
  let validity = 300;

  cek_phone = await cekPhone(phone);
  generate_otp = await generate();
  delete_phone = await deleteOtp(phone);

  count = await Otp.count({
    where: {
      phone: phone,
      date: new Date(date()),
    }
  });

  if (count >= 5) {
    return res.status(400).json({
      code: 400,
      success: false,
      data: null,
      message: "OTP can't be more than 5 perday",
    });
  }

  if (cek_phone.code == 200) {

    await Otp.create({
      phone: phone,
      otp: generate_otp,
      date: date(),
      time: Math.round(Date.now() / 1000) + validity,
      is_process: 1
    }).catch(error => {
      return res.status(400).json({
        code: 400,
        success: false,
        message: error.message
      });
    });

    return res.status(200).json({
      code: 200,
      success: true,
      data: {
        phone: phone,
        otp: generate_otp,
        date: date(),
        time: Math.round(Date.now() / 1000) + validity,
        is_process: 1
      },
      message: "OTP successfully create"
    });

  } else if (cek_phone.code == 400) {
    return res.status(400).json({
      code: 400,
      success: false,
      data: null,
      message: "Phone already registered",
    });
  }

};

const deleteOtp = async (phone) => {
  const deleteOtp = await Otp.destroy({
    where: {
      phone: phone,
      date: { [Op.lte]: new Date(Date.now() - (60 * 60 * 24 * 1000)) }
    }
  });

  if (deleteOtp) {
    return ({
      code: 200.,
      success: true,
      message: "Phone successfully deleted"
    });
  } else {
    return ({
      code: 400.,
      data: date(),
      success: false,
      message: "Phone cannot deleted"
    });
  }

}

module.exports = { generate, cekPhone, createOtp, deleteOtp }

