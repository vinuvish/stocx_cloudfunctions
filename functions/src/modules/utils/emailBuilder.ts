import * as nodemailer from 'nodemailer';

export const orderEmailBodyBuilder = async (snapshot: any, orderID: string) => {
    let htmlTable: string = '';
    for (let count: number = 0; count < snapshot.data()['orderProducts'].length; count++) {
        const name = snapshot.data()['orderProducts'][count]['name'];
        const orderQty = snapshot.data()['orderProducts'][count]['orderQty'];

        htmlTable += `<tr>` + `<td> ${name}</td>` + `<td> ${orderQty}</td>` + `</tr>`;
    }

    const mailBody: string =
        `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <!-- <link rel="stylesheet" type="text/css" href="invoce.css"> -->
           <script src='https://kit.fontawesome.com/a076d05399.js'></script>
            <style>
            body {
                font-family: Arial;
                font-size: 17px;
                padding: 8px;
            }
            * {
                box-sizing: border-box;
            }
            .row {
                display: -ms-flexbox;
                /* IE10 */
                display: flex;
                -ms-flex-wrap: wrap;
                /* IE10 */
                flex-wrap: wrap;
                margin: 0 -16px;
            }
            .col-25 {
                -ms-flex: 25%;
                /* IE10 */
                flex: 25%;
            }
            .col-50 {
                -ms-flex: 50%;
                /* IE10 */
                flex: 50%;
            }
            .col-75 {
                -ms-flex: 75%;
                /* IE10 */
                flex: 75%;
            }
            .col-25,
            .col-50,
            .col-75 {
                padding: 0 16px;
            }
            .container {
                background-color: #f2f2f2;
                padding: 5px 20px 15px 20px;
                border: 1px solid lightgrey;
                border-radius: 3px;
            }
            label {
                margin-bottom: 10px;
                display: block;
            }
           table {
                border-collapse: collapse;
                width: 100%;
            }
            th,
            td {
                text-align: left;
                padding: 8px;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2
            }
            th {
                background-color: #4CAF50;
                color: white;
            }
            th.total {
                background-color: rgb(181, 192, 181);
                color: white;
            }
            .lbl {
                color: gray;
            }
            </style>
        </head>
        <body>

            <h2>Order # ${orderID}</h2>
            <div class="row">
                <div class="col-100">
                    <div class="container">
                        <div class="row">
                            <div class="column">
                                <h3>Customer Details</h3>
                                <label><b>Name :</b></label>
                                <label class="lbl">${snapshot.data()['userName']}</label>
                                <label><b>Mail :</b></label>
                                <label class="lbl">${snapshot.data()['userEmail']}</label>
                                <label><b>Order Date :</b></label>
                                <label class="lbl">${snapshot.data()['timestampAdded'].toDate()} </label>
                                // <label><b>Expected Delivery Date :</b></label>
                                // <label class="lbl"> ${snapshot.data()['timestampExpDeliveryDate'].toDate()} </label>
                            </div>
                            <div class="column" style="padding-left: 50px;">
                                <h3>Order Details</h3>
                                <label><b>Total Items :</b></label>
                                <label class="lbl"> ${snapshot.data()['totalItems']} </label>
                                <label><b>Notes :</b></label>
                                <label class="lbl"> ${snapshot.data()['notes']} </label>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-25">
                                <div class="container">
                                    <table>
                                        <tr>
                                            <th>Products</th>
                                            <th>Quantity</th>
                                            // <th>Price</th>
                                        </tr>
                                  ` +
        htmlTable +
        `
                                        <tr>
                                            // <th class="total">Total</th>
                                            // <th class="total"></th>
                                            // <th class="total">$1000</th>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>


        </body>

        </html>`;

    console.log(mailBody);

    return mailBody;
};

export const adminOrderEmailBodyBuilder = async (afterData: any, orderID: string) => {
    let htmlTable: string = '';
    for (let count: number = 0; count < afterData.orderProducts.length; count++) {
        const name = afterData.orderProducts[count]['name'];
        const orderQty = afterData.orderProducts[count]['orderQtyConfirmed'];
        const returnOrderQty = afterData.orderProducts[count]['returnQty'];


        htmlTable += `<tr>` + `<td> ${name}</td>` + `<td> ${orderQty}</td>` + `<td> ${returnOrderQty}</td>` + `</tr>`;
    }

    const mailBody: string =
        `<!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <!-- <link rel="stylesheet" type="text/css" href="invoce.css"> -->
           <script src='https://kit.fontawesome.com/a076d05399.js'></script>
            <style>
            body {
                font-family: Arial;
                font-size: 17px;
                padding: 8px;
            }
            * {
                box-sizing: border-box;
            }
            .row {
                display: -ms-flexbox;
                /* IE10 */
                display: flex;
                -ms-flex-wrap: wrap;
                /* IE10 */
                flex-wrap: wrap;
                margin: 0 -16px;
            }
            .col-25 {
                -ms-flex: 25%;
                /* IE10 */
                flex: 25%;
            }
            .col-50 {
                -ms-flex: 50%;
                /* IE10 */
                flex: 50%;
            }
            .col-75 {
                -ms-flex: 75%;
                /* IE10 */
                flex: 75%;
            }
            .col-25,
            .col-50,
            .col-75 {
                padding: 0 16px;
            }
            .container {
                background-color: #f2f2f2;
                padding: 5px 20px 15px 20px;
                border: 1px solid lightgrey;
                border-radius: 3px;
            }
            label {
                margin-bottom: 10px;
                display: block;
            }
           table {
                border-collapse: collapse;
                width: 100%;
            }
            th,
            td {
                text-align: left;
                padding: 8px;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2
            }
            th {
                background-color: #4CAF50;
                color: white;
            }
            th.total {
                background-color: rgb(181, 192, 181);
                color: white;
            }
            .lbl {
                color: gray;
            }
            </style>
        </head>
        <body>

            <h2>Order # ${orderID}</h2>
            <div class="row">
                <div class="col-100">
                    <div class="container">
                        <div class="row">
                            <div class="column">
                                <h3>Customer Details</h3>
                                <label><b>Name :</b></label>
                                <label class="lbl">${afterData.userName}</label>
                                <label><b>Mail :</b></label>
                                <label class="lbl">${afterData.userEmail}</label>
                                <label><b>Order Date :</b></label>
                                <label class="lbl">${afterData.timestampAdded.toDate()} </label>
                                <label><b>Expected Delivery Date :</b></label>
                                <label class="lbl"> ${afterData.timestampDeliveryDate.toDate()} </label>
                            </div>
                            <div class="column" style="padding-left: 50px;">
                                <h3>Order Details</h3>
                                <label><b>Total Items :</b></label>
                                <label class="lbl"> ${afterData.totalItems} </label>
                                <label><b>Notes :</b></label>
                                <label class="lbl"> ${afterData.notes} </label>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-25">
                                <div class="container">
                                    <table>
                                        <tr>
                                            <th>Products</th>
                                            <th>Confirm Qty</th>
                                            <th>Return Qty</th>
                                        </tr>
                                  ` + htmlTable + `
                                        <tr>
                                            <th class="total">Total</th>
                                            <th class="total"></th>
                                            <th class="total">$1000</th>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>


        </body>

        </html>`;

    console.log(mailBody);

    return mailBody;
};

export const sendMail = async (
    emailAddress: Array<string>,
    mailBody: string,
    fileName: string,
    from: string,
    subject: string
) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: '465',
        secure: true,
        auth: {
            user: 'alerts@codememory.com',
            pass: '123!@#Qwerty',
        },
    });
    const mailOptions = {
        from: from,
        to: `${emailAddress.toString()}`,
        subject: subject,
        html: mailBody,
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
};
