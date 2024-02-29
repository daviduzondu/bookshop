const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../lib/db');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING
})

module.exports = {User};