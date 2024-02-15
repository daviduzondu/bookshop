const express = require("express");
const router = express.Router();
const path = require("path");
const { products} = require("./admin");
const {getProducts, getCart, getProductIndex} = require("../controllers/shopControllers")


router.get("/", getProductIndex);
router.get("/cart", getCart);
router.get("/products", getProducts);
module.exports = router;