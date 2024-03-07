const {ObjectId} = require("mongodb");

class User {
    data = {}

    constructor(username, email, cart, id) {
        this.data.name = username;
        this.data.email = email;
        this.data.cart = cart; // {items: []}
        this.id = id;
    }

    async save() {
        const {getDB} = require("../index");
        const base = await getDB();

        try {
            await base.collection("users").insertOne(this.data);
        } catch (e) {
            console.log(e);
        }
    }

    async addToCart(product) {
        const {getDB} = require("../index");
        const base = await getDB();
        const cartProductsIndex= this.data.cart.items.findIndex(cp => JSON.stringify(cp.productId) === JSON.stringify(product._id));

        let newQuantity = 1;
        const updatedCartItems = [...this.data.cart.items];
        if (cartProductsIndex >= 0) {
            newQuantity = this.data.cart.items[cartProductsIndex].quantity + 1;
            updatedCartItems[cartProductsIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: 1})
        }

        const updatedCart = {items: updatedCartItems};
        await base.collection("users").updateOne({_id: this.id}, {$set: {cart: updatedCart}});
    }

    async getCart() {
        const {getDB} = require("../index");
        const base = await getDB();
        const products = this.data.cart.items;
        const cart = (await base.collection("products").find({_id: {$in: products.map(x => x.productId)}}).toArray()).map(x => ({
            ...x,
            quantity: (products.find(y => y.productId.toString() === x._id.toString())).quantity
        }));
        return cart;
        // return this.data.cart;
    }

    async deleteItemFromCart(id) {
        const {getDB} = require("../index");
        const base = await getDB();
        const filteredCart = {items: this.data.cart.items.filter(x => x.productId.toString() !== id)};
        const updatedCart = await base.collection("users").updateOne({_id: this.id}, {$set: {cart: filteredCart}});
        return updatedCart;
    }

    async addOrder() {
        try {
            const {getDB} = require("../index");
            const base = await getDB();
            const order = {
                items: await this.getCart(),
                user: {
                    _id : new ObjectId(this.id),
                    name: this.data.name
                }
            }
            await base.collection("orders").insertOne(order);
            this.data.cart = {items: []};
            base.collection("users").updateOne({_id: this.id}, {$set: {cart: this.data.cart}});
        } catch (e) {
            console.log("Error", e.message);
        }
    }

    async getOrders(){
        const {getDB}  = require("../index.js");
        const base = await getDB();
        return await base.collection("orders").find({"user._id": new ObjectId(this.id)}).toArray();
    }


    static async findById(id) {
        try {
            const {getDB} = require("../index");
            const base = await getDB();
            return base.collection('users').findOne({_id: new ObjectId(id)});
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = {User}