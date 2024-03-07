const express = require("express");
const {adminRouter} = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const bodyParser = require("body-parser");
const {absolutePath} = require("./lib/helpers.js");
const {get404} = require("./controllers/error");
const {v4: uuidv4} = require("uuid");
const app = express();
const connectToDB = require("./lib/db");
const {User} = require("./models/user");
let base;


app.set('view engine', 'pug');
app.set('views', 'views/pug');

app.use(bodyParser.urlencoded());


app.use(express.static(absolutePath('/public'), {redirect: false}));

app.use(async (req, res, next)=>{
    const {_id:id, name, email, cart} = await User.findById("65e5d29f968ecee218360cde");
    req.user = new User(name, email, cart, id);
    next();
})
app.use(shopRoutes);
app.use(adminRouter);

app.use(get404);

const startApp = async () => {
    const client = await connectToDB();
    base = client.db();
}

(async () => {
    app.listen(3000);
    await startApp();
})();

async function getDB() {
    await startApp();
    return base;
}


module.exports = {getDB};
