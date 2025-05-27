const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/userController.js");


router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}), 
    // passport middleware change the req.session object if u store anything it will be removed
  userController.login
)




router.get("/logout", userController.logout)
module.exports = router;