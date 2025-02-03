/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */

const MeetingService = require("../service/meeting_service");

const createMeeting = async (req, res) => {
  try {
    const meeting = await MeetingService.createMeeting(req.body);
    return res.status(201).json({ message: "Meeting created ", data: meeting });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ message: `internal server error ${e.message}` });
  }
};
const deleteMeeting = async (req, res) => {
  try {
    const meeting = await MeetingService.deleteMeeting(req.params.id);
    return res
      .status(200)
      .json({ message: " Meeting deleted ", data: meeting });
  } catch (e) {
    return res
      .status(400)
      .json({ message: `internal server error : ${e.message}` });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await MeetingService.updateMeeting(req.params.id, req.body);
    return res.status(200).json({ message: "meeting updated", data: meeting });
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: `internal server error : ${e.message}` });
  }
};
const getAllMeetings = async (req, res) => {
  try {
    const { page = 1, limit = 10, prospectId } = req.query;
    const filters = req.body.filters || {};
    console.log("filters", filters);
    console.log("search", prospectId);

    const result = await MeetingService.getAllMeetings(
      page,
      limit,
      filters,

      prospectId
    );
    return res.status(200).json({
      meetings: result.meetings,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    });
  } catch (e) {
    console.log(e.message);
    return res
      .status(400)
      .json({ message: `internal server error :${e.message}` });
  }
};
module.exports = {
  createMeeting,
  deleteMeeting,
  updateMeeting,
  getAllMeetings,
};
