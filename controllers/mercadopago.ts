import { algoliaIndex } from "libs/algolia";
import mercadopago from "libs/mercadopago";
import { sendgridMail } from "libs/sendgrid";
import { sendEmailProductPaid } from "libs/utils/htmlStatusSucessfull";
import { Order } from "models/orders";
import { User } from "models/users";

export async function getAndUpdateOrder(id) {
    const mpOrder = await mercadopago.merchant_orders.get(id);
    const orderId = mpOrder.body.external_reference;
    const newOrder = new Order(orderId);
    const orderStatus = mpOrder.response.order_status;
    await newOrder.pull();
    newOrder.data.status = orderStatus;

    //Send confirmation product payment status
    if (orderStatus === "paid" && !newOrder.data.mailSend) {
        newOrder.data.mailSend = true;
        newOrder.push();
        sendMailProductPaid(newOrder.data.userId, newOrder.data.productId, newOrder.data);
    }

    return mpOrder.response.order_status;
}

async function sendMailProductPaid(userId, productId, order) {
    const newUser = new User(userId);
    await newUser.pull();
    const fullName = newUser.data.fullName;
    const email = newUser.data.email;
    const productData = (await algoliaIndex.getObject(productId)) as any;
    const msg = {
        to: email,
        from: "daniwortiz003@gmail.com",
        subject: "¡Información sobre tu Producto!",
        html: sendEmailProductPaid(fullName, productData.results, order),
    };
    sendgridMail(msg);
}
