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
const multer = require("multer");
const {userModel} = require("./models/user");
const password = "gDNvvT00YgAQ00IM";
const MONGO_URI = `mongodb+srv://daviduzondu:${password}@cluster0.usbmnfm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`;
const store = new mongoStore({
    uri: MONGO_URI,
    collection: "sessions"
});

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg ") {
        cb(null, true);
    } else {
        req.file = "unsupported";
        cb(null, false);
    }
}

app.set('view engine', 'pug');
app.set('views', 'views/pug')
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
app.use(express.static(absolutePath('/public'), {redirect: false}));
app.use("/images", express.static(absolutePath('/images'), {redirect: false}));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);
app.use(flash());
app.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            return next();
        }
        const user = await userModel.findById(req.session.user._id);
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    } catch (e) {
        throw new Error(e);
    }
});

app.use((req, res, next) => {
    const userEmail = req.user?.email;
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.userEmail = userEmail ?? "Guest";
    next();
})

app.use(shopRoutes);
app.use("/admin", adminRouter);
app.use(authRoutes)
app.get('/500', (req, res, next) => {
    res.render('500', {docTitle: "500 | Internal server error.", path: "500", isAuthenticated: req.session.isLoggedIn})
})

app.use(get404);

app.use((error, req, res, next) => {
    res.redirect("/500");
})

// (() => {
mongoose.connect(MONGO_URI);
app.listen(3100);
// })();

