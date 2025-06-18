const jwt = require("jsonwebtoken");
const AuthMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const token = req.cookies.token;
  
  // Check if token exists
  if (!token) {
    return res.status(401).json({ 
      message: "No token provided", 
      error: "Token is required for authentication" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded;
    next();
  } catch (e) {
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
