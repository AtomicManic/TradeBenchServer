const { Schema, model } = require("mongoose");

const ListingSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lon: { type: Number, requires: true },
    tags: { type: [String], required: false, unique: false },
    number_of_items: { type: Number, required: true, unique: false },
    images: { type: [String], required: false, unique: false },
    status: { type: String, default: "active" },
  },
  { timestamps: true },
  { collection: "listings" }
);

module.exports = model("Listing", ListingSchema);
