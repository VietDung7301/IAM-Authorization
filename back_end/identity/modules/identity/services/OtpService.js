const otpGenerator = require('otp-generator')
const helpers = require('../../../helpers')

exports.generateOtp = () => {
    return otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    })
}

exports.saveOtp = async (data) => {
    try {
        const result = await DB_CONNECTION.models.Otp.upsert(data)
        return result
    } catch (error) {
        console.log(error)
        return null
    }
}

exports.sendOtp = async (data) => {
    try {
        const info = await helpers.Mailer.transporter.sendMail({
            from: 'IAM service', // sender address
            to: data.email, // list of receivers
            subject: "Your OTP", // Subject line
            text: data.otp, // plain text body
            html: `<b>${data.otp}</b><p>Expire in 60s. Do not share this OTP</p>`, // html body
        });
        return info.messageId
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.getOtp = async (config) => {
    try {
        const otp = await DB_CONNECTION.models.Otp.findOne({where: config})
        return otp
    } catch (error) {
        console.log(error)
        return null
    }
}