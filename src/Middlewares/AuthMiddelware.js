const jwt = require("jsonwebtoken");
const AuthMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  const serverApiKey = process.env.API_KEY;
  const token = req.cookies.token;
  if (!apiKey || apiKey !== serverApiKey || !token) {
    return res.status(401).json({ message: "Unauthorized " });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token", error: e.message });
  }
};

module.exports = AuthMiddleware;
