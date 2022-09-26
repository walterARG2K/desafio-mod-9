import { algoliaIndex } from "libs/algolia";
import { Order } from "models/orders";
import { findProductById } from "./search";

async function createPreferenceMP(data, productId, userId) {
    const product = await findProductById(productId);
    const newOrder = await Order.createOrder({
        extraInfo: data,
        productId,
        userId,
        status: "pending",
    });
    const orderId = await newOrder.ref.get();

    const resultFetchMP = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.MP_TOKEN,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: [
                {
                    title: product.Name,
                    description: product.Description,
                    picture_url: product.Images[0].url,
                    category_id: product.Type,
                    quantity: data.quantity,
                    currency_id: "ARS",
                    unit_price: product["Unit cost"],
                },
            ],
            external_reference: orderId.id,
            notification_url: "https://desafio-mod-9-lnzk.vercel.app/api/webhooks/mercadopago",
        }),
    });
    const preferenceMP = await resultFetchMP.json();
    return { url: preferenceMP.init_point, orderId: orderId.id };
}

export async function createOrderAndPreference(data, productId, userId) {
    try {
        return await createPreferenceMP(data, productId, userId);
    } catch (error) {
        throw error;
    }
}

export async function getOrdersByUser(userId) {
    const orders = await Order.getAllByUser(userId);
    const collectionOrdersFirestore = [];
    const collectionOrdersIds = [];
    const collectionOrderId = [];
    const collectionOrders = [];
    orders.docs.forEach((doc) => {
        collectionOrdersFirestore.push(doc.data());
        collectionOrdersIds.push(doc.data().productId);
        collectionOrderId.push(doc.id);
    });

    const productsUser = (await algoliaIndex.getObjects(collectionOrdersIds)) as any;

    productsUser.results.forEach((item, index) => {
        collectionOrders.push({
            product: item.results,
            orderId: collectionOrderId[index],
            productId: item.objectID,
            status: collectionOrdersFirestore[index].status,
        });
    });

    return collectionOrders;
}

export async function getOrder(orderId) {
    const order = new Order(orderId);
    await order.pull();

    try {
        const productUser = (await algoliaIndex.getObject(order.data.productId)) as any;

        return {
            product: productUser.results,
            productId: productUser.objectID,
            status: order.data.status,
        };
    } catch (error) {
        throw error;
    }
}
