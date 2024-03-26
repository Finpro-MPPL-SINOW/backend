const randomString = require('randomstring')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const ApiError = require('./ApiError')
const verificationEmailHTML = require('../lib/verificationEmailHTML')
const resetPasswordHTML = require('../lib/resetPasswordHTML')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
})

const generateOTP = () =>
  randomString.generate({ length: 4, charset: 'numeric' })

const sendMail = async (mailOptions, next) => {
  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    return next(new ApiError(error, 500))
  }
  return true
}

const sendOTPVerificationEmail = async (email, next) => {
  try {
    const otpCode = generateOTP()

    const mailOptions = {
      from: { name: 'SINOW', address: process.env.APP_EMAIL },
      to: email,
      subject: 'SINOW - Verifikasi OTP',
      html: verificationEmailHTML(otpCode),
    }

    await sendMail(mailOptions, next)

    return otpCode
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const sendResetPasswordEmail = async (auth, next) => {
  try {
    const generateToken = jwt.sign(
      { id: auth.id, email: auth.email },
      process.env.JWT_SECRET,
      { expiresIn: 1800 },
    )

    const mailOptions = {
      from: { name: process.env.APP_NAME, address: process.env.EMAIL },
      to: auth.email,
      subject: 'SINOW - Reset Password',
      html: resetPasswordHTML(generateToken),
    }

    await sendMail(mailOptions, next)
  } catch (error) {
    return next(new ApiError(error, 500))
  }
  return true
}

module.exports = { sendOTPVerificationEmail, sendResetPasswordEmail }
