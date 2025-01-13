const express = require("express");
const userRouter = require("./UserRoot");
const prospectRouter = require("./ProspectRouter");
const meetingRouter = require("./MeetingRouter");
const AuthMiddleware = require("../Middlewares/AuthMiddelware");
const AuthRouter = require("./AuthRoute");
const router = express.Router();

router.use("/admin", userRouter);
router.use("/prospect", prospectRouter);
router.use("/meeting", meetingRouter);
router.use("/user", AuthRouter);
module.exports = router;
