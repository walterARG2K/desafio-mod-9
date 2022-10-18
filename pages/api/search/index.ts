import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { searchProductsByQuery } from "controllers/search";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        console.log(req.headers);

        const query = req.query.q as string;
        const queryLimit = parseInt(req.query.limit as string) || 12;
        const queryOffset = parseInt(req.query.offset as string) || 0;
        const products = await searchProductsByQuery(query, queryOffset, queryLimit);
        res.send(products);
    },
});
