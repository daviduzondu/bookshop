const {productModel} = require("../models/product");
const {v4: uuidv4} = require("uuid");
const {validationResult, body} = require("express-validator");
const {deleteFile, absolutePath} = require("../lib/helpers");

// Admin Controllers
const getAddProduct = (req, res, next) => {
    let path = "/admin/add-product"
    res.render('admin/edit-product', {
        docTitle: 'Add Product', path, editing: false, isAuthenticated: req.session.isLoggedIn
    });
};

const postAddProduct = async (req, res, next) => {
    const productDetails = req.body;
    productDetails.image = req.file;
    const {title, image, price, description} = productDetails;
    let path = "/admin/edit-product"
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/edit-product', {
                docTitle: 'Add Product',
                path, // editing:false,
                errorMessage: errors.array().map(x => `${x.msg}`),
                isAuthenticated: req.session.isLoggedIn,
                oldInputs: {title, price, description},
                invalidInputs: errors.array().map(x => `${x.path}`),
            });
        }
        const product = new productModel({
            title: title, price: price, description: description, image: image.path, userId: req.user
        });
        await product.save();
        res.redirect('/products');
    } catch (e) {
        console.error(e)
        // const error = new Error("Failed to create product");
        // error.httpStatusCode = 500;
        return next(e.message);
    }
};


const getEditProduct = async (req, res, next) => {
    const prodId = req.params.productId;
    const product = await productModel.findById(prodId);
    console.log(product);
    if (!product) {
        return res.redirect('/');
    }
    let path = "/admin/edit-product"
    res.render('admin/edit-product', {
        docTitle: 'Edit Product', path, editing: true, product: product, isAuthenticated: req.session.isLoggedIn
    });
};

const postEditProduct = async (req, res, next) => {
    const productDetails = req.body;
    productDetails.image = req.file;
    const {title, image, price, description, productId: id} = productDetails;
    // console.log("Product Details", productDetails);
    let path = "/admin/edit-product"
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Edit Product',
            path,
            editing: true,
            product: {title, price, description, _id: id},
            errorMessage: errors.array().map(x => `${x.msg}`),
            oldInputs: {title, price, description},
            invalidInputs: errors.array().map(x => `${x.path}`),
            isAuthenticated: req.session.isLoggedIn
        });
    }
    let productToUpdate = await productModel.findById(id);
    if (productToUpdate.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
    }

    // console.log(ima)
    image && deleteFile(productToUpdate.image);

    // Another change
    productToUpdate.title = title;
    productToUpdate.image = !image ? productToUpdate.image : image.path;
    productToUpdate.price = price;
    productToUpdate.description = description;
    productToUpdate.productId = id;
    try {
        await productToUpdate.save();
    } catch (e) {
        console.log(e.message);
        console.log("Error: Something went wrong");
        return next(e.message)
    }
    res.redirect("/admin/products");
}
const postDeleteProduct = async (req, res, next) => {
    const {productId: id} = req.body;
    try {
        await deleteFile((await productModel.findOne({_id: id, userId: req.user._id})).image);
        await productModel.deleteOne({_id: id, userId: req.user._id});
    } catch (e) {
        console.error(e);
        return next(e.message);
    }
    res.redirect("/admin/products");
}

const getAdminProducts = async (req, res, next) => {
    let products = await productModel.find({userId: req.user._id});
    console.log(products);
    // let products = (await productModel.find());
    let path = "/admin/products"
    res.render('admin/products', {
        path, docTitle: "Admin Products", prods: products.reverse(), isAuthenticated: req.session.isLoggedIn
    })
}
//

module.exports = {getAddProduct, postAddProduct, getAdminProducts, getEditProduct, postEditProduct, postDeleteProduct}