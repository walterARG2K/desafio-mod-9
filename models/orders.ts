import { firestore } from "libs/firestore";
const collection = firestore.collection("orders");

export class Order {
    ref: FirebaseFirestore.DocumentReference;
    productId: string;
    data: any;
    constructor(id) {
        this.productId = id;
        this.ref = collection.doc(id);
    }
    async pull() {
        this.data = await (await this.ref.get()).data();
    }

    async push() {
        await this.ref.update(this.data);
    }

    async get() {
        return await (await this.ref.get()).data();
    }

    static async getAllByUser(userId) {
        return await collection.where("userId", "==", userId).get();
    }

    static async createOrder(data) {
        const orderSnap = await collection.add(data);
        const newOrder = new Order(orderSnap.id);
        newOrder.data = data;
        return newOrder;
    }
}
