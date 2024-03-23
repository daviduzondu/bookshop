const express = require("express");
const router = express.Router();
const path = require("path");
const {products} = require("./admin");
const {
    getProducts, getCart, getOrders, getProductIndex, getProduct, postCart, postDeleteCartItem, postOrder,
    getInvoice
} = require("../controllers/shopControllers")
const {productModel} = require("../models/product");
const {pagination} = require("../lib/helpers")

// const ITEMS_PER_PAGE = 2;


function isAuth(req, res, next) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
}


router.get("/", pagination, getProductIndex);
router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, postCart);
router.get("/orders", isAuth, getOrders);
router.get("/products", pagination, getProducts);
router.get("/products/:productId", getProduct);
router.post("/create-order", isAuth, postOrder);
router.post("/delete-from-cart", isAuth, postDeleteCartItem);
router.get("/orders/:orderId", isAuth, getInvoice);
module.exports = router;