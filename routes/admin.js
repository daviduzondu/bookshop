const express = require("express");
const path = require("path");
const adminRouter = express.Router();
const {absolutePath} = require("../lib/helpers");
const {validationResult, body} = require("express-validator");

const {
    getAddProduct,
    postAddProduct,
    getAdminProducts,
    getEditProduct,
    postEditProduct,
    postDeleteProduct
} = require("../controllers/adminControllers")

adminRouter.all("/*", (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
});
adminRouter.get("/add-product", getAddProduct);
adminRouter.post("/add-product",
    body("title").trim().isLength({min: 3}).withMessage("Title is less than 3 characters long!"),
    body("image").trim().custom((value, {req}) => {
        if (!req.file) {
            throw new Error("Attached file is not an image")
        } else {
            return true;
        }
    }),
    body("price").trim().isNumeric().withMessage("A valid price must be entered!"),
    body("description").trim().isLength({min: 10}).withMessage("Description cannot be less than 10 characters long!"),
    postAddProduct);
adminRouter.get("/products", getAdminProducts);
adminRouter.get("/edit-product/:productId", getEditProduct);
adminRouter.post("/edit-product",
    body("title").trim().isLength({min: 3}).withMessage("Title is less than 3 characters long!"),
    body("image").trim().custom((value, {req}) => {
        if (req.file === "unsupported") {
            throw new Error("Attached or attached file is not a supported image format.")
        }

        if (req.body.image === "") {
            return true;
        }
    }),
    body("price").trim().isNumeric().withMessage("A valid price must be entered!"),
    body("description").trim().isLength({min: 10}).withMessage("Description cannot be less than 10 characters long!")
    , postEditProduct);
adminRouter.post("/delete-product", postDeleteProduct)
module.exports = {adminRouter};
