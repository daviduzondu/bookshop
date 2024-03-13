const {userModel} = require("../models/user");

function getLogin(req, res, next) {
    res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
        isAuthenticated: false
    })
}

async function postLogin(req, res, next) {
    const user = await userModel.findById("65eed9e14fef4608ce1c1b54");
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
        console.log(err);
        res.redirect("/");
    })
}

function postSignup(req, res, next){

}

function getSignup(req, res, next){
    res.render("auth/signup", {
        path:"/signup",
        docTitle:"Signup",
        isAuthenticated: false
    })
}


function postLogout(req, res, next) {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    })
}

module.exports = {getLogin, postLogin, postLogout, getSignup, postSignup}