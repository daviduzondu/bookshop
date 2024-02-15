const express = require("express");
const path = require("path");
const adminRouter = express.Router();
const { absolutePath } = require("../lib/helpers");
const {getAddProduct, postAddProduct, getAdminProducts, getEditProduct, } = require("../controllers/adminControllers")
adminRouter.get("/admin/add-product", getAddProduct);
adminRouter.post("/admin/add-product", postAddProduct);
adminRouter.get("/admin/edit-product", getEditProduct);
adminRouter.get("/admin/products", getAdminProducts);

module.exports = { adminRouter };
