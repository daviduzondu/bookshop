const {productModel} = require("../models/product");
const {v4: uuidv4} = require("uuid");

// Admin Controllers
const getAddProduct = (req, res, next) => {
    let path = "/admin/add-product"
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path,
        isAuthenticated: req.session.isLoggedIn
    });
};

const postAddProduct = async (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    const product = new productModel({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    await product.save();
    res.redirect('/products');
};


const getEditProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    const product = await productModel.findById(prodId);
    if (!product) {
        return res.redirect('/');
    }
    let path = "/admin/edit-product"
    res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path,
        editing: true,
        product: product,
        isAuthenticated: req.session.isLoggedIn
    });
};

const postEditProduct = async (req, res, next) => {
    const {title, imageUrl, price, description, productId: id} = req.body;
    let productToUpdate = await productModel.findById(id);
    if (productToUpdate.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
    }
    productToUpdate.title = title;
    productToUpdate.imageUrl = imageUrl;
    productToUpdate.price = price;
    productToUpdate.description = description;
    productToUpdate.productId = id;
    try {
        await productToUpdate.save();
    } catch (e) {
        console.log(e);
    }
    res.redirect("/admin/products");
}
const postDeleteProduct = async (req, res, next) => {
    const {productId: id} = req.body;
    await productModel.deleteOne({_id: id, userId: req.user._id});
    res.redirect("/admin/products");
}

const getAdminProducts = async (req, res, next) => {
    let products = await productModel.find({userId: req.user._id});
    // let products = (await productModel.find());
    let path = "/admin/products"
    res.render('admin/products', {
        path,
        docTitle: "Admin Products",
        prods: products.reverse(),
        isAuthenticated: req.session.isLoggedIn
    })
}
//

module.exports = {getAddProduct, postAddProduct, getAdminProducts, getEditProduct, postEditProduct, postDeleteProduct}