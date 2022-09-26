import mercadopago from "mercadopago";

mercadopago.configure({
    access_token: process.env.MP_TOKEN,
});

export default mercadopago;
