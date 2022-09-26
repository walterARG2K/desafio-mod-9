import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./jwt";

export function middleware(callback) {
    return (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const token = req.headers.authorization;
            if (!token) throw "header authorization no existe";

            const cleanToken = token?.split(" ")[1];
            const userId = verifyToken(cleanToken);
            callback(req, res, userId);
        } catch (error) {
            res.status(401).json({ message: error });
        }
    };
}
