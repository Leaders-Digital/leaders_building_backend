const express = require("express");
const {
  CreateDevis,
  GetDevisbyId,
  CreateSection,
  GetAllDevis,
} = require("../Controllers/DevisController");

const DevisRouter = express.Router();

DevisRouter.post("/create", CreateDevis);
DevisRouter.get("/getId/:id", GetDevisbyId);
DevisRouter.get("/getall", GetAllDevis);
DevisRouter.post("/section/create", CreateSection);
module.exports = DevisRouter;
