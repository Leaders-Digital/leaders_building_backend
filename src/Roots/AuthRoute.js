const express = require("express");
const {
  login,
  logout,
  GetCurrentUser,
} = require("../Controllers/Auth_Controller");
const AuthMiddleware = require("../Middlewares/AuthMiddelware");
const AuthRouter = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/logout", logout);
AuthRouter.get("/getCurrentUser", AuthMiddleware, GetCurrentUser);

module.exports = AuthRouter;
