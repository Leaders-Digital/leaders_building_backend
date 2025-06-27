const express = require("express");
const {
  login,
  logout,
  GetCurrentUser,
  testAuth,
} = require("../Controllers/Auth_Controller");
const AuthMiddleware = require("../Middlewares/AuthMiddelware");
const AuthRouter = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.get("/getCurrentUser", AuthMiddleware, GetCurrentUser);
AuthRouter.get("/test", testAuth);

module.exports = AuthRouter;
