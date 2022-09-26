import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findProductById } from "controllers/search";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        const productID = req.query.productID as string;

        try {
            const product = await findProductById(productID);
            res.send(product);
        } catch (error) {
            res.status(400).send(error);
        }
    },
});
