import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findProductById } from "controllers/search";
import { middleware } from "libs/middleware";
import { getOrder } from "controllers/order";

export default middleware(
    methods({
        async get(req: NextApiRequest, res: NextApiResponse) {
            const orderID = req.query.orderID as string;

            try {
                const product = await getOrder(orderID);
                res.send(product);
            } catch (error) {
                res.status(400).send(error);
            }
        },
    })
);
