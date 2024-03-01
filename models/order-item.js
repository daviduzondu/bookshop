const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../lib/db");

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
})

module.exports = {OrderItem};