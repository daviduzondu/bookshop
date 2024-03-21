const express = require("express");
const router = express.Router();
const path = require("path");
const { products} = require("./admin");
const {getProducts, getCart, getOrders,  getProductIndex, getProduct, postCart, postDeleteCartItem, postOrder,
    getInvoice
} = require("../controllers/shopControllers")


function isAuth(req, res, next){
    if (!req.session.isLoggedIn){
        return res.redirect("/login");
    }
    next();
}

router.get("/", getProductIndex);
router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, postCart);
router.get("/orders", isAuth,  getOrders);
router.get("/products", getProducts);
router.get("/products/:productId", getProduct);
router.post("/create-order", isAuth, postOrder);
router.post("/delete-from-cart", isAuth, postDeleteCartItem);
router.get("/orders/:orderId", isAuth, getInvoice);
module.exports = router;