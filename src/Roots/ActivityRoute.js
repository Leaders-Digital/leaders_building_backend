const express = require("express");
const {
  createActivity,
  markAsDone,
} = require("../Controllers/ActivityController");
const ActivityRouter = express.Router();

ActivityRouter.post("/add", createActivity);
ActivityRouter.put("/markAsdone/:id", markAsDone);
module.exports = ActivityRouter;
