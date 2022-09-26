import { createOrderAndPreference } from "controllers/order";
import { middleware } from "libs/middleware";
import Method from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup
    .object()
    .shape({
        color: yup.string(),
        quantity: yup.number().required(),
    })
    .noUnknown(true)
    .strict();

export default middleware(
    Method({
        async post(req: NextApiRequest, res: NextApiResponse, userId) {
            try {
                const productId = req.query.productId;
                const orderData = await bodySchema.validate(req.body);

                if (!productId) throw { error: "debe ingresar el query param 'productId'" };
                else {
                    const orderCreated = await createOrderAndPreference(
                        orderData,
                        productId,
                        userId
                    );
                    res.send(orderCreated);
                }
            } catch (error) {
                res.status(400).send(error);
            }
        },
    })
);
