const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        productData: {type: Object, required: true},
        quantity: {type: Number, required: true}
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }
})

const orderModel = mongoose.model("Order", orderSchema);
module.exports = {orderModel};