import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as excel4node from 'excel4node';
import { sendMail, adminOrderEmailBodyBuilder } from '../utils/emailBuilder';

const db = admin.firestore();
const fcm = admin.messaging();

export const onOrderUpdate = functions.firestore
    .document('orders/{orderID}')
    .onUpdate(async (change, context) => {
        const afterData = change.after.data() // data after the write
        const beforeData = change.before.data()
        var devTokens: Array<string> = [];


        if (afterData!.status != beforeData!.status) {
            console.log(`Before Status : ${beforeData!.status} After Status : ${afterData!.status}`);
            let userRef = await db.collection('users').doc(afterData!.userUid).get();
            devTokens = userRef.data()!.devTokens;
            console.log(devTokens);

            await sendMail(
                userRef.data()!.email,
                await adminOrderEmailBodyBuilder(afterData, afterData!.id),
                await generateExeclFile(afterData!.orderProducts, afterData!.id),
                'StocX',
                `Your Order #${afterData!.id} is  ${afterData!.status}`
            );

            const payload: admin.messaging.MessagingPayload = {
                notification: {
                    title: 'Order Status Update',
                    body: `Your Order #${afterData!.id} is  ${afterData!.status}`,
                    icon: 'your-icon-url',
                    click_action: 'FLUTTER_NOTIFICATION_CLICK'
                }
            }
            return fcm.sendToDevice(devTokens, payload);
        }
        return;
    });





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

const generateExeclFile = async (snapshot: any, orderID: string) => {
    const fileName = `${orderID}_${Date.now()}.xlsx`;
    console.log(fileName);
    if (snapshot != null) {
        ws.cell(1, 1).string('Products').style(styleHeading);
        ws.cell(1, 2).string('confirm Quantity').style(styleHeading);
        ws.cell(1, 3).string('Return Quantity').style(styleHeading);
        snapshot.forEach((product, i) => {
            console.log(product.name);
            ws.cell(i + 2, 1)
                .string(product.name)
                .style(style);

            ws.cell(i + 2, 2)
                .number(product.orderQtyConfirmed)
                .style(style);
            ws.cell(i + 2, 3)
                .number(product.returnQty)
                .style(style);

        });



        wb.write(`/tmp/${fileName}`, function (err, stats) {
            if (err) console.log('errorLog', err);
            if (stats) {
                return fileName
            }
            return false

        });

    }
    return fileName

}
