import { firestore } from "libs/firestore";
const collection = firestore.collection("auth");

export class Auth {
    ref: FirebaseFirestore.DocumentReference;
    id: string;
    data: any;
    constructor(id: string) {
        this.ref = collection.doc(id);
    }

    async pull() {
        this.data = this.ref.get();
    }

    async push() {
        await this.ref.update(this.data);
    }

    static async findByEmail(email: string) {
        const result = await collection.where("email", "==", email).get();
        if (result.docs.length) {
            const user = result.docs[0];
            const newAuth = new Auth(user.id);
            newAuth.data = user.data();
            return newAuth;
        } else return null;
    }

    static async createAuth(data) {
        const userSnap = await collection.add(data);
        const newAuth = new Auth(userSnap.id);
        newAuth.data = data;
        return newAuth;
    }
}
