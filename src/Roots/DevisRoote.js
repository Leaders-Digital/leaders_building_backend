const express = require("express");
const {
  CreateDevis,
  GetDevisbyId,
  CreateSection,
} = require("../Controllers/DevisController");

const DevisRouter = express.Router();

DevisRouter.post("/create", CreateDevis);
DevisRouter.get("/getId/:id", GetDevisbyId);
DevisRouter.post("/section/create", CreateSection);
module.exports = DevisRouter;
