const {productModel} = require("../models/product");
const {v4: uuidv4} = require("uuid");
const {orderModel} = require("../models/order");
// const {User} = require("../models/user");

const getProducts = async (req, res, next) => {
    let products = await productModel.find();
    res.render('shop/product-list', {
        isAuthenticated: req.session.isLoggedIn,
        prods: products.reverse(),
        docTitle: 'Shop',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
    });
};
//
const getProduct = async (req, res, next) => {

    const prodID = req.params.productId;
    const match = await productModel.findById(prodID);
    res.render('shop/product-details', {
        isAuthenticated: req.session.isLoggedIn, prods: match, path: "/products"
    });
    // res.redirect("/");
}
//
const getOrders = async (req, res, next) => {
    // const orders =(await req.user.getOrders());
    const orders = await orderModel.find({"user.userId": req.user._id});
    res.render("shop/orders", {
        isAuthenticated: req.session.isLoggedIn, docTitle: "Your Orders", orders: orders.reverse(), path: "/orders"
    })
}
//
const getCart = async (req, res, next) => {
    const cart = (await req.user.populate('cart.items.productId')).cart.items.filter(x=>x.productId!==null).map(x => (console.log(x),{
        ...x.productId._doc,
        quantity: x.quantity
    }));
    // console.log(cart);
    // const cart = await req.user.getCart();
    // const products = await cart.getProducts();
    res.render("shop/cart", {
        isAuthenticated: req.session.isLoggedIn, path: "/cart", docTitle: "Your Cart", prods: cart
    });
}
//
const postDeleteCartItem = async (req, res, next) => {
    const {productId: id} = req.body;
    const operation = await req.user.deleteItemFromCart(id);
    res.redirect("/cart");
}
const postOrder = async (req, res, next) => {
    try {
    const products = (await req.user.populate("cart.items.productId")).cart.items.map(x => ({
        quantity: x.quantity,
        productData: {...x.productId._doc}
    }))
    const order = new orderModel({
        user: {
            email: req.user.email,
            userId: req.user
        },
        products: products
    });
    req.user.clearCart();
    order.save();
    res.redirect("/orders");
    } catch (e){
        console.log(e);
    }
}
const postCart = async (req, res, next) => {
    const {productId: id} = req.body;
    const product = await productModel.findById(id); // {}
    const result = await req.user.addToCart(product);
    res.redirect("/cart");
}

const getProductIndex = async (req, res, next) => {
    let products = await productModel.find();
    res.render('shop/index', {
        isAuthenticated: req.session.isLoggedIn,
        prods: products.reverse(),
        docTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        csrfToken: req.csrfToken()
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