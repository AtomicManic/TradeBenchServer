const listingsRepository = require("../repositories/utils/listingRepo.object");
const { isValidObjectId } = require("./../validators/mongoId.validator");
const { bodyValidator } = require("./../validators/body.validator");
const { PropertyExist, BodyNotSent } = require("../errors/BadRequest.errors");
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
    console.log(lat, lon);
    const data = await listingsRepository.retrieveByLoction(lat, lon);
    if (!data) throw new EntityNotFound("listing");
    res.status(200).json(data);
  },

  createListing: async (req, res) => {
    bodyValidator(req);
    if (!req.body.lat) throw new MissingPropertyError("latitude");
    if (!req.body.lon) throw new MissingPropertyError("longtitude");
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
