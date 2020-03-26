const jwt = require("jsonwebtoken");
const JWT_KEY = require("../keys").JWT_KEY;

// Get Logged In Users Details
const getLoggedUser = async req => {
  console.log("getting logged user");
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, JWT_KEY);
  if (data) {
    return data;
  } else {
    throw new Error();
  }
};

module.exports = getLoggedUser;
