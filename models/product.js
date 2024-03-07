const {ObjectId} = require("mongodb");
class Product {
    data = {};

    constructor(id, title, price, description, imageUrl, userId) {
        this.id = id;
        this.data.title = title;
        this.data.price = price;
        this.data.description = description;
        this.data.imageUrl = imageUrl;
        this.data.userId = userId;
    }

    async save() {
        const {getDB} = require("../index");
        let base = await getDB();
        if (this.id === null) {
            const result = await base.collection('products').insertOne(this.data);
        } else {
            const result = await base.collection('products').updateOne({_id: new ObjectId(this.id)}, {$set: this.data});
            console.log("Updating...", result)
        }
    }


    static async fetchAll() {
        const {getDB} = require("../index");
        let base = await getDB();
        return await base.collection("products").find().toArray();
    }

    static async deleteById(id) {
        const {getDB} = require("../index");
        let base = await getDB();
        const result = await base.collection("products").deleteOne({_id: new ObjectId(id)});
        console.log("Deleting...", result);
    }

    static async getProductById(id) {
        const {getDB} = require("../index");
        let base = await getDB();
        return await base.collection("products").find({_id: new ObjectId(id)}).next();
    }
}

module.exports = {Product}