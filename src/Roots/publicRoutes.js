const express = require("express");
const {
  submitLead,
  getPublicProjects,
} = require("../Controllers/publicController");

const publicRouter = express.Router();

// Route pour soumettre un lead public
publicRouter.post("/leads", submitLead);

// Route pour récupérer les projets publics
publicRouter.get("/projects", getPublicProjects);

module.exports = publicRouter;

