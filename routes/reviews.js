const express = require("express");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errorMess = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMess);
  } else {
    next();
  }
};

//review post route

route.post(
  "/",
  validReviews,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReviews = new Review(req.body.review);

    listing.reviews.push(newReviews);
    await newReviews.save();
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listings/${listing._id}`);
  })
);
//post delete reviews
route.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
  })
);
module.exports = route;
