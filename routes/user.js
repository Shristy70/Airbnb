const express = require("express");
const route = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");

route.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
route.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to your website!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

route.get("/login", (req, res) => {
  res.render("users/login.ejs");
});
route.post(
  "/login",
  saveRedirect,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome to airbnb ! you successfully logged in");
    res.redirect(res.locals.redirectUrl);
  }
);
route.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "successfully logout!!");
    res.redirect("/listings");
  });
});
module.exports = route;
