const express = require("express");
const {adminRouter} = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const bodyParser = require("body-parser");
const {absolutePath} = require("./lib/helpers.js");
const {get404} = require("./controllers/error");
const {v4: uuidv4} = require("uuid");
const app = express();
const mongoose = require("mongoose");
const {userModel} = require("./models/user");
let base;
const password = "gDNvvT00YgAQ00IM";
const url = `mongodb+srv://daviduzondu:${password}@cluster0.usbmnfm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;

app.set('view engine', 'pug');
app.set('views', 'views/pug');

app.use(bodyParser.urlencoded());


app.use(express.static(absolutePath('/public'), {redirect: false}));

app.use(async (req, res, next) => {
    req.user = await userModel.findById("65eed9e14fef4608ce1c1b54");
    next();
})

app.use(shopRoutes);
app.use(adminRouter);

app.use(get404);


(async () => {
    await mongoose.connect(url);

    if (!(await userModel.findOne())) {
        const user = new userModel({
            name: "David",
            email: "david@test.com",
            cart: {
                items: []
            }
        });
        user.save();
    }

    app.listen(3000);
})();
