import { Auth } from "models/auth";
import { User } from "models/users";

export async function getUser(userId) {
    const newUser = new User(userId);
    await newUser.pull();
    return newUser.data;
}

export async function updateUser(data, userId) {
    const verifyEmail = data.email ? await Auth.findByEmail(data.email) : null;
    if (verifyEmail) throw { error: "el email ya está en uso" };
    else {
        const newUser = new User(userId);
        newUser.data = data;
        await newUser.push();
        return newUser.data;
    }
}

export async function updateUserAdress(data, userId) {
    const newUser = new User(userId);
    newUser.data = { address: data };

    await newUser.push();
    return newUser.data;
}
