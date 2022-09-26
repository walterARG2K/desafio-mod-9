import { Auth } from "models/auth";
import { User } from "models/users";
import addMinutes from "date-fns/addMinutes";
import { randomCode } from "libs/utils/utils";
import { sendgridMail } from "libs/sendgrid";
import { htmlMail } from "libs/utils/htmlSendCode";

const address = {
    direction: "",
    postalCode: "",
    city: "",
    province: "",
};

async function findOrCreateAuth(email: string) {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const auth = await Auth.findByEmail(cleanEmail);

    if (auth) return auth;
    else {
        const newUser = await User.createUser({ email: cleanEmail, fullName: "", address });
        const newAuth = await Auth.createAuth({
            email: cleanEmail,
            userId: newUser.userId,
            code: "",
            expires: new Date().toLocaleTimeString("es-AR"),
        });
        return newAuth;
    }
}

export async function sendCode(email: string) {
    const cleanEmail = email.trim().toLocaleLowerCase();
    const auth = await findOrCreateAuth(email);
    const expires = addMinutes(new Date(), 10);

    auth.data.code = randomCode();
    auth.data.expires = expires;
    auth.push();

    const msg = {
        to: cleanEmail,
        from: "daniwortiz003@gmail.com",
        subject: "¡Código de verificación!",
        html: htmlMail(cleanEmail, auth.data.code),
    };
    sendgridMail(msg);

    return { message: "código enviado al email " + auth.data.email };
}
