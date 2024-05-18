const router = require('express').Router()

const Auth = require('../controllers/authController')

router.post('/login', Auth.login)
router.get('/login/google', Auth.loginWithGoogle)
router.get('/login/google/callback', Auth.loginWithGoogleCallback)
router.get('/check-token', Auth.checkToken)
router.post('/register', Auth.register)
router.post('/verify-email', Auth.verifyEmail)
router.post('/resend-otp', Auth.resendOtp)
router.post('/request-reset-password', Auth.reqResetPassword)
router.post('/reset-password', Auth.resetPassword)

module.exports = router
