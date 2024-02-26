const fsPromises = require('fs').promises;
const path = require("path")
const {absolutePath} = require("../lib/helpers")
const filePath = absolutePath("data/cart.json")

class Cart {

    static async addProduct(id, productPrice) {
        let cart = {products: [], totalPrice: 0};
        try {
            const previousCartContents = await fsPromises.readFile(filePath, {encoding: "utf-8"});
            cart = JSON.parse(previousCartContents);
        } catch (e) {
            console.log(e);
        } finally {
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + Number(productPrice);
            await fsPromises.writeFile(filePath, JSON.stringify(cart));
        }
    }

    static async deleteProduct(id, price) {
        let cart = {products: [], totalPrice: 0};
        try {
            const previousCartContents = await fsPromises.readFile(filePath, {encoding: "utf-8"});
            cart = JSON.parse(previousCartContents);
        } catch (e) {
            console.log(e);
        } finally {
            const delCartProduct = cart.products.find(prod => prod.id === id);
            cart.products = cart.products.filter(prod => prod.id !== id);
            cart.totalPrice = cart.totalPrice - (Number(price) * delCartProduct.qty);
            await fsPromises.writeFile(filePath, JSON.stringify(cart));
        }
    }

    static async fetchCart() {
        try {
            const {Product} = require("./product");
            let cartContents = await fsPromises.readFile(filePath, {encoding: "utf-8"});
            let cart = JSON.parse(cartContents);

            cart.products = await Promise.all(cart.products.map(async (x) => ({
                id: x.id,
                qty: x.qty,
                imageUrl: (await Product.findById(x.id)).imageUrl,
                price: (await Product.findById(x.id)).price,
                title: (await Product.findById(x.id)).title,
                description: (await Product.findById(x.id)).description
            })));
            return cart;
        } catch (e) {
            console.log(e);
            return {products: [], totalPrice: 0};
        }
    }
}

module.exports = {Cart};