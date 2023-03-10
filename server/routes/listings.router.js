const { Router } = require("express");
const { listingsController } = require("./../controllers/listings.controller");

const listingsRouter = new Router();

listingsRouter.get("/", listingsController.getListings);
listingsRouter.get("/active", listingsController.getActiveListings);
listingsRouter.get("/location", listingsController.getListingByLocation);
listingsRouter.get("/nearest", listingsController.getNearestListings);
listingsRouter.get("/:id", listingsController.getListing);
listingsRouter.post("/", listingsController.createListing);
listingsRouter.put("/status/:id", listingsController.updateStatus);
listingsRouter.put("/:id", listingsController.updateListing);
listingsRouter.delete("/:id", listingsController.removeListing);

module.exports = { listingsRouter };
