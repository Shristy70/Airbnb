const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnd";
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
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

app.get("/api", (req, res, next) => {
  let { token } = req.query;
  if (token == "giveaccess") {
    next();
  }
  res.status(401).send("Unauthorized");
});
app.get("/api", (req, res) => {
  res.send("data");
});
app.get("/", (req, res) => {
  res.send("my page");
});
app.get("/testListing", async (req, res) => {
  let simpleListing = new Listing({
    title: "villa",
    description: "new villa",
    price: 9000,
    location: "bhopal",
    country: "mp",
  });

  await simpleListing.save();
  console.log("sample save");
  res.send("save data!!!!!!!!!!");
});
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
});

//sow listing

//new routes
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//edit
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//updatte

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//delete
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings");
});

console.log("Views directory:", app.get("views"));
app.listen(8080, () => {
  console.log("listing");
});
