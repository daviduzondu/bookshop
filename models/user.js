const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: {type: Number, required: true}
        }]
    }
})

userSchema.methods.addToCart = (async function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQty = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQty;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQty
        });
    }

    this.cart = {items: updatedCartItems};
    return this.save();
});

userSchema.methods.deleteItemFromCart = (async function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    this.cart = {items: updatedCartItems};
    return this.save();
})

userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
}
const userModel = mongoose.model("User", userSchema);
module.exports = {userModel};
