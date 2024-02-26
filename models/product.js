const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require('path');
const {absolutePath} = require("../lib/helpers")
const filePath = absolutePath("data/products.json");
const {v4: uuidv4} = require("uuid");
const {Cart} = require("./cart");


const getProductsFromFile = cb => {
    fs.readFile(filePath, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    static async delete(id) {
        let fileContents;
        let products;
        try {
            fileContents = await fsPromises.readFile(filePath, {encoding: "utf-8"});
            products = JSON.parse(fileContents);
        } catch (e) {
            console.log(e);
        } finally {
            let delProduct = products.find(x => x.id === id);
            products = products.filter(x => x.id !== id);
            await fsPromises.writeFile(filePath, JSON.stringify(products), {encoding: "utf-8"});
            if ((await Cart.fetchCart()).products.length > 0) await Cart.deleteProduct(id, delProduct.price);
        }
    }

    async save() {
        // getProductsFromFile(products => {
        //   products.push(this);
        //   fs.writeFile(filePath, JSON.stringify(products), err => {
        //     console.log(err);
        //   });
        // });

        let fileContents;
        let products = [];
        try {
            fileContents = await fsPromises.readFile(filePath, {encoding: "utf-8"});
            products = JSON.parse(fileContents);
        } catch (e) {
            console.log("Error:", e);
        } finally {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                products = updatedProducts;
            } else {
                this.id = uuidv4();
                products.push(this);
            }
            await fsPromises.writeFile(filePath, JSON.stringify(products), {encoding: "utf-8"});
        }
    }

    static async fetchAll() {
        try {
            const fileContents = await fsPromises.readFile(filePath, {encoding: "utf-8"});
            return JSON.parse(fileContents);
        } catch (e) {
            return [];
        }
    }

    static async findById(id) {
        try {
            return JSON.parse(await fsPromises.readFile(filePath, {encoding: "utf-8"})).find(x => x.id === id);
        } catch (e) {
            return [];
        }
    }
}

module.exports = {Product}