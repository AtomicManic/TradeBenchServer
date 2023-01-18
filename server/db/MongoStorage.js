const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Path = require("path");

module.exports = class MongoStorage {
  constructor(entity) {
    this.entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
    this.Model = require(Path.join(
      __dirname,
      `../models/${this.entityName}.model.js`
    ));
    this.connect();
  }

  connect() {
    const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kts52kd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    mongoose
      .connect(connectionUrl)
      .then(() => console.log(`connected to ${this.entityName} collection`))
      .catch((err) => console.log(`connection error: ${err}`));
  }

  find() {
    return this.Model.find({});
  }

  retrieve(id) {
    return this.Model.findById(id);
  }

  retrieveEmail(email) {
    return this.Model.findOne({ email: email });
  }

  retriveByAttributes(attribute1, attributeName1, attribute2, attributeName2) {
    const obj = {};
    obj[attributeName1] = attribute1;
    obj[attributeName2] = attribute2;
    return this.Model.find(obj);
  }

  create(data) {
    const entity = new this.Model(data);
    return entity.save();
  }

  delete(id) {
    return this.Model.findByIdAndDelete(id);
  }

  update(id, data) {
    return this.Model.findByIdAndUpdate(id, data, { new: true });
  }
};
