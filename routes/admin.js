const express = require("express");
const path = require("path");
const adminRouter = express.Router();
const {absolutePath} = require("../lib/helpers");
const {
    getAddProduct,
    postAddProduct,
    getAdminProducts,
    getEditProduct,
    postEditProduct,
    postDeleteProduct
} = require("../controllers/adminControllers")

adminRouter.all("/admin/*", (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
});
adminRouter.get("/admin/add-product", getAddProduct);
adminRouter.post("/admin/add-product", postAddProduct);
adminRouter.get("/admin/products", getAdminProducts);
adminRouter.get("/admin/edit-product/:productId", getEditProduct);
adminRouter.post("/admin/edit-product", postEditProduct);
adminRouter.post("/admin/delete-product", postDeleteProduct)
module.exports = {adminRouter};
