const {Product} = require("../models/product");

const getProducts = async (req, res, next) => {
    let products;
    products = (await Product.fetchAll()).reverse();
    res.render('shop/product-list', {
        prods: products,
        docTitle: 'Shop',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};

const getProductDetails = (req, res, next) =>{
    res.render("shop/product-details")
}

const getCart = (req, res, next) =>{
    res.render("shop/cart", {path: "/cart"})
}

const postCheckout = (req, res, next) =>{
    res.render("shop/checkout")
}

const getCheckout = (req, res, next)=>{
    res.render("shop/checkout", {path:"/checkout"})
}

const getProductIndex = (req, res, next) =>{
    res.render("shop/index",  {path:"/"})
}

module.exports = {getProducts, getProductDetails, getCart, postCheckout, getCheckout, getProductIndex}