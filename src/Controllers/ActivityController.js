const ActivityService = require("../service/acitivityService");

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
const getAllActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const activites = await ActivityService.getAllActivitiesByProspect(id);

    return res.status(200).json({ data: activites });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
module.exports = {
  createActivity,
  markAsDone,
  getAllActivities,
};
