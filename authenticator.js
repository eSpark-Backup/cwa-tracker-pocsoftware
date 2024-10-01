const jwt = require("jsonwebtoken");

// Function to generate a JWT token
const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expiration time
  });
  return token;
};

// Middleware to authenticate and attach user data to the request
const authenticateUser = (req, res, next) => {
  //split the token as it's a bearer token
  //first check if
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  //now
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication Token Missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded; // Attach user data to the request
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = { generateToken, authenticateUser }; // {{ edit_1 }}
