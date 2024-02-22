const fsPromises = require('fs').promises;
const path = require("path")
const {absolutePath} = require("../lib/helpers")

const filePath = absolutePath("data/cart.json")

class Cart {

    static async addProduct(id, productPrice) {
        console.log("Price is: ", productPrice);
        //     Fetch the previous cart
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
        //     Analuze the cart => Find the existing product
        //     Add new products/increase quantity
    }
    static async deleteProduct(id, price){
        let cart = {products: [], totalPrice:0};
        try{
            const previousCartContents = await  fsPromises.readFile(filePath, {encoding:"utf-8"});
            cart = JSON.parse(previousCartContents);
        }catch (e){
            console.log(e);
        } finally {
            const updatedProduct = cart.products.filter(prod => prod.id === id);
            // const
        }
    }
}

module.exports = {Cart};