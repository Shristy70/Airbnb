const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemaListing = new Schema({
  title: { type: String, required: true },

  description: String,
  image: {
    type: String,
    default:"https://unsplash.com/photos/modern-living-interior-design-3d-concept-illustration-rfabslV3BD8",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/modern-living-interior-design-3d-concept-illustration-rfabslV3BD8"
        : v,
  },
  price: String,
  location: String,
  country: String,
});
const Listing = mongoose.model("Listing", schemaListing);
module.exports = Listing;
