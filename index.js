const express = require("express");
const serveStatic = require('serve-static');
const {adminRouter, product} = require("./routes/admin.js");
const shopRoutes = require("./routes/shop.js");
const bodyParser = require("body-parser");
const { absolutePath } = require("./lib/helpers.js");
const {get404} = require("./controllers/error");
const db = require("./lib/db")
const app = express();

async function fetchData(){
    console.log(await db.execute("select * from products"))
}

fetchData();
// app.set('view engine', 'ejs');
// app.set('views', 'views/ejs');
app.set('view engine', 'pug');
app.set('views', 'views/pug');

app.use(bodyParser.urlencoded());
app.use(express.static(absolutePath('/public'), {redirect:false}));
app.use(shopRoutes);
app.use(adminRouter);

app.use(get404);

app.listen(3000);
