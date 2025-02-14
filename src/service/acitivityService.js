const dayjs = require("dayjs");
const Activity = require("../Models/Activity");

const addActivity = async (data) => {
  const { activity, date, description, propspectId } = data;

  if (!date || !activity) {
    throw new Error("one of the required fields is missing");
  }
  const normlizeDate = dayjs.utc(date).startOf("day").toDate();
  const newActivity = await Activity.create({
    date: normlizeDate,
    activity: activity,
    description: description,
    propspectId: propspectId,
  });
  return newActivity;
};
const markItAsDone = async (id) => {
  const act = await Activity.findByIdAndUpdate(
    { _id: id },
    { done: true },
    { new: true }
  );
  return act;
};
module.exports = {
  addActivity,
  markItAsDone,
};
