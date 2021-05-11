import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';


const app = express();
const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

export const httpsUserResetPassword = functions.https.onRequest(main);
app.post('/userResetPassword', async (request, response) => {
    try {
        const { firstName,
            lastName,
            email,
            id,
            password, } = request.body;
        console.log(request.body);
        if (password && id) {
            await admin.auth().updateUser(id, {
                password: password,
            });

            const mailbody = `<h1>Hi ${firstName} ${lastName}</h1>
            <h3>Your password has been reseted </h3>`;
            await sendMail(email, mailbody, 'StockX', 'Password Reset');
            console.log(`Mail Sent to ${email}`)
            return response.status(200).send({ status: true });
        }
        return response.status(500).send({ status: false });


    } catch (error) {
        console.error(error)
        return response.status(500).json({ status: false, error: error });

    }
    async function sendMail(emailAddress: string, mailBody: string, from: string, subject: string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'alerts@codememory.com',
                pass: '123!@#Qwerty',
            },
        });
        const mailOptions = {
            from: from,
            to: `${emailAddress}`,
            subject: `${subject}`,
            html: `${mailBody}`,
        };
        setTimeout(() => {
            transporter.sendMail(mailOptions, (error, data) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log('Sent!');
            });
        }, 2000);
    }
});
