const MongoStorage = require("./../db/MongoStorage");

module.exports = class ListingsRepository {
  constructor() {
    this.storage = new MongoStorage("listing");
  }

  find() {
    return this.storage.find();
  }

  findActive() {
    return this.storage.findByAttribute("status", "active");
  }

  retrieve(id) {
    return this.storage.retrieve(id);
  }

  retrieveByLoction(lat, lon) {
    return this.storage.retriveByAttributes(lat, "lat", lon, "lon");
  }

  create(Listing) {
    const listing = this.storage.create(Listing);
    return listing;
  }

  update(id, Listing) {
    return this.storage.update(id, Listing);
  }

  delete(id) {
    return this.storage.delete(id);
  }
};
