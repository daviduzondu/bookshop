const express = require("express");
const {userModel} = require("../models/user");
const {validationResult, body} = require("express-validator");
const {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getReset,
    postReset,
    getNewPassword,
    postNewPassword
} = require("../controllers/authControllers");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get("/login", getLogin);
router.post("/login",
    body('password').isLength({min: 6}).withMessage("Your password is less than 6 characters long.").trim(),
    body('email').isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
    body('email').custom(async(value, {req})=>{
        const user = await userModel.findOne({email: req.body.email});
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if (!correctPassword) {
            throw new Error('Invalid email or password')
        }
        req.session.user = user;
        return true;
    }),
    postLogin);
router.post("/logout", postLogout);
router.get("/signup", getSignup);
router.post("/signup",
    body('email').isEmail().withMessage("Please enter a valid email address"),
    body('password').isLength({min: 6}).withMessage("Your password is less than 6 characters long.").trim(),
    body("confirmPassword").custom((value, {req}) => {
        if (value === req.body.password) {
            return true;
        } else {
            throw new Error("Passwords do not match");
        }
    }).trim(),
    body("email").custom(async (value, {req}) => {
        const existingUserDoc = await userModel.findOne({email: req.body.email});
        if (existingUserDoc) throw new Error("Email already exists");
        else return true;
    }).normalizeEmail(),
    postSignup
);

router.get("/reset", getReset);
router.post("/reset", postReset);
router.get("/reset/:token", getNewPassword);
router.post("/new-password", postNewPassword);
module.exports = router;
