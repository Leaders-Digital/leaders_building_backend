const dayjs = require("dayjs");
const Activity = require("../Models/Activity");
const ActivityService = require("../service/acitivityService");
const getAllRecords = require("../utils/getAllRecords");

const createActivity = async (req, res) => {
  try {
    const act = await ActivityService.addActivity(req.body);

    return res.status(201).json({ data: act, message: "activity created" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
const markAsDone = async (req, res) => {
  try {
    const id = req.params.id;
    const { note } = req.body;

    const act = await ActivityService.markItAsDone(id, note);
    return res.status(200).json({ message: "activity done", data: act });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
const addNote = async (req, res) => {
  try {
    const id = req.params.id;
    const { note } = req.body;
    const act = await ActivityService.addNote(id, note);
    return res.status(200).json({ message: "note added", data: act });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
const getAllActivities = async (req, res) => {
  try {
    const { id, dateFilter } = req.query;
    let filters = { propspectId: id };
    const currentDateMidnight = dayjs().utc().startOf("day").toDate();

    if (dateFilter === "upcoming") {
      filters = {
        ...filters,
        done: false,
        date: { $gt: currentDateMidnight },
      };
    } else if (dateFilter === "past") {
      filters = {
        ...filters,
        done: false,
        date: { $lt: currentDateMidnight },
      };
    } else if (dateFilter === "completed") {
      filters = {
        ...filters,
        done: true,
        //date: { $lt: currentDateMidnight },
        isDeleted: false,
      };
    }

    return await getAllRecords(
      Activity,
      req,
      res,
      ["name", "email"],
      filters,
      "date"
    );
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
module.exports = {
  createActivity,
  markAsDone,
  getAllActivities,
  addNote,
};
