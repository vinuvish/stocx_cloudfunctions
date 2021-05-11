import * as functions from 'firebase-functions';
import * as excel4node from 'excel4node';
import * as admin from 'firebase-admin';
const db = admin.firestore();

import { orderEmailBodyBuilder, sendMail } from '../utils/emailBuilder';

export const onOrderCreate = functions.firestore
    .document('orders/{orderID}')
    .onCreate(async (snapshot, context) => {
        const orderID = await generateAndUpdateOrderID(context, snapshot);
        console.log(orderID);

        await sendMail(
            await getAdminEmails(snapshot),
            await orderEmailBodyBuilder(snapshot, orderID),
            await generateExeclFile(snapshot.data()!['orderProducts'], orderID),
            'StocX',
            `New Order Submitted Order ID# ${orderID}`
        );
    });

const getAdminEmails = async (snapshot: any) => {
    const enterpriseID: string = snapshot.data()['enterpriseId'];
    const enterpriseDocRef = db.collection('enterprises').doc(enterpriseID);
    let adminEmailsArray: Array<string> = [];
    await enterpriseDocRef.get().then((doc) => {
        adminEmailsArray = doc.data()!.adminEmails;
    });

    return adminEmailsArray;
};

const generateAndUpdateOrderID = async (context: any, snapshot: any) => {
    const enterpriseID: string = snapshot.data()['enterpriseId'];
    const enterpriseDocRef = db.collection('enterprises').doc(enterpriseID);
    const orderDocId: string = context.params.orderID;
    let orderNumber = 0;

    await enterpriseDocRef.update({
        orderNumber: admin.firestore.FieldValue.increment(1),
    });

    await enterpriseDocRef.get().then((doc) => {
        orderNumber = doc.data()!.orderNumber;
    });

    const orderID = `${orderDocId.slice(-4).toUpperCase()}-${orderNumber.toString()}`.trim();

    await db
        .collection('orders')
        .doc(orderDocId)
        .update({
            id: orderID,
        })
        .catch((_err) => {
            console.log(_err);
        });

    return orderID;
};


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
    const fileName = `${orderID}.xlsx`;
    console.log(fileName);
    if (snapshot != null) {
        ws.cell(1, 1).string('Products').style(styleHeading);
        ws.cell(1, 2).string('Quantity').style(styleHeading);

        snapshot.forEach((product, i) => {
            console.log(product.name);
            ws.cell(i + 2, 1)
                .string(product.name)
                .style(style);

            ws.cell(i + 2, 2)
                .number(product.orderQty)
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
