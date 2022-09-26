import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { algoliaIndex } from "libs/algolia";
import { searchProductsByQuery } from "controllers/search";

export default methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
        const query = req.query.q as string;
        const queryLimit = parseInt(req.query.limit as string) || 10;
        const queryOffset = parseInt(req.query.offset as string) || 0;
        if (query) {
            const products = await searchProductsByQuery(query, queryOffset, queryLimit);
            res.send(products);
        } else res.status(400).send("debe ingresar una query");
    },
});
