//const { default: mongoose } = require("mongoose");
const Meeting = require("../Models/Meetings");
const Prospect = require("../Models/Prospect");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const validateUpdateData = require("../Validators/Validator_UpdatedData");
const { ObjectId } = require("mongoose").Types;

dayjs.extend(utc);

const createMeeting = async (data) => {
  const { title, type, prospect, note, date, status, time, location, user } =
    data;
  if (!type || !prospect || !user || !status || !date) {
    throw new Error("one of the required fields is missing");
  }

  const normalizedDate = dayjs.utc(date).startOf("day").toDate();

  const existMeeting = await Meeting.findOne({
    user: user,
    date: normalizedDate,
    time: time,
    isDeleted: false,
  });

  if (existMeeting) {
    throw { message: "there is other meet at this provided time", status: 409 };
  }
  const meeting = await Meeting.create({
    title: title,
    type: type,
    prospect: prospect,
    note: note,
    date: normalizedDate,
    status: status,
    time: time,
    location: location,
    user: user,
  });
  if (meeting) {
    await Prospect.findByIdAndUpdate(
      { _id: prospect, isDeleted: false },
      { status: status }
    );
  }
  return meeting;
};

const deleteMeeting = async (id) => {
  const meeting = await Meeting.findById(id);
  if (!meeting) {
    throw { message: "there is no meeting by this id", status: 409 };
  }
  meeting.isDeleted = true;
  await meeting.save();
  return meeting;
};

const updateMeeting = async (meetingId, updatedData) => {
  validateUpdateData(updatedData);
  const meeting = await Meeting.findOne({ _id: meetingId, isDeleted: false });
  if (!meeting) {
    throw { message: "there is no meeting by this id", status: 409 };
  }
  for (const key in updatedData) {
    if (
      updatedData[key] !== undefined &&
      updatedData[key] !== meeting[key] &&
      key !== "_id"
    ) {
      meeting[key] = updatedData[key];
    }
  }
  await meeting.save();
  return meeting;
};
const getAllMeetings = async (
  page,
  limit,
  filters = {},
  search = "",
  prospectId
) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const matchQuery = {};
  if (prospectId) {
    matchQuery.prospect = new ObjectId(prospectId);
  }

  if (search) {
    matchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
    ];
  }

  if (filters.date) {
    const { start, end } = filters.date;
    matchQuery.date = {
      ...(start && { $gte: new Date(start) }),
      ...(end && { $lte: new Date(end) }),
    };
  }
  if (filters.status) {
    matchQuery.status = filters.status;
  }
  const result = await Meeting.aggregate([
    { $match: matchQuery },

    { $sort: { createdAt: -1 } },

    { $skip: skip },
    { $limit: limitNumber },

    {
      $facet: {
        data: [{ $project: { __v: 0 } }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);
  const meetings = result[0].data;
  const totalItems = result[0].totalCount[0]?.count || 0;
  return {
    meetings,
    totalItems,
    totalPages: Math.ceil(totalItems / limitNumber),
    currentPage: pageNumber,
  };
};

module.exports = {
  createMeeting,
  deleteMeeting,
  updateMeeting,
  getAllMeetings,
};
