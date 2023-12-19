const { myOAuth2Client } = require('../config/mail')
const nodemailer = require("nodemailer")
require("dotenv").config();

async function sendMail(mailOptions) {
  try {
    const myAccessTokenObject = await myOAuth2Client.getAccessToken()
    console.log('haha')
    console.log(mailOptions)
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token
    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken
      }
    })
    // mailOption là những thông tin gửi từ phía client lên thông qua API
    // const mailOptions = {
    //     to: email, // Gửi đến ai?
    //     subject: subject, // Tiêu đề email
    //     html: `<h3>${content}</h3>` // Nội dung email
    // }
    // Gọi hành động gửi email
    console.log('Before sending email');
    await transport.sendMail(mailOptions);
    console.log('After sending email');
    res.status(200).json({ message: 'Email sent successfully.' })
  } catch (error) {
    // Có lỗi thì các bạn log ở đây cũng như gửi message lỗi về phía client
    console.log(error)
    res.status(500).json({ errors: error.message })
  }
}

module.exports = { sendMail };