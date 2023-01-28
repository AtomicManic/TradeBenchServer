const Listing = require("./Listing.model");

const changeStream = Listing.watch();
changeStream.on("change", async (change) => {
  console.log("here");
  if (
    change.operationType === "update" &&
    change.updateDescription.updatedFields.number_of_items === 0
  ) {
    const listingID = change.documentKey._id;
    await Listing.updateOne({ _id: listingID }, { status: "disabled" });
  }
});
