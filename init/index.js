const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnd";

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

const initDb = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("db data insert");
};

initDb();
