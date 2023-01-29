const logger = require("./../middleware/loggers/error.logger");

exports.errorHandler = (error, req, res, next) => {
  try {
    logger.error(error.message);
  } catch {
    if (err.code === "ENOENT") {
      console.log("Error: ENOENT: no such file or directory, mkdir logs");
    }
  }
  res.status(error.status || 500);
  res.json({ message: error.message || "Internal Server Error" });
};
