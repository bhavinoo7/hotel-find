const { model } = require("mongoose");
const User = require("../models/user.js");


module.exports.rendersignup= (req, res) => {
    res.render("user/signup.ejs");
  };

module.exports.signupuser=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let user1 = new User({
        username: username,
        email: email,
      });
      let newuser = await User.register(user1, password);
      console.log(newuser);
      req.login(newuser,(err)=>{//user for create session
        if(err)
        {
          return next(err);
        }
        req.flash("success", "you are registered succeful");
      res.redirect("/listings");
      });
      
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  };

  module.exports.renderlogin=(req, res) => {
    res.render("user/login.ejs");
  };

  module.exports.loginuser=async (req, res) => {
    req.flash("success","welcome to airbnb");
    let redirecturl=res.locals.redirectUrl ||"/listings";
    res.redirect(redirecturl);
  }

  module.exports.logoutuser=(req,res,next)=>{
    req.logout((err)=>{//use for terminate session
      if(err)
      {
        return next(err);
      }
      req.flash("success","you are logout succufully");
      res.redirect("/listings");
    })
    
  };