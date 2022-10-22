import { algoliaIndex } from "libs/algolia";
import mercadopago from "libs/mercadopago";
import { sendgridMail } from "libs/sendgrid";
import { sendEmailProductPaid } from "libs/utils/htmlStatusSucessfull";
import { Order } from "models/orders";
import { User } from "models/users";

export async function getAndUpdateOrder(id) {
    try {
        const mpOrder = await mercadopago.merchant_orders.get(id);

        const orderId = mpOrder.body.external_reference;
        console.log("ORDERID ====>", orderId);
        const newOrder = new Order(orderId);
        console.log("NEW ORDER =====>", newOrder);
        const orderStatus = mpOrder.response.order_status;
        await newOrder.pull();
        console.log("NEW ORDER DATA =====>", newOrder.data);
        newOrder.data.status = orderStatus;
        newOrder.push();

        //Send confirmation product payment status
        if (orderStatus === "paid") {
            await sendMailProductPaid(newOrder.data.userId, newOrder.data.productId, newOrder.data);
        }

        return mpOrder.response.order_status;
    } catch (error) {
        return error;
    }
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
    await sendgridMail(msg);
    return true;
}
