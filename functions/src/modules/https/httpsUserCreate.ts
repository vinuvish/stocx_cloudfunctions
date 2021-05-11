import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
const cors = require('cors');
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
const db = admin.firestore();

const app = express();
const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(cors({ origin: true }));


export const httpsUserCreate = functions.https.onRequest(main);
app.post('/userCreate', async (request, response) => {
    try {
        const {
            email,
            enterpriseId,
            enterpriseName,
            firstName,
            isActive,
            isAdmin,
            isNotificationEnabled,
            lastName,
            password,
            userName,
        } = request.body;

        const data = {
            firstName,
            lastName,
            userName,
            email,
            password,
            isAdmin,
            isActive,
            isNotificationEnabled,
            enterpriseId,
            enterpriseName,
        };

        if (!email || !password) {
            console.log('Error');
        } else {
            const fbUser = await admin.auth().createUser({ email: email, password: password });
            if (fbUser) {
                await db.collection('users')
                    .doc(fbUser.uid)
                    .set(
                        {
                            firstName: firstName,
                            lastName: lastName,
                            userName: userName,
                            email: email,
                            isAdmin: isAdmin,
                            isActive: isActive,
                            isNotificationEnabled: isNotificationEnabled,
                            enterpriseId: enterpriseId,
                            enterpriseName: enterpriseName,
                            timestampRegister: admin.firestore.Timestamp.now(),
                        },
                        { merge: true }
                    );
                const mailbody = `<h1>Hi ${userName}</h1>
                    <h3>Your StockX user credicials  bellow</h3>
                    <h3>Email : <b>${email}</b></h3>
                    <h3>Password : <b>${password}</b></h3>
                    <h2> <b>Note*****</b></h2>
                    <h2>Please Reset the password once you login to the system</h2>
                `;
                await sendMail(fbUser.email ?? email, mailbody, 'StocX', 'Welcom Onboard');
                console.log(data);
            }

        }

        return response.status(200).send({ status: true });
    } catch (error) {
        console.log(error);
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
