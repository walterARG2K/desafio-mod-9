import { algoliaIndex } from "libs/algolia";
import { Order } from "models/orders";
import { findProductById } from "./search";

async function createPreferenceMP(data, productIds, userId) {
    const products = await findProductById(productIds);

    const newOrder = await Order.createOrder({
        info: products.map((i, index) => {
            return {
                id: i.objectID,
                quantity: data[index].quantity,
            };
        }),
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
                ...products.map((i, index) => {
                    return {
                        id: i.objectID,
                        title: i.results.Name,
                        description: i.results.Description,
                        picture_url: i.results.Images[0].url,
                        category_id: i.results.Type,
                        quantity: data[index].quantity,
                        currency_id: "ARS",
                        unit_price: i.results["Unit cost"],
                    };
                }),
            ],
            external_reference: orderId.id,
            notification_url: "https://desafio-mod-9-lnzk.vercel.app/api/webhooks/mercadopago",
        }),
    });
    const preferenceMP = await resultFetchMP.json();
    newOrder.data.payment_url = preferenceMP.init_point;
    newOrder.push();
    return { url: preferenceMP.init_point, orderId: orderId.id };
}

export async function createOrderAndPreference({ productsInfo }, userId) {
    try {
        const productIds = productsInfo.map((i) => i.id);
        return await createPreferenceMP(productsInfo, productIds, userId);
    } catch (error) {
        throw error;
    }
}

export async function getOrdersByUser(userId) {
    const orders = await Order.getAllByUser(userId);
    const collectionOrdersFirestore = [];
    const collectionOrdersIds = [];
    const collectionOrderId = [];
    orders.docs.forEach((doc) => {
        collectionOrdersFirestore.push(doc.data());
        collectionOrdersIds.push(doc.data().info.map((i) => i.id));
        collectionOrderId.push(doc.id);
    });

    const productsUser = (await algoliaIndex.getObjects(collectionOrdersIds.flat())) as any;

    const productsOrder = collectionOrdersFirestore.map((i, aux) => {
        return {
            productInfo: productsUser.results
                .map((j, index) => {
                    if (j.objectID === i?.info[index]?.id) {
                        return {
                            product: j.results,
                            quantity: i.info[index].quantity,

                            productID: j.objectID,
                        };
                    } else return "";
                })
                .filter((i) => i !== ""),
            orderId: collectionOrderId[aux],
            status: i.status,
        };
    });
    return productsOrder;
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
