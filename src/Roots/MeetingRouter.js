const MeetingController = require("../Controllers/Meeting_Controller");
const express = require("express");
const createUploadMiddleware = require("../Middlewares/GenericUpload");
const { AddFile, GetFileByRef } = require("../Controllers/File_Controller");
const meetingRouter = express.Router();

const uploadRerpport = createUploadMiddleware({
  directory: "RDV_Files",
  fileTypes: ["jpg", "png", "jpeg", "pdf"],
  maxSize: 5 * 1024 * 1024,
  fieldName: "file",
});
meetingRouter.post("/add", MeetingController.createMeeting);
meetingRouter.put("/delete/:id", MeetingController.deleteMeeting);
meetingRouter.put("/update/:id", MeetingController.updateMeeting);
meetingRouter.get("/getAllMeetings", MeetingController.getAllMeetings);
meetingRouter.post("/uploadRepport", uploadRerpport, AddFile);
meetingRouter.get("/Repports/:id", GetFileByRef);
module.exports = meetingRouter;
