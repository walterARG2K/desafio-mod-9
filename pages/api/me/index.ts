import { getUser, updateUser } from "controllers/me";
import { middleware } from "libs/middleware";
import Method from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup
    .object()
    .shape({
        email: yup.string().email(),
        fullName: yup.string(),
    })
    .noUnknown(true)
    .strict();

async function get(req: NextApiRequest, res: NextApiResponse, userId) {
    const userData = await getUser(userId);
    res.send(userData);
}

async function patch(req: NextApiRequest, res: NextApiResponse, userId) {
    try {
        const data = await bodySchema.validate(req.body);
        if (data.email === "") throw "email está vacío";

        const userData = await updateUser(data, userId);
        res.send(userData);
    } catch (error) {
        res.status(400).send(error);
    }
}

export default middleware(
    Method({
        get,
        patch,
    })
);
