import Method from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import { getAndUpdateOrder } from "controllers/mercadopago";

export default Method({
    async post(req: NextApiRequest, res: NextApiResponse) {
        const id = req.query.id;
        const topic = req.query.topic;
        if (topic === "merchant_order") {
            await getAndUpdateOrder(id);
        }
        console.log("ok");

        res.send("ok");
    },
});
