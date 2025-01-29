const express = require("express");
const {
  createProspect,
  deleteProspect,
  updateProspect,
  getAllProspects,
  getProspectById,
  becomeClient,
  getAllClients,
} = require("../Controllers/Prospect_Controller");
const ProspectRouter = express.Router();

ProspectRouter.post("/add", createProspect);
ProspectRouter.put("/delete/:id", deleteProspect);
ProspectRouter.put("/update/:id", updateProspect);
ProspectRouter.get("/getAll", getAllProspects);
ProspectRouter.get("/getById/:id", getProspectById);
ProspectRouter.put("/changeProspectType/:id", becomeClient);
ProspectRouter.get("/getAllClients", getAllClients);

module.exports = ProspectRouter;
