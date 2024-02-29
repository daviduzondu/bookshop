const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../lib/db');
const Product = sequelize.define('product', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    title: DataTypes.STRING,
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = {Product};