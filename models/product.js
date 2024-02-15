const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require('path');
const {absolutePath} = require("../lib/helpers")
// const products = [];
const filePath = absolutePath("data/products.json");

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
    constructor(t) {
        this.title = t;
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
        } catch (e){
            console.log(e)
        } finally {
            products.push(this);
            await fsPromises.writeFile(filePath, JSON.stringify(products), {encoding: "utf-8"});
        }
    }

    static async fetchAll() {
            try {
                const fileContents = await fsPromises.readFile(filePath, {encoding: "utf-8"});
                return JSON.parse(fileContents);
            } catch (e){
                return [];
            }
    }
}

module.exports = {Product}