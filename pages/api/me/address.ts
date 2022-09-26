import { getUser, updateUser, updateUserAdress } from "controllers/me";
import { middleware } from "libs/middleware";
import Method from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup
    .object()
    .shape({
        direction: yup.string(),
        postalCode: yup.number(),
        city: yup.string(),
        province: yup.string(),
    })
    .noUnknown(true)
    .strict();

export default middleware(
    Method({
        async patch(req: NextApiRequest, res: NextApiResponse, userId) {
            try {
                if (Object.keys(req.body).length === 0) throw { error: "body está vacío" };

                const data = await bodySchema.validate(req.body);
                const userData = await updateUserAdress(data, userId);
                res.send(userData);
            } catch (error) {
                res.status(400).send(error);
            }
        },
    })
);
