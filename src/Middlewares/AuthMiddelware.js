const jwt = require("jsonwebtoken");
const AuthMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const token = req.cookies.token;
  
  console.log("AuthMiddleware - Request URL:", req.url);
  console.log("AuthMiddleware - Cookies:", req.cookies);
  console.log("AuthMiddleware - Token exists:", !!token);
  console.log("AuthMiddleware - NODE_ENV:", process.env.NODE_ENV);
  
  // Check if token exists
  if (!token) {
    console.log("AuthMiddleware - No token provided");
    return res.status(401).json({ 
      message: "No token provided", 
      error: "Token is required for authentication" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AuthMiddleware - Token verified successfully for user:", decoded.id);
    req.userId = decoded;
    next();
  } catch (e) {
    console.log("AuthMiddleware - Token verification failed:", e.message);
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired", 
        error: "Please login again" 
      });
    } else if (e.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: "Invalid token", 
        error: "Token is malformed or invalid" 
      });
    } else {
      return res.status(401).json({ 
        message: "Invalid token", 
        error: e.message 
      });
    }
  }
};

module.exports = AuthMiddleware;
