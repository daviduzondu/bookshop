const express = require("express");
const router = express.Router();
const path = require("path");
const { products} = require("./admin");
const {getProducts, getCart, getOrders,  getProductIndex, getProduct, postCart, postDeleteCartItem} = require("../controllers/shopControllers")


router.get("/", getProductIndex);
router.get("/cart", getCart);
router.post("/cart", postCart);
// router.get("/orders", getOrders);
router.get("/products", getProducts);
router.get("/products/:productId", getProduct )
// router.get("/cart", getCart);
// router.post("/delete-from-cart", postDeleteCartItem)
module.exports = router;