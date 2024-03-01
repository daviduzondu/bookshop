const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../lib/db");

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = {Order};