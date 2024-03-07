const {Product} = require("../models/product");
const {v4: uuidv4} = require("uuid");
// Admin Controllers
const getAddProduct = (req, res, next) => {
    let path = "/admin/add-product"
    // res.send("Hello")
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path
    });
};

const postAddProduct = async (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    const product = new Product(null, title, price, description, imageUrl, req.user.id);
    await product.save();
    res.redirect('/products');
};


const getEditProduct = async (req, res, next) => {
    // const editMode = req.query.edit;
    const prodId = req.params.productId;
    // const product = await Product.findByPk(prodId);
    const product = await Product.getProductById(prodId);
    // if (editMode !== "true") {
    //     return res.redirect("/");
    // }

    if (!product) {
        return res.redirect('/');
    }
    let path = "/admin/edit-product"
    res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path,
        editing: true,
        product: product
    });
};

const postEditProduct = async (req, res, next) => {
    const {title, imageUrl, price, description, productId: id} = req.body;
    let product = new Product(id, title, price, description, imageUrl, req.user.id);
    await product.save();

    res.redirect("/admin/products");
}
const postDeleteProduct = async (req, res, next) => {
    const {productId: id} = req.body;
    await Product.deleteById(id);
    res.redirect("/admin/products");
}

const getAdminProducts = async (req, res, next) => {
    let products = (await Product.fetchAll());

    let path = "/admin/products"
    res.render('admin/products', {path, docTitle: "Admin Products", prods: products.reverse()})
}
//

module.exports = {getAddProduct, postAddProduct, getAdminProducts, getEditProduct, postEditProduct, postDeleteProduct}