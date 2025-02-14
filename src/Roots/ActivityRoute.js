const express = require("express");
const {
  createActivity,
  markAsDone,
  getAllActivities,
} = require("../Controllers/ActivityController");
const ActivityRouter = express.Router();

ActivityRouter.post("/add", createActivity);
ActivityRouter.put("/markAsdone/:id", markAsDone);
ActivityRouter.get("/getAll/:id", getAllActivities);
module.exports = ActivityRouter;
