import { algoliaIndex } from "libs/algolia";
import mercadopago from "libs/mercadopago";
import { sendgridMail } from "libs/sendgrid";
import { sendEmailProductPaid } from "libs/utils/htmlStatusSucessfull";
import { Order } from "models/orders";
import { User } from "models/users";

export async function getAndUpdateOrder(id) {
    try {
        const mpOrder = await mercadopago.merchant_orders.get(id);
        console.log("MPORDER =====>", mpOrder);

        const orderId = mpOrder.body.external_reference;
        const newOrder = new Order(orderId);
        const orderStatus = mpOrder.response.order_status;
        console.log("ORDER STATUS =====>", orderStatus);
        await newOrder.pull();
        newOrder.data.status = orderStatus;
        newOrder.push();

        //Send confirmation product payment status
        if (orderStatus === "paid") {
            await sendMailProductPaid(newOrder.data.userId, newOrder.data.info, newOrder.data);
        }

        return mpOrder.response.order_status;
    } catch (error) {
        console.log("ERROR ======>", error);

        return error;
    }
}

async function sendMailProductPaid(userId, productsData, order) {
    try {
        const newUser = new User(userId);
        await newUser.pull();
        const fullName = newUser.data.fullName;
        const email = newUser.data.email;
        const productsIds = productsData.map((i) => i.id);
        const productData = (await algoliaIndex.getObjects(productsIds)) as any;
        const msg = {
            to: email,
            from: "daniwortiz003@gmail.com",
            subject: "¡Información sobre tu Producto!",
            html: sendEmailProductPaid(fullName, productData.results, order),
        };
        await sendgridMail(msg);
    } catch (error) {
        throw error;
    }
    return true;
}
