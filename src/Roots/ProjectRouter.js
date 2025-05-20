const express = require("express");
const {
  createProject,
  UpdateProject,
  DeleteProject,
  getAllProjects,
  GetProjectById,
  GetProjectsByClientId,
} = require("../Controllers/ProjectController");

const ProjectRouter = express.Router();

ProjectRouter.post("/create", createProject);
ProjectRouter.put("/update/:id", UpdateProject);
ProjectRouter.put("/delete/:id", DeleteProject);
ProjectRouter.get("/getAll", getAllProjects);
ProjectRouter.get("/getById/:id", GetProjectById);
ProjectRouter.get("/getByClientId/:clientId", GetProjectsByClientId);
module.exports = ProjectRouter;
