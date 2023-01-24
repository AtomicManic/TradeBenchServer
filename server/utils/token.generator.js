const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, fullName: user.fullName, email: user.email },
    process.env.JWT_SECRET
  );
  return token;
};
