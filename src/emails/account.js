const sgMail = require('@sendgrid/mail')
const sendGrinApiKey = process.env.SENDGRID_API_KEY;

const SendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ismailisraa2021@gmail.com',
        subject: "Thanks for joining in! ",
        text: `Welcome to the app ,${name} .`
    })
}
const SendCanselationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ismailisraa2021@gmail.com',
        subject: "Sorry to see you ! ",
        text: `Goodbye ,${name} .`
    })
}

module.exports = { SendWelcomeEmail, SendCanselationEmail }