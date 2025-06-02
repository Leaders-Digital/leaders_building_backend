const express = require("express");
const {
    createProjectPhase, getPhasesByProjectId,

} = require("../Controllers/ProjectPhasesControllers");
const {getAllUsers} = require("../Controllers/User_Controller");

const ProjectPhaseRouter = express.Router();

ProjectPhaseRouter.post("/create", createProjectPhase);
ProjectPhaseRouter.get("/getPhasesByProjectId/:id", getPhasesByProjectId);

module.exports = ProjectPhaseRouter;
