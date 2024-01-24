const nodemailer = require("nodemailer");
const user = process.env.SYSTEM_EMAIL;
const pass = process.env.SYSTEM_EMAIL_PASSWORD;

let length = 0;
let transporter = {}, mainOptions = {};
exports.sendEmail = (to, subject, text, html, inReplyToGmail, messageIdGmail) => {
    if (user && pass) {
            transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: user, pass: pass }
        });
        
        mainOptions = {
            from: user,
            to: to,
            subject: subject,
            text: text,
            html: html,
        }
        if (inReplyToGmail){
            mainOptions = {...mainOptions,inReplyTo: inReplyToGmail}
        }
        if (messageIdGmail){
            mainOptions = {...mainOptions,messageId: messageIdGmail}
        }
        length = length + 1
        const send = () => {
            transporter.sendMail(mainOptions, (err, success) => {
                length = length - 1;
                if (success) {
                    console.log(success);
                    let messageId = success.messageId;
                    console.log(messageId);
                }
                if (err) {
                    console.log(err)
                }
            });
        }
        setTimeout(send, length * 2000)
    }   
}