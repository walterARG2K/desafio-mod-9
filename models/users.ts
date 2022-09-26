import { firestore } from "libs/firestore";
const collection = firestore.collection("users");

export class User {
    ref: FirebaseFirestore.DocumentReference;
    userId: string;
    data: any;
    constructor(id) {
        this.userId = id;
        this.ref = collection.doc(id);
    }
    async pull() {
        this.data = (await this.ref.get()).data();
    }

    async push() {
        await this.ref.update(this.data);
    }

    static async createUser(data) {
        const userSnap = await collection.add(data);
        const newUser = new User(userSnap.id);
        newUser.data = data;
        return newUser;
    }
}
