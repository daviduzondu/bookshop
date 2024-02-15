const {Product} = require("../models/product");

// Admin Controllers
const getAddProduct = (req, res, next) => {
    let path = "/admin/add-product"
    res.render('admin/add-product', {
        docTitle: 'Add Product',
        path,
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

const postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/products');
};


const getEditProduct = (req, res, next) => {
    let path = "/admin/edit-products"
    res.render("admin/edit-products", {path});
}

const getAdminProducts = (req, res, next) => {
    let path = "/admin/products"
    res.render('admin/products', {path})
}


module.exports = {getAddProduct, postAddProduct, getEditProduct, getAdminProducts}