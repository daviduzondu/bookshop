const {productModel} = require("../models/product");
const {v4: uuidv4} = require("uuid");
const {orderModel} = require("../models/order");
const fsPromises = require("fs/promises")
const fs = require("fs");
const {absolutePath} = require("../lib/helpers");
const PDFDocument = require("pdfkit")
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
    const cart = (await req.user.populate('cart.items.productId')).cart.items.filter(x => x.productId !== null).map(x => (console.log(x), {
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
        const products = (await req.user.populate("cart.items.productId")).cart.items.filter(x => x.productId !== null).map(x => ({
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
    } catch (e) {
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

const getInvoice = async (req, res, next) => {
    const orderId = req.params.orderId;
    const invoicePath = absolutePath(`./invoices/Order from ${req.user._id} - ${orderId} - ${uuidv4()}`);
    const order = await orderModel.findById(orderId);
    if (order.user.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/login");
    }
    const invoiceName = `${orderId} - ${req.user._id}.pdf`;
    try {
        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
        pdfDoc.pipe(res);
        pdfDoc.fontSize(36).text("Invoice\n", {
            underline: true
        });

        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += Number(prod.quantity * prod.productData.price);
            pdfDoc.fontSize(26).text(`${prod.productData.title} 
             $${prod.productData.price} x ${prod.quantity} = $${Number(prod.quantity * prod.productData.price)}`);
        })
        pdfDoc.fontSize(26).text(`\nTotal Price:  $${totalPrice}`);
        pdfDoc.end();
    } catch (e) {
        if (e) {
            console.log(e);
            return next(e);
        }
    }
}

module.exports = {
    getProducts,
    getProductIndex,
    getProduct,
    postCart,
    postDeleteCartItem,
    getCart,
    postOrder,
    getOrders,
    getInvoice
}

// }