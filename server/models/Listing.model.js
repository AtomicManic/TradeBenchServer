const { Schema, model } = require("mongoose");

const ListingSchema = new Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    tags: { type: [String], required: false, unique: false },
    number_of_items: { type: Number, required: true, unique: false },
    images: { type: [String], required: false, unique: false },
    status: { type: String, default: "active" },
  },
  { timestamps: true },
  { collection: "listings" }
);

ListingSchema.index({ location: "2dsphere" });
module.exports = model("Listing", ListingSchema);
