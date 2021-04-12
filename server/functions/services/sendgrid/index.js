const sgMail = require('@sendgrid/mail')
const templates = require('./templates')

sgMail.setApiKey(process.env.SENDGRID_APIKEY)

const send = async (props) => {
   const { to, subject, html } = props
   const msg = {
      to,
      from: 'troy@34fame.com',
      subject,
      html,
   }
   if (process.env.APP_ENV !== 'prod') {
      console.info('sendEmail', msg)
   } else {
      sgMail
         .send(msg)
         .then(() => {
            return true
         })
         .catch((error) => {
            console.error(error)
            throw new Error(error)
         })
   }
}

exports.sendRegisterResponse = async (props) => {
   try {
      const { to, name } = props
      const body = templates.register({ name })
      const payload = {
         to,
         subject: 'Conflux Registration Successful',
         html: body,
      }
      await send(payload)
      return { success: true, message: 'Email sent' }
   } catch (error) {
      console.error('sendRegisterResponse', error)
      return { success: false, message: `Email failed. ${error}` }
   }
}

exports.sendPasswordReset = async (props) => {
   try {
      const { to, name, password } = props
      const body = templates.passwordReset({ to, name, password })
      const payload = {
         to,
         subject: 'Conflux Password Reset',
         html: body,
      }
      await send(payload)
      return { success: true, message: 'Email sent' }
   } catch (error) {
      console.error('sendPasswordReset', error)
      return { success: false, message: `Email failed. ${error}` }
   }
}
