const {userModel} = require("../models/user");
const bcrypt = require("bcryptjs");

function getLogin(req, res, next) {
    res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
    })
}

async function postLogin(req, res, next) {
    const {email, password} = req.body;
    const user = await userModel.findOne({email: email});
    if (!user) {
        return res.redirect("/login");
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword){
        return res.redirect("/login");
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save(err => {
        console.log(err);
        return res.redirect("/");
    })
}

async function postSignup(req, res, next) {
    const {email, password, confirmPassword} = req.body;
    try {
        const existingUserDoc = await userModel.findOne({email: email});
        if (existingUserDoc) {
            return res.redirect("/login");
        }
        const hashedPassword = await bcrypt.hash(password, 15);
        const newUser = new userModel({
            email: email,
            password: hashedPassword,
            cart: {items: []}
        });
        await newUser.save();
        res.redirect("/login")
    } catch (e) {
        console.error(e);
    }

}

function getSignup(req, res, next) {
    res.render("auth/signup", {
        path: "/signup",
        docTitle: "Signup",
    })
}


function postLogout(req, res, next) {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    })
}

module.exports = {getLogin, postLogin, postLogout, getSignup, postSignup}