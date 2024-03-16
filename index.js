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
const csrf = require("csurf");
const flash = require("connect-flash");
const {userModel} = require("./models/user");
const password = "gDNvvT00YgAQ00IM";
const MONGO_URI = `mongodb+srv://daviduzondu:${password}@cluster0.usbmnfm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;
const store = new mongoStore({
    uri: MONGO_URI,
    collection: "sessions"
});

const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', 'views/pug')
app.use(bodyParser.urlencoded());
app.use(express.static(absolutePath('/public'), {redirect: false}));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());
app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    const user = await userModel.findById(req.session.user._id);
    req.user = user;
    next();
});

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(shopRoutes);
app.use(adminRouter);
app.use(authRoutes)

app.use(get404);


(async () => {
    await mongoose.connect(MONGO_URI);
    app.listen(3100);
})();
