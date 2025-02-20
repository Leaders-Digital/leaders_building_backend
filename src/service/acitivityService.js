const dayjs = require("dayjs");
const Activity = require("../Models/Activity");
const { default: mongoose } = require("mongoose");

const addActivity = async (data) => {
  const { activity, date, description, propspectId } = data;

  if (!date || !activity) {
    throw new Error("one of the required fields is missing");
  }
  const normalizedDate = dayjs(date).utc().toDate();
  const newActivity = await Activity.create({
    date: normalizedDate,
    activity: activity,
    description: [description],
    propspectId: propspectId,
  });
  return newActivity;
};
const markItAsDone = async (id, note) => {
  if (!note) {
    note = "";
  }
  const act = await Activity.findById(id);
  (act.done = true), act.description.push(note);
  await act.save();
  return act;
};
const getAllActivitiesByProspect = async (prospectId) => {
  const query = { isDeleted: false };
  if (prospectId) {
    query.propspectId = prospectId;
  }
  console.log(query);
  const activites = await Activity.find(query);
  return activites;
};
const addNote = async (id, note) => {
  if (!note) {
    note = "";
  }
  const activity = await Activity.findById(id);
  activity.description.push(note);
  await activity.save();
  return activity;
};
module.exports = {
  addActivity,
  markItAsDone,
  getAllActivitiesByProspect,
  addNote,
};
