const express = require("express");
const {adminRouter} = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth")
const bodyParser = require("body-parser");
const {absolutePath} = require("./lib/helpers.js");
const {get404} = require("./controllers/error");
const {v4: uuidv4} = require("uuid");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const {userModel} = require("./models/user");
const password = "gDNvvT00YgAQ00IM";
const MONGO_URI = `mongodb+srv://daviduzondu:${password}@cluster0.usbmnfm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;
const store = new mongoStore({
    uri: MONGO_URI,
    collection: "sessions"
});

// Okay so this is how you make things work!

app.set('view engine', 'pug');
app.set('views', 'views/pug')
app.use(bodyParser.urlencoded());
app.use(express.static(absolutePath('/public'), {redirect: false}));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use(async (req, res, next) => {

    if (!req.session.user) {
        return next();
    }
    const user = await userModel.findById(req.session.user._id);
    req.user = user;
    next();
    // if (!req.session.user){
    //     return next();
    // }
    // req.user = await userModel.findById("65eed9e14fef4608ce1c1b54");
    // next();
})

app.use(shopRoutes);
app.use(adminRouter);
app.use(authRoutes)

app.use(get404);


(async () => {
    await mongoose.connect(MONGO_URI);

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

    app.listen(3100);
})();
