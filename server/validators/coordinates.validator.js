const { ValidationError } = require("../errors/validation.errors");

exports.validateLonLat = (lon, lat) => {
  if (lon < -180 || lon > 180)
    throw new ValidationError("longtitude is not valid");
  if (lat < -90 || lat > 90) throw new ValidationError("latitude is not valid");
};
