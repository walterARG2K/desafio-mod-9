import { sendCode } from "controllers/auth";
import Method from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup.object().shape({
    email: yup.string().email().required(),
});

async function authUser(req: NextApiRequest, res: NextApiResponse) {
    try {
        const email = await bodySchema.validate(req.body);
        const auth = await sendCode(email.email);
        res.json(auth);
    } catch (error) {
        res.status(400).json(error);
    }
}

export default Method({ post: authUser });
