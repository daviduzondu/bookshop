const express = require("express");
const path = require("path");
const adminRouter = express.Router();
const {absolutePath} = require("../lib/helpers");
const {validationResult, body} = require("express-validator");
const {pagination} = require("../lib/helpers");
// import {pagination}
const {
    getAddProduct,
    postAddProduct,
    getAdminProducts,
    getEditProduct,
    postEditProduct,
    deleteProduct
} = require("../controllers/adminControllers")
const {productModel} = require("../models/product");

adminRouter.all("/*", (req, res, next) => {
    req.isAdminRoute = true;
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
});


adminRouter.get("/add-product", getAddProduct);
adminRouter.post("/add-product",
    body("title").trim().isLength({min: 3}).withMessage("Title is less than 3 characters long!"),
    body("image").trim().custom((value, {req}) => {
        if (req.fileSupported === true) {
            return true;
        } else if (req.fileSupported === false) {
            throw new Error("Attached file is not a supported image format.")
        }
        throw new Error("No image selected. Please select and image and try again.")
    }),
    body("price").trim().isNumeric().withMessage("A valid price must be entered!"),
    body("description").trim().isLength({min: 10}).withMessage("Description cannot be less than 10 characters long!"),
    postAddProduct);
adminRouter.get("/products", pagination, getAdminProducts);
adminRouter.get("/edit-product/:productId", getEditProduct);
adminRouter.post("/edit-product",
    body("title").trim().isLength({min: 3}).withMessage("Title is less than 3 characters long!"),
    body("image").trim().custom((value, {req}) => {
        console.log(req.fileSupported);
        if (req.fileSupported === false) {
            throw new Error("Attached file is not a supported image format.")
        }
        if (value === "" || req.fileSupported === true) {
            return true;
        }

        // throw new Error("No image selected. Please select and image and try again.")
    }),
    body("price").trim().isNumeric().withMessage("A valid price must be entered!"),
    body("description").trim().isLength({min: 10}).withMessage("Description cannot be less than 10 characters long!")
    , postEditProduct);
// adminRouter.delete()
adminRouter.delete("/product/:productId", deleteProduct)
module.exports = {adminRouter};
