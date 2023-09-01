/**
 * This file is used to actually send emails.
 * Any other functions relating to emails, such as active password reset tokens, are in server/authentication.js.
 */
import { QBREADER_EMAIL_ADDRESS } from '../constants.js';
import { createTransport } from 'nodemailer';
const transporter = createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY ?? 'sendgrid_api_key',
    },
});
if (process.env.SENDGRID_API_KEY) {
    transporter.verify((error, _success) => {
        if (error) {
            console.log(error);
            throw error;
        }
    });
}
/**
 *
 * @param {Object} param0
 * @param {String} param0.to
 * @param {String} [param0.subject='']
 * @param {String} param0.text
 * @param {String} param0.html
 * @returns
 */
async function sendEmail({ to, subject = '', text, html }) {
    const message = {
        from: QBREADER_EMAIL_ADDRESS,
        to,
        subject,
        text,
        html,
    };
    try {
        return transporter.sendMail(message);
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
export { sendEmail };
