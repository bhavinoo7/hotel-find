const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const passprot_local = require("passport-local");
const { route } = require("./listing.js");
const { SaveRedirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/user.js")

//signup user

router.route("/signup")
.get(usercontroller.rendersignup)
.post(
  wrapAsync(usercontroller.signupuser)
);

router.route("/login")
.get(usercontroller.renderlogin )
.post(
  SaveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usercontroller.loginuser
);


//for logout
router.get("/logout",usercontroller.logoutuser)
module.exports = router;
