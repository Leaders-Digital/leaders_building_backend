const express = require("express");
const {
  createSubPhase,
  updateSubPhase,
  deleteSubPhase,
  getSubPhaseById,
  getAllSubPhasesByPhaseId,
  getAllSubPhasesByProjectId,
} = require("../Controllers/SubPhaseController");

const SubPhaseRouter = express.Router();

SubPhaseRouter.post("/create", createSubPhase);

SubPhaseRouter.put("/update", updateSubPhase);

SubPhaseRouter.delete("/delete/:phaseId/:subPhaseId", deleteSubPhase);

SubPhaseRouter.get("/getById/:phaseId/:subPhaseId", getSubPhaseById);

SubPhaseRouter.get("/getByPhaseId/:phaseId", getAllSubPhasesByPhaseId);

SubPhaseRouter.get("/getByProjectId/:projectId", getAllSubPhasesByProjectId);

module.exports = SubPhaseRouter; 