const jwt = require("jsonwebtoken");
const JWT_KEY = require("../keys").JWT_KEY;

// Check Users Authentication
const checkAuthentication = async (req, res, next) => {
  console.log("checking log status");
  console.log(req.header("Authorization"));
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, JWT_KEY);
  if (data) {
    //console.log(data)
    next();
  } else {
    throw new Error();
  }
};

module.exports = checkAuthentication;
