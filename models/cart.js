const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../lib/db");

const Cart = sequelize.define('cart', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
})

module.exports = {Cart};