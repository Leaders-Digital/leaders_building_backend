const dayjs = require("dayjs");
const Activity = require("../Models/Activity");
const Prospect = require("../Models/Prospect");
const { default: mongoose } = require("mongoose");

const addActivity = async (data) => {
  const { activity, date, description, propspectId } = data;

  if (!date || !activity || !propspectId) {
    throw new Error("Les champs date, activity et propspectId sont obligatoires");
  }

  // Vérifier que le prospect existe
  const prospect = await Prospect.findById(propspectId);
  if (!prospect) {
    throw new Error("Prospect non trouvé");
  }

  const normalizedDate = dayjs(date).utc().toDate();
  const newActivity = await Activity.create({
    date: normalizedDate,
    activity: activity,
    description: description ? [description] : [],
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
  if (!prospectId) {
    throw new Error("L'ID du prospect est obligatoire");
  }

  // Vérifier que le prospect existe
  const prospect = await Prospect.findById(prospectId);
  if (!prospect) {
    throw new Error("Prospect non trouvé");
  }

  const activities = await Activity.find({
    propspectId: prospectId,
    isDeleted: false
  }).sort({ date: -1 }); // Trier par date décroissante (plus récent en premier)

  return activities;
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
