const {productModel} = require("../models/product");
const {v4: uuidv4} = require("uuid");
// const {User} = require("../models/user");

const getProducts = async (req, res, next) => {
    let products = await productModel.find();
    res.render('shop/product-list', {
        prods: products.reverse(),
        docTitle: 'Shop',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};
//
const getProduct = async (req, res, next) => {

    const prodID = req.params.productId;
    const match = await productModel.findById(prodID);
    res.render('shop/product-details', {prods: match, path: "/products"});
    // res.redirect("/");
}
//
const getOrders = async (req, res, next) => {
    const orders =(await req.user.getOrders());
    res.render("shop/orders", {docTitle: "Your Orders", orders: orders, path:"/orders"})
}
//
const getCart = async (req, res, next) => {
    const cart = await req.user.getCart();
    // const cart = await req.user.getCart();
    // const products = await cart.getProducts();
    res.render("shop/cart", {path: "/cart", docTitle: "Your Cart", prods: cart});
}
//
const postDeleteCartItem = async (req, res, next) => {
    const {productId: id} = req.body;
    const operation = await req.user.deleteItemFromCart(id);
    // const cart = await req.user.getCart();
    // const [productToDel] = await cart.getProducts({where: {id: id}});
    // productToDel.cartItem.destroy();
    res.redirect("/cart");
}
const postOrder = async (req, res, next) => {
    await req.user.addOrder();
    res.redirect("/cart");
}
const postCart = async (req, res, next) => {
    const {productId: id} = req.body;
    const product = await Product.getProductById(id); // {}
    const result = await req.user.addToCart(product);
    res.redirect("/cart");
}
//
// const postCheckout = (req, res, next) => {
//     res.render("shop/checkout")
// }
//
// const getCheckout = (req, res, next) => {
//     res.render("shop/checkout", {path: "/checko ut"})
// }
//
const getProductIndex = async (req, res, next) => {
    let products = await productModel.find();
    console.log(products);
    res.render('shop/index', {
        prods: products.reverse(),
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
}

module.exports = {
    getProducts,
    getProductIndex,
    getProduct,
    postCart,
    postDeleteCartItem,
    getCart,
    postOrder,
    getOrders
}


//     getCart,
//     postCart,
//     postDeleteCartItem,
//     postCheckout,
//     postOrder,
//     getCheckout,
//     getOrders,
// }