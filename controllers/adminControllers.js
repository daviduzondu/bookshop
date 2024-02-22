const {Product} = require("../models/product");

// Admin Controllers
const getAddProduct = (req, res, next) => {
    let path = "/admin/add-product"
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path
    });
};

const getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    if (editMode !== "true") {
        return res.redirect("/");
    }
    if (!product) {
        return res.redirect('/');
    }
    let path = "/admin/edit-product"
    res.render('admin/edit-product', {
        docTitle: 'Edit Product',
        path,
        editing: editMode,
        product: product
    });
};
const postDeleteProduct = async (req, res, next) =>{
    const {productId:id} = req.body;
    await Product.delete(id);
    res.redirect("/admin/products");
}

const postEditProduct = async (req, res, next) =>{
    const {title, imageUrl, price, description, productId:id} = req.body;
    const updatedProduct = new Product(id, title, imageUrl, price, description);
     updatedProduct.save();
     res.redirect("/admin/products");
    console.log(id);
}

const postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    console.log(req.body)
    const product = new Product(null, title, imageUrl, price, description);
    product.save();
    res.redirect('/products');
};


const getAdminProducts = async (req, res, next) => {
    let products;
    products = (await Product.fetchAll()).reverse();
    let path = "/admin/products"
    res.render('admin/products', {path, docTitle: "Admin Products", prods: products})
}


module.exports = {getAddProduct, postAddProduct, getEditProduct, getAdminProducts, postEditProduct, postDeleteProduct}