const express = require("express");
const route = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errorMess = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMess);
  } else {
    next();
  }
};

route.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});

    res.render("listings/index", { allListing });
  })
);

//sow listing

//new routes
route.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user);

  res.render("listings/new.ejs");
});

route.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "listing you requested for does't exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);
route.post(
  "/",
  isLoggedIn,
  validListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "new listing add!");
    res.redirect("/listings");
  })
);

//edit
route.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested for does't exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//updatte

route.put(
  "/:id",
  isLoggedIn,
  validListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", " update Listing");
    res.redirect(`/listings/${id}`);
  })
);

//delete
route.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
);

module.exports = route;
