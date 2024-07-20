const Member = require("../models/Member.model");
const Candidate = require("../models/Candidate.model");
const Employer = require("../models/Employer.model");
const Admin = require("../models/Admin.model");
const Company = require("../models/Company.model");

const mongoose = require("mongoose");
const mailer = require("../../utils/mail/mailing");
const bcrypt = require("bcrypt");
const keys = require("../../config/secrets");
const fs = require("fs");
const path = require("path");

class AuthController {

  // [POST] /auth/login
  async loginWithPassword(req, res) {
    const { email, password, role } = req.body;

    const member = await Member.findOne({ email: email });

    if (member && member.verifiedAt !== null && member.role === role) {
      bcrypt.compare(password, member.password, (err, result) => {
        if (result) {
          return res.json({
            message: "Đăng nhập thành công",
          });
        } else {
          return res.status(401).json({
            message: "Email hoặc password không chính xác",
          });
        }
      });

    } else {
      return res.status(401).json({
        message: "Email hoặc password không chính xác",
      });
    }

  }

  // [POST] /auth/sign-up/candidate
  async candidateRegister(req, res) {
    let info = req.body;
    if (info.password !== info["confirm-password"]) {
      return res.status(409).json({
        message: "Mật khẩu xác nhận không khớp!",
      })
    }
    const email = await Member.findOne({ email: info.email })
    if (email) {
      return res.status(409).json({
        message: "Email đã tồn tại",
      });
    } else {
      await bcrypt.hash(info.password, keys.BCRYPT_SALT_ROUND)
        .then((hashPassword) => info = { ...info, password: hashPassword })

      const session = await mongoose.startSession();
      session.startTransaction();
      try {

        const newMember = await Member.create([{
          ...info,
          role: "candidate"
        }], { session });

        await Candidate.create([{
          member: newMember.id,
        }], { session })

        
        await session.commitTransaction();
        session.endSession();
        
        const emailTemplatePath = path.join(__dirname, '../../resources/views/form-verify.html');
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
        await bcrypt.hash(info.email, keys.BCRYPT_SALT_ROUND)
          .then((hashEmail) => {
            const emailContent = emailTemplate.replace('{{verificationLink}}', `${process.env.APP_URL}/auth/verify?email=${info.email}&token=${hashEmail}`);
            mailer.sendMail(info.email, "Verify Email", emailContent);
          })

        return res.sendStatus(200);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
          message: error,
        })
      }
    }
  }

  // [POST] /auth/send-mail
  async sendMail(req, res) {
    const { email } = req.body;
    const member = await Member.findOne({ email: email });

    if (member) {
      if (member.verifiedAt === null) {
        const emailTemplatePath = path.join(__dirname, '../../resources/views/form-verify.html');
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
        await bcrypt.hash(email, keys.BCRYPT_SALT_ROUND)
          .then((hashEmail) => {
            const emailContent = emailTemplate.replace('{{verificationLink}}', `${process.env.APP_URL}/auth/verify?email=${email}&token=${hashEmail}`);
            mailer.sendMail(email, "Verify Email", emailContent);
          })

        return res.sendStatus(200);
      } else {
        return res.status(401).json({
          message: "Email đã được xác minh!",
        });
      }
    } else {
      return res.status(409).json({
        message: "Email chưa được đăng ký!",
      });
    }
  }

  // [POST] /auth/sign-up/employer
  async employerRegister(req, res) {
    let info = req.body;
    if (info.password !== info["confirm-password"]) {
      return res.status(409).json({
        message: "Mật khẩu xác nhận không khớp!",
      })
    }
    const email = await Member.findOne({ email: info.email })
    if (email) {
      return res.status(409).json({
        message: "Email đã tồn tại",
      });
    } else {
      await bcrypt.hash(info.password, keys.BCRYPT_SALT_ROUND)
        .then((hashPassword) => info = { ...info, password: hashPassword })

      const session = await mongoose.startSession();
      session.startTransaction();
      try {

        const newMember = await Member.create([{
          fullName: info.fullName,
          email: info.email,
          password: info.password,
          tel: info.tel,
          gender: info.gender,
          role: "employer",
        }], { session });

        await Employer.create([{
          member: newMember.id,
        }], { session });

        await Company.create([{
          name: info.company,
          address: {
            province: info.province,
            district: info.district,
            ward: info.ward,
          }
        }], { session })
        
        await session.commitTransaction();
        session.endSession();
        
        const emailTemplatePath = path.join(__dirname, '../../resources/views/form-verify.html');
        const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
        await bcrypt.hash(info.email, keys.BCRYPT_SALT_ROUND)
          .then((hashEmail) => {
            const emailContent = emailTemplate.replace('{{verificationLink}}', `${process.env.APP_URL}/auth/verify?email=${info.email}&token=${hashEmail}`);
            mailer.sendMail(info.email, "Verify Email", emailContent);
          })

        return res.sendStatus(200);
      } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
          message: error,
        })
      }
    }
  }

  // [GET] /auth/verify
  verifyEmail(req, res) {
    const { email, token } = req.query;
    bcrypt.compare(email, token, async (err, result) => {
      if (result) {
        const member = await Member.findOne({ email: email });

        if (member && member.verifiedAt === null) {
          await Member.updateOne({ email: email }, {
            verifiedAt: new Date(),
          })
  
          return res.redirect(`${process.env.URL_CLIENT}/verify/success`);
        }
      } 

      return res.redirect(`${process.env.URL_CLIENT}/verify/error`);
    });
  }

}

module.exports = new AuthController;