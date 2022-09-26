import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findProductById } from "controllers/search";
import { getOrdersByUser } from "controllers/order";
import { middleware } from "libs/middleware";

export default middleware(
    methods({
        async get(req: NextApiRequest, res: NextApiResponse, userId) {
            try {
                const product = await getOrdersByUser(userId);
                res.send(product);
            } catch (error) {
                res.status(400).send(error);
            }
        },
    })
);
