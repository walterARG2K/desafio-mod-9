import { findUserAndValidateCode } from "controllers/token";
import Method from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup.object().shape({
    email: yup.string().email().required(),
    code: yup.number().integer().positive().required(),
});

export default Method({
    async post(req: NextApiRequest, res: NextApiResponse) {
        try {
            const validate = await bodySchema.validate(req.body);
            const token = await findUserAndValidateCode(validate.email, validate.code);
            res.send(token);
        } catch (error) {
            res.status(400).send(error);
        }
    },
});
