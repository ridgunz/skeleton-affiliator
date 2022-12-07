const db = require("../models");
const Otp = db.otps;
const Customers = db.customers;
const date = () => new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + new Date().getDate()).slice(-2)
const { Op, literal, fn } = require('sequelize');
const axiosMaster = require('axios');
const time = () => (Date.now() / 1000).toFixed()
const bcrypt = require('bcrypt');

const axios = axiosMaster.create({
  //verify: false,
  baseURL: process.env.TIRA_API_URL || `http://localhost/tira-sf/public/`,
  headers: {
    "Authorization": process.env.TIRA_API_KEY || 123
  }
});


const generate = async () => {
  let otp = "";
  let x = 6;

  for (let i = 0; i < x; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

const cekPhone = async (phone, email) => {
  //Cek apakah akun sudah terdaftar 
  const cek_phones = await Customers.findOne({
    where: {
      [Op.or]:
        [
          { email: email },
          { phone: phone }
        ]
    }
  });

  return cek_phones;
};

const sendWhatsapp = async (phone, message) => {
  const res = await axios.post('api/send-whatsapp', {
    'phone': phone,
    'message': message
  }).then(res => {
    console.log(res.data)
    return res.data
  }).catch(err => {
    console.log(err)
    return err
  })

  return await res.status
};

const createOtp = async (req, res) => {
  const { phone } = req.body;
  let validity = 300;

  generate_otp = await generate();
  delete_phone = await deleteOtp(phone);

  count = await Otp.count({
    where: {
      phone: phone,
      date: new Date(date()),
    }
  });

  const cek = await Otp.findOne({
    where:
    {
      [Op.and]:
        [
          { phone: phone }
        ]
    },
    order:
      [
        ['id', 'DESC']
      ]
  }).catch(error => {
    return res.status(400).json({
      code: 400,
      success: false,
      message: error.message
    });
  });

  if (count) {
    if (Number(cek.time) > Number(time())) {
      return res.status(400).json({
        code: 400,
        success: false,
        data: null,
        message: "OTP already sent, cek on your whatsapp or wait until the time runs out ",
      });
    }
  }


  if (count >= 5) {
    return res.status(400).json({
      code: 400,
      success: false,
      data: null,
      message: "OTP can't be more than 5 perday",
    });
  }

  const message = `JUARA - Kode verifikasi OTP anda adalah ${generate_otp} Jangan informasikan kode ini ke orang lain.`;

  const checkSendOtp = await sendWhatsapp(phone, message)

  if (!checkSendOtp) {
    return res.status(400).json({
      code: 400,
      success: false,
      data: null,
      message: "OTP failed to send",
    });
  }

  await Otp.create({
    phone: phone,
    otp: generate_otp,
    date: date(),
    time: Math.round(Date.now() / 1000) + validity,
    is_process: 1,
    is_active: 1
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
      is_process: 1,
      is_active: 1
    },
    message: "OTP successfully create"
  });

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

const cekOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const cek = await Otp.findOne({
    where:
    {
      [Op.and]:
        [
          { is_active: 1 },
          { phone: phone },
          { otp: otp }
        ]
    }
  }).catch(error => {
    return res.status(400).json({
      code: 400,
      success: false,
      message: error.message
    });
  });

  if (cek) {
    await Otp.update({ is_active: 0 }, {
      where:
      {
        [Op.and]:
          [
            { is_active: 1 },
            { phone: phone },
            { otp: otp }
          ]
      }
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
      data: phone,
      message: "OTP successfully match"
    });
  } else {
    return res.status(400).json({
      code: 400,
      success: false,
      message: "OTP not match"
    });
  }

};

const newAccount = async (req, res) => {
  const { name, phone, email } = req.body;

  //Cek apakah user pernah daftar sebelumnya
  //Jika belum create user terlebih dahulu
  //Jika sudah pernah daftar tidak perlu create ulang
  cek_phone = await cekPhone(phone, email);

  if (!cek_phone) {
    await Customers.create({
      name: name,
      phone: phone,
      email: email,
      register_via: "AFF",
      member_type: 5,
      status: 0,
      phone_status: 1,
      is_gepd: 0

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
      data: null,
      message: "Account successfully register",
    });

  } else {
    return res.status(400).json({
      code: 400,
      success: false,
      data: cek_phone,
      message: "Account already registered",
    });
  }

};

async function checkPassword(password, repassword) {

  const match = password == repassword;
  return match;
}

const createPassword = async (req, res) => {
  //phone diambil pada saat cek otp
  const { password, repassword, phone } = req.body;

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password, salt);

  cek_pw = await checkPassword(password, repassword);

  if (cek_pw) {

    await Customers.update({ password: hashPassword }, {
      where:
      {
        phone: phone
      }
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
      data: hashPassword,
      message: "Password successfully create",
    });
  } else {
    return res.status(400).json({
      code: 400,
      success: false,
      message: "Password and repassword not match",
    });
  }

};

module.exports = { generate, cekPhone, createOtp, deleteOtp, cekOtp, newAccount, createPassword }

