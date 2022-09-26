import { createToken } from "libs/jwt";
import { Auth } from "models/auth";

export async function findUserAndValidateCode(email: string, code: number) {
    try {
        const cleanEmail = email.trim().toLocaleLowerCase();
        const auth = await Auth.findByEmail(cleanEmail);
        const isValid = auth.data.expires.toDate().toLocaleTimeString("es-AR");
        const nowTime = new Date().toLocaleTimeString("es-AR");
        if (auth.data.code === code && isValid > nowTime) {
            auth.data.code = "used";
            auth.push();
            return { token: createToken(auth.data.userId) };
        } else {
            throw {
                error: "token no creado, falta de coincidencia en el código, o posible expiración",
            };
        }
    } catch (error) {
        throw error;
    }
}
