const {Product} = require("../models/product");
const {v4: uuidv4} = require("uuid");
const getProducts = async (req, res, next) => {
    console.log(req.user);
    let products;
    products = (await Product.findAll());
    res.render('shop/index', {
        prods: products.reverse(),
        docTitle: 'Shop',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};

const getProduct = async (req, res, next) => {

    const prodID = req.params.productId;
    const match = await Product.findByPk(prodID);
    res.render('shop/product-details', {prods: match, path: "/products"});
    // res.redirect("/");
}

const getOrders = (req, res, next) => {
    res.render("shop/orders", {docTitle: "Your Orders"})
}

const getCart = async (req, res, next) => {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    res.render("shop/cart", {path: "/cart", docTitle: "Your Cart", prods: products});
    // console.log("Your cart is:", req.user.cart);
    // console.log("Products are:", await Promise.all(cart.products));
    // res.render("404");
    // res.send("<h1>Hello from the children of planet Earth!</h1>")
    // res.redirect("/")
}

const postDeleteCartItem = async (req, res, next) => {
    const {productId: id, price} = req.body;
    const cart = await req.user.getCart();
    const [productToDel] = await cart.getProducts({where: {id: id}});
    productToDel.cartItem.destroy();
    res.redirect("/cart");
    // console.log(productToDel.cartItem);
    // await Cart.deleteProduct(id, price);
}

const postCart = async (req, res, next) => {
    const {title, imageUrl, price, description, productId: id} = req.body;
    console.log("Posting...", id);

    const productToAdd = await Product.findByPk(id);
    const cart = await req.user.getCart();
    const [products] = await cart.getProducts({where: {id: id}});
    let newQuantity = 1;
    if (products) {
        //     ...
        const oldQuantity = products.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        await cart.addProduct(productToAdd, {through: {quantity: newQuantity, id: uuidv4()}})
    } else {
        await cart.addProduct(productToAdd, {through: {quantity: newQuantity, id: uuidv4()}});
    }

    res.redirect("/cart");
}

const postCheckout = (req, res, next) => {
    res.render("shop/checkout")
}

const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {path: "/checkout"})
}

const getProductIndex = async (req, res, next) => {
    let products;
    products = (await Product.findAll());
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
    getCart,
    postCart,
    postDeleteCartItem,
    postCheckout,
    getCheckout,
    getProductIndex,
    getOrders,
    getProduct
}