const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnd";

const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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
