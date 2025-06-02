const express = require("express");
const {
  createActivity,
  markAsDone,
  getAllActivities,
  addNote,
} = require("../Controllers/ActivityController");
const ActivityRouter = express.Router();

ActivityRouter.post("/add", createActivity);
ActivityRouter.put("/markAsdone/:id", markAsDone);
ActivityRouter.get("/getAll", getAllActivities);
ActivityRouter.post("/addNote/:id", addNote);
module.exports = ActivityRouter;
