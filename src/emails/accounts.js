const sgmail = require('@sendgrid/mail')
const sendgridApiKey = process.env.SENDGRID_API_KEY
sgmail.setApiKey(sendgridApiKey)
const sendWelcomeEmail = (email, name) => {

    sgmail.send({
        to: email,
        from: 'patelrajkumar362001@gmail.com',
        subject: 'Thanks for join us!!',
        text: `Welcome ...${name} You are member of our family`
    })
}
const leavingEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: 'patelrajkumar362001@gmail.com',
        subject: 'Farewell message',
        text: `${name} Best Of Luck for Your Future`
    })
}
module.exports = {
    sendWelcomeEmail,
    leavingEmail
}