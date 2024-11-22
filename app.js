const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnd";

const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoute = require("./routes/user.js");
main()
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("connected noootttt");
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs"); // Ensure this is at the top
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("my page");
});

const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.success);
  next();
});

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("listing");
});
