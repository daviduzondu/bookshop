const express = require("express");
const {adminRouter, product} = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const bodyParser = require("body-parser");
const {absolutePath} = require("./lib/helpers.js");
const {get404} = require("./controllers/error");
const sequelize = require("./lib/db");
const {Product} = require("./models/product");
const {User} = require("./models/user");
const {Cart} = require("./models/cart");
const {CartItem} = require("./models/cart-item");
const {Order} = require("./models/order");
const {OrderItem} = require("./models/order-item");
const {v4: uuidv4} = require("uuid");
const app = express();


app.set('view engine', 'pug');
app.set('views', 'views/pug');

app.use(bodyParser.urlencoded());


app.use(express.static(absolutePath('/public'), {redirect: false}));
app.use(async (req, res, next) => {
    req.user = await User.findByPk("0434fefc-8d32-4ac2-aa1a-b0b435d7f955");
    next();
})
app.use(shopRoutes);
app.use(adminRouter);

app.use(get404);

Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

(async () => {
    const id = uuidv4();
    await sequelize.sync();
    const user = await User.findByPk("0434fefc-8d32-4ac2-aa1a-b0b435d7f955");
    const userCart = await user.getCart();

    if (!user) {
        return User.create({name: "Max", email: "test@test.com", id});
    } else if (!userCart) {
        console.log("Creating new user cart!")
        user.createCart({id});
    }
})();

app.listen(3000);
