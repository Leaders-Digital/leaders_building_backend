const express = require("express");
const {
    createProjectPhase, getPhasesByProjectId, updateProjectPhase,

} = require("../Controllers/ProjectPhasesControllers");
const {getAllUsers} = require("../Controllers/User_Controller");

const ProjectPhaseRouter = express.Router();

ProjectPhaseRouter.post("/create", createProjectPhase);
ProjectPhaseRouter.put("/update/:id", updateProjectPhase);
ProjectPhaseRouter.get("/getPhasesByProjectId/:id", getPhasesByProjectId);

module.exports = ProjectPhaseRouter;
