const {productModel} = require("../models/product");
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
    const product = new productModel({title:title, price:price, description:description, imageUrl:imageUrl, userId: req.user});
    await product.save();
    res.redirect('/products');
};


const getEditProduct = async (req, res, next) => {
    // const editMode = req.query.edit;
    const prodId = req.params.productId;
    // const product = await Product.findByPk(prodId);
    const product = await productModel.findById(prodId);
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
    let productToUpdate = await productModel.findById(id);
    productToUpdate.title = title;
    productToUpdate.imageUrl = imageUrl;
    productToUpdate.price = price;
    productToUpdate.description = description;
    productToUpdate.productId = id;
    await productToUpdate.save();

    res.redirect("/admin/products");
}
const postDeleteProduct = async (req, res, next) => {
    const {productId: id} = req.body;
    await productModel.findByIdAndDelete(id);
    res.redirect("/admin/products");
}

const getAdminProducts = async (req, res, next) => {
    let products = (await productModel.find());

    let path = "/admin/products"
    res.render('admin/products', {path, docTitle: "Admin Products", prods: products.reverse()})
}
//

module.exports = {getAddProduct, postAddProduct, getAdminProducts, getEditProduct, postEditProduct, postDeleteProduct}