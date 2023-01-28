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
const Listing = model("Listing", ListingSchema);

const changeStream = Listing.watch();
changeStream.on("change", async (change) => {
  if (
    change.operationType === "update" &&
    change.updateDescription.updatedFields.number_of_items === 0
  ) {
    const listingID = change.documentKey._id;
    await Listing.updateOne({ _id: listingID }, { status: "disabled" });
  }
});

module.exports = Listing;
