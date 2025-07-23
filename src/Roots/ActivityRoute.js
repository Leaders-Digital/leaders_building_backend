const express = require("express");
const {
  createActivity,
  markAsDone,
  getAllActivities,
  addNote,
  getProspectActivities,
} = require("../Controllers/ActivityController");
const ActivityRouter = express.Router();

ActivityRouter.post("/add", createActivity);
ActivityRouter.put("/markAsdone/:id", markAsDone);
ActivityRouter.get("/getAll", getAllActivities);
ActivityRouter.get("/prospect/:prospectId", getProspectActivities);
ActivityRouter.post("/addNote/:id", addNote);
module.exports = ActivityRouter;
