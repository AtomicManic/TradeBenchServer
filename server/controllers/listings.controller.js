const listingsRepository = require("../repositories/utils/listingRepo.object");
const { isValidObjectId } = require("./../validators/mongoId.validator");
const { bodyValidator } = require("./../validators/body.validator");
const { validateLonLat } = require("./../validators/coordinates.validator");
const {
  PropertyExist,
  BodyNotSent,
  BadRequest,
} = require("../errors/BadRequest.errors");
const {
  MissingPropertyError,
  InvalidProperty,
  ValidationError,
} = require("../errors/validation.errors");
const {
  EntityNotFound,
  PropertyNotFound,
} = require("../errors/NotFound.errors");

const { ServerUnableError } = require("../errors/internal.errors");

exports.listingsController = {
  getListings: async (req, res) => {
    const data = await listingsRepository.find();
    if (!data) throw new EntityNotFound("Listings");
    res.status(200).json(data);
  },

  getActiveListings: async (req, res) => {
    const data = await listingsRepository.findActive();
    if (!data) throw new EntityNotFound("Active listings");
    res.status(200).json(data);
  },

  getListing: async (req, res) => {
    if (!req.params || !req.params.id || req.params.id === ":id")
      throw new MissingPropertyError("ID");
    if (!isValidObjectId(req.params.id)) throw new InvalidProperty("ID");

    const { id } = req.params;
    const data = await listingsRepository.retrieve(id);
    if (!data) throw new EntityNotFound("Listing");
    res.status(200).json(data);
  },

  getListingByLocation: async (req, res) => {
    if (!req.query.lat) throw new MissingPropertyError("latitude");
    if (!req.query.lon) throw new MissingPropertyError("longtitude");
    const { lat, lon } = req.query;
    const data = await listingsRepository.retrieveByLoction(lat, lon);
    if (!data) throw new EntityNotFound("listing");
    res.status(200).json(data);
  },

  getNearestListings: async (req, res) => {
    if (!req.query.lat) throw new MissingPropertyError("latitude");
    if (!req.query.lon) throw new MissingPropertyError("longtitude");
    const lon = parseFloat(req.query.lon);
    const lat = parseFloat(req.query.lat);
    validateLonLat(lon, lat);
    const data = await listingsRepository.findByProximity(lon, lat);
    if (!data) throw new ServerUnableError("find");
    res.status(200).json(data);
  },

  createListing: async (req, res) => {
    bodyValidator(req);
    if (!req.body.location) throw new MissingPropertyError("location");
    const lon = req.body.location.coordinates[0];
    if (!lon) throw new MissingPropertyError("longtitude");
    const lat = req.body.location.coordinates[1];
    if (!lat) throw new MissingPropertyError("latitude");
    validateLonLat(lon, lat);
    if (!req.body.tags || req.body.tags.length === 0)
      throw new MissingPropertyError("tags");
    if (!req.body.number_of_items)
      throw new MissingPropertyError("number of items");
    if (!req.body.images || req.body.images.length === 0)
      throw new MissingPropertyError("images");

    let { body: Listing } = req;
    const data = await listingsRepository.create(Listing);
    res.status(201).json(data);
  },

  updateListing: async (req, res) => {
    bodyValidator(req);
    if (!req.params.id || req.params.id === ":id")
      throw new MissingPropertyError("ID");
    if (!isValidObjectId(req.params.id)) throw new InvalidProperty("ID");

    let {
      body: Listing,
      params: { id },
    } = req;
    Listing = { ...Listing };
    const data = await listingsRepository.update(id, Listing);
    if (!data) throw new ServerUnableError("update");
    res.status(201).json(data);
  },

  updateStatus: async (req, res) => {
    bodyValidator(req);
    if (!req.params.id || req.params.id === ":id")
      throw new MissingPropertyError("ID");
    if (!isValidObjectId(req.params.id)) throw new InvalidProperty("ID");
    if (!req.body.status) throw new MissingPropertyError("status");
    if (!(req.body.status === "active" || req.body.status === "disabled"))
      throw new BadRequest("invalid status");
    const id = req.params.id;
    const status = req.body.status;
    const data = await listingsRepository.update(id, { status });
    if (!data) throw new ServerUnableError("update");
    res.status(200).json({
      message: `Listing with id: ${id} status was successfully updated to ${status}`,
    });
  },

  removeListing: async (req, res) => {
    if (!req.params.id || req.params.id === ":id")
      throw new MissingPropertyError("ID");
    if (!isValidObjectId(req.params.id)) throw new InvalidProperty("ID");

    const { id } = req.params;
    const data = await listingsRepository.delete(id);
    if (!data) throw new ServerUnableError("delete");
    res.status(200).json(data);
  },
};
