import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
const { GoogleSpreadsheet } = require('google-spreadsheet');
import * as DateFns from 'date-fns';

// spreadsheet key is the long id in the sheets URL
const SPREADSHEET_ID = `1jxRKrOjjagUZ0905Dyl6bbTX7JGRsxF_p9SR4gCM68A`
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);


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
function formateDate(date: string): string {
    const mydate = new Date(date);
    return DateFns.format(mydate, 'yyyy-MMM-dd');
}

function formateTime(date: string): string {
    const mydate = new Date(date);
    return DateFns.format(mydate, 'k:mm');
}

export const scheduledUsersGoogleSheetAuth = functions
    .runWith({ timeoutSeconds: 300, memory: '2GB' })
    .pubsub.schedule('every 1 minutes')
    .onRun(async (context) => {
        await listAllUsers(undefined);
        await doc.useServiceAccountAuth({
            client_email: 'service-account@stackoverflow-data-analyse.iam.gserviceaccount.com',
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCI8dnSDD0F9YkQ\n12kDmfQ11ty1wPqGzEKo9OzLtUttWtcV+L+mEPBUSUOl5KfzUuAXXPLiK/7jRBxc\nfA+4R0v27sRo3wc8pufE5YwadHVfpiDjEHd3r1MudxeehTHjkGda+GqgVkPKk3Cv\nZ/wDDqqE5Ag8vdlxr+3+PQUFPiPO4dAbQUOySLE//S4RYVYgYxZBsA5JhHaw4IRA\nzrRoDgIJL84p5fiLgIEO0tTVB8J5LL5ycYOqaIVe5ETatTiFYz8fvk6G30CF4CjW\nAteKF1naHdGYLY8hxr3I01C4IAEb5sfD46uw07bFUcbfB1bOBBChsj5nksG1AEFE\n1LChQLr3AgMBAAECggEAE16koOQgQYEwPj8/AvEPV19+X6rdr0ahlcTxiq1S74hu\nFxUprl3Y+w2ofC9yXfqhPaIPrKlCZ8zQzM1eFSzodBM47rMVEqFySNRFqSbtxHX6\nqC3tEp2sK0ym/OykA3xU/MtZnDd3ZpDM2yffFQ5JqiWYJgHzCUneuht8DqNybHwp\nJMm5SbMxDurmVZ2vYKjSlGeFRT4m8XYdoHgP8ykqr1WJXj4OfWbpP8HFpPjhxSCs\nJ1+RtUkOfYxBqY7w8Sw0CDk09ljdXfx08eXzicMPx3kFb8UpKDbwXoXgUeOCfUYY\n06j6k74a2X47szicyZS6ApvvMWLIYt1IKyBScxsJYQKBgQC+aMVHyfVHtkPdkKCn\nEzJmCQvzRM7sar1oGSiOWs6EKvID7HzpCRnqu9Dw26nHgdL/yHakbW0QhqkaEQHZ\n32jSOPY+/rP3i7+zYmrlSIXcjMDf3+GdlL1xY+eCZlDL3DRbs94TSZAKdfZdjM46\nTZ6xARuV99xZn+RNO9mdcYQNJwKBgQC4HlBUJoGHsVPoQMqPx5SqEychHnuFXmuH\nRiyhtILyHMv/eRtFYJ02x1tnh6mqyOL5kddYXGq2gqJ+qmvt4ppGoYoHIVjCejW8\nJn1nUF0YJ3Wuq/Qrb1YTarkdYAABhN7WLHRLw8o5l05hTLpXDakz7+yikEOuzQKu\nzncdSqslsQKBgAf7JkHDElfmKOQRmtpF8LfcKzcQLEg2lSfW3h9RaRSbJDfL4tR1\nwDNZmgFug6hMJcb45RgxSgAGVPI1wkkaly8wmgm77Vkz714agvaHWq0K7U60+KT9\nRg+Jq3uIxFw3J66sVGOkkrgNh70WGNLSzBMJQ9m+YOsUy6H9Hzr9NhbDAoGASM1j\nwgJ/0WHi5cFI11V5iU6NeGEPQos1RYYP+9jetlGAsIH4sJQlVhW6JNPV2PwaE8kB\nN6VDZOt+yUsl5ihmDGuvomYjLLMaME2f5Iw4Y2am9+xyXgJmLMNUczMUjYU2f8WQ\nLq06d09G5N5sCCQUtb62+QjGWoYh+3EUVHbD+eECgYB3VgytSBQiaVzRrGZvKUdr\nW40G7COa3uCfHmg4buB0s8hWO4M1znZtJiaxyEVK5cYaf0koq3Hv0K0falWv7elh\nuoSoZJjYYdHP3olBui5u1WL0rm+1uB0XsQvQ0zCDPdDjYQ+UPGmYVly6U1IexzoL\nREGYTmarxRJHFTRNpAW5ZA==\n-----END PRIVATE KEY-----\n",
        });
        await doc.loadInfo();
        console.log(doc.title);
        const sheet = doc.sheetsByIndex[0];
        sheet.clear()
        await sheet.loadCells();
        console.log(sheet.cellStats);


        const a1 = sheet.getCell(0, 0)
        const b1 = sheet.getCell(0, 1)
        const c1 = sheet.getCell(0, 2)
        const d1 = sheet.getCell(0, 3)
        const e1 = sheet.getCell(0, 4)
        const f1 = sheet.getCell(0, 5)
        const g1 = sheet.getCell(0, 6)
        const h1 = sheet.getCell(0, 7)

        a1.value = 'Uid';
        b1.value = 'Email';
        c1.value = 'Email Verified';
        d1.value = 'Last Sign In Date';
        e1.value = 'Last Sign In Time';
        f1.value = 'Creation Date';
        g1.value = 'Creation Time';
        h1.value = 'DisplayName';

        users.forEach((user, i) => {
            const uid = sheet.getCell(i + 1, 0);
            const email = sheet.getCell(i + 1, 1);
            const emailVerified = sheet.getCell(i + 1, 2);
            const lastSignInDate = sheet.getCell(i + 1, 3);
            const lastSignInTime = sheet.getCell(i + 1, 4);
            const creationDate = sheet.getCell(i + 1, 5);
            const creationTime = sheet.getCell(i + 1, 6);
            const displayName = sheet.getCell(i + 1, 7);

            uid.value = user.uid;
            email.value = user.email;
            emailVerified.value = user.emailVerified ? 'Yes' : 'No';
            lastSignInDate.value = user.metadata.lastSignInTime == null ? 'Never Signed' : formateDate(user.metadata.lastSignInTime);
            lastSignInTime.value = user.metadata.lastSignInTime == null ? 'Never Signed' : formateTime(user.metadata.lastSignInTime);
            creationDate.value = formateDate(user.metadata.creationTime)
            creationTime.value = formateTime(user.metadata.creationTime)
            displayName.value = user.displayName ?? '';


        });
        users = [];
        await sheet.saveUpdatedCells();
        console.log('Sheet 1 update successfully!!!!!');
        const sheet2 = await doc.sheetsByIndex[1];
        await sheet2.loadCells();
        const sheet2_a1 = sheet2.getCell(0, 0)
        const sheet2_b1 = sheet2.getCell(0, 1)
        sheet2_a1.value = 'Last Updated'

        sheet2_b1.value = DateFns.format(Date.now(), 'yyyy-MMM-dd k:mm');


        await sheet2.saveUpdatedCells();
        console.log('Sheet 2 update successfully!!!!!');

    });
