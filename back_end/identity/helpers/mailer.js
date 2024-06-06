const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_SENDER,
//         pass: process.env.EMAIL_SENDER_PASS
//     }
// })

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.ADMIN_EMAIL_ADDRESS,
      clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: "",
      expires: 3600,
    },
})

module.exports = { transporter }