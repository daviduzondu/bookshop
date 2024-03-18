const {userModel} = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const {validationResult} = require("express-validator");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "3ca815922d8609",
        pass: "adc99b3c605803"
    }
});

function getLogin(req, res, next) {
    res.render("auth/login", {
        path: "/login",
        docTitle: "Login",
        errorMessage: req.flash('error')
    })
}

async function postLogin(req, res, next) {
    const {email, password} = req.body;
    const user = await userModel.findOne({email: email});
    if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect("/login");
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
        req.flash('error', 'Invalid email or password');
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
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()){
        return res.status(422).render("auth/signup", {
            path: "/signup",
            docTitle: "Signup",
            errorMessage: errors.array().map(x=>`${x.msg}`),
            oldInput: {email, password, confirmPassword}
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 15);
        const newUser = new userModel({
            email: email,
            password: hashedPassword,
            cart: {items: []}
        });
        try {
            await newUser.save();
            // await transporter.sendMail({
            //     to: email,
            //     from: "david@daviduzondu.com",
            //     subject: "Welcome to Shop!",
            //     html: "<h1>You have successfully signed up!</h1>"
            // })
        } catch (e) {
            console.log("Error:", e);
        }
        res.redirect("/login");
    } catch (e) {
        console.error(e);
    }
}

function getSignup(req, res, next) {
    res.render("auth/signup", {
        path: "/signup",
        docTitle: "Signup",
        errorMessage: req.flash("error")
    })
}


function postLogout(req, res, next) {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    })
}

function getReset(req, res, nexy) {
    res.render("auth/reset", {
        path: "/reset",
        docTitle: "Reset Password",
        errorMessage: req.flash("error")
    })
}

function postReset(req, res, next) {
    const {email} = req.body;
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString('hex');
        try {
            const user = await userModel.findOne({email: email});
            if (!user) {
                req.flash("error", "No account with that email found.");
                return res.redirect("/reset");
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000
            await user.save();
            await transporter.sendMail({
                to: email,
                from: "david@daviduzondu.com",
                subject: "Password Reset",
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3100/reset/${token}">link</a> to set a new password</p>
                    
                    <sub>The password reset link is only valid for an hour</sub>
                  `
            });
            res.redirect("/")
        } catch (e) {
            console.log("Error:", e);
        }
    })
}

async function getNewPassword(req, res, next) {
    const token = req.params.token;
    try {
        const user = await userModel.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}});
        if (user) {
            res.render("auth/new-password", {
                path: "/new-password",
                docTitle: "Update Password",
                errorMessage: req.flash("error"),
                passwordToken: token,
                userId: user._id.toString()
            })
        } else {
            res.redirect("/")
        }
    } catch (e) {
        console.log("Error:", e);
    }
}

async function postNewPassword(req, res, next) {
    const {password, userId, passwordToken} = req.body;

    try {
        const user = await userModel.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {$gt: Date.now()},
            _id: userId
        });
        user.password = await bcrypt.hash(password, 12);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.redirect("/login");

    } catch (e) {
        console.log(e);
    }

}

module.exports = {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getReset,
    postReset,
    getNewPassword,
    postNewPassword
}