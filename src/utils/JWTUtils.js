const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  console.log("JWT - Generating token for user:", userId);
  console.log("JWT - JWT_SECRET exists:", !!process.env.JWT_SECRET);
  console.log("JWT - JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);
  
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  
  console.log("JWT - Token generated successfully");
  return token;
};

const verifyToken = (token) => {
  console.log("JWT - Verifying token");
  console.log("JWT - JWT_SECRET exists:", !!process.env.JWT_SECRET);
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("JWT - Token verified successfully");
  return decoded;
};

module.exports = { generateToken, verifyToken };
