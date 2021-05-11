import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as excel4node from 'excel4node';
import * as nodemailer from 'nodemailer';
import * as moment from 'moment';

const wb = new excel4node.Workbook();
const ws = wb.addWorksheet('User List');
const style = wb.createStyle({
    font: {
        size: 12,
    },
    alignment: {
        shrinkToFit: false,
        wrapText: false,
    },
});

const styleHeading = wb.createStyle({
    alignment: {
        shrinkToFit: true,
        wrapText: true,
    },
    font: {
        size: 18,
    },
});

let users: admin.auth.UserRecord[] = [];

async function listAllUsers(nextPageToken) {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

    listUsersResult.users.forEach((user) => {
        if (user.email) users.push(user);
    });

    if (listUsersResult.pageToken) {
        await listAllUsers(listUsersResult.pageToken);
    }
}

export const scheduledUsersExportAuth = functions.pubsub
    .schedule('every 2 minutes')
    .onRun(async (context) => {
        await listAllUsers(undefined);

        if (users.length > 0) {
            ws.cell(1, 1).string('Uid').style(styleHeading);
            ws.cell(1, 2).string('Email').style(styleHeading);
            ws.cell(1, 3).string('Email Verified').style(styleHeading);
            ws.cell(1, 4).string('LastSignInTime').style(styleHeading);
            ws.cell(1, 5).string('CreationTime').style(styleHeading);
            ws.cell(1, 6).string('DisplayName').style(styleHeading);

            users.forEach((user, i) => {
                ws.cell(i + 2, 1)
                    .string(user.uid)
                    .style(style);

                ws.cell(i + 2, 2)
                    .string(user.email)
                    .style(style);

                ws.cell(i + 2, 3)
                    .string(user.emailVerified ? 'Yes' : 'No')
                    .style(style);

                ws.cell(i + 2, 4)
                    .string(
                        moment(user.metadata.lastSignInTime)
                            .format('YYYY-MM-DDTHH:mm:ssZZ')
                            .toString() ?? ''
                    )
                    .style(style);

                ws.cell(i + 2, 5)
                    .string(
                        moment(user.metadata.creationTime)
                            .format('YYYY-MM-DDTHH:mm:ssZZ')
                            .toString() ?? ''
                    )
                    .style(style);

                ws.cell(i + 2, 6)
                    .string(user.displayName ?? '')
                    .style(style);
            });
            const currentDate = moment(Date.now()).format('YYYY-MM-DDTHH:mm').toString();
            const fileName = `userList_${currentDate}.xlsx`;

            wb.write(`/tmp/${fileName}`, function (err, stats) {
                if (err) console.log('errorLog', err);
                if (stats) {
                    sendMail(
                        ['vinuvish@codememory.com'],
                        `user List at ${currentDate}`,
                        fileName,
                        'StocX',
                        `Daily ${currentDate} user list trigger`
                    )
                        .then(() => {
                            console.log('Mail sent');
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            });
            users = [];
        }
    });

async function sendMail(
    emailAddress: Array<string>,
    mailBody: string,
    fileName: string,
    from: string,
    subject: string
) {
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
        to: `${emailAddress.toString()}`,
        subject: `${subject}`,
        html: `${mailBody}`,
        attachments: [
            {
                filename: fileName,
                path: `/tmp/${fileName}`, // stream this file
            },
        ],
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
