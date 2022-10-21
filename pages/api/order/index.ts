import { createOrderAndPreference } from "controllers/order";
import { middleware } from "libs/middleware";
import Method from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup
    .object()
    .shape({
        productsInfo: yup
            .array()
            .of(
                yup.object().shape({
                    id: yup.string().required(),
                    quantity: yup.number().required(),
                })
            )
            .required(),
    })
    .noUnknown(true)
    .strict();

export default middleware(
    Method({
        async post(req: NextApiRequest, res: NextApiResponse, userId) {
            try {
                const orderData = await bodySchema.validate(req.body);

                const orderCreated = await createOrderAndPreference(orderData, userId);
                res.send(orderCreated);
            } catch (error) {
                res.status(400).send(error);
            }
        },
    })
);
