const {Product} = require("../models/product");
const {Cart} = require("../models/cart");
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

const getProduct = async (req,res, next)=>{
    const prodID= req.params.productId;
    const match = await Product.findById(prodID);
    console.log(match);
    res.render('shop/product-details', {prods:match, path:"/products"});
    // res.redirect("/");
}

const getOrders = (req, res, next)=>{
    res.render("shop/orders", {docTitle: "Your Orders"})
}

const getProductDetails = (req, res, next) =>{
    res.render("shop/product-details")
}

const getCart = (req, res, next) =>{
    res.render("shop/cart", {path: "/cart", docTitle:"Your Cart"})
}

const postCart = async (req, res, next)=>{
    const {title, imageUrl, price, description, productId:id} = req.body;
    let matchedProduct = await Product.findById(id);
    await Cart.addProduct(id, matchedProduct.price);
    res.redirect("/cart");
}

const postCheckout = (req, res, next) =>{
    res.render("shop/checkout")
}

const getCheckout = (req, res, next)=>{
    res.render("shop/checkout", {path:"/checkout"})
}

const getProductIndex = async (req, res, next) =>{
    let products;
    products = (await Product.fetchAll()).reverse();
    res.render('shop/index', {
        prods: products,
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
}

module.exports = {getProducts, getProductDetails, getCart, postCart,postCheckout, getCheckout, getProductIndex, getOrders, getProduct}