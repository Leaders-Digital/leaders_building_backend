const express = require("express");
const userRouter = require("./UserRoot");
const prospectRouter = require("./ProspectRouter");
const meetingRouter = require("./MeetingRouter");
const AuthMiddleware = require("../Middlewares/AuthMiddelware");
const AuthRouter = require("./AuthRoute");
const FileRouter = require("./File");
const ActivityRouter = require("./ActivityRoute");
const DevisRouter = require("./DevisRoote");
const ProjectRouter = require("./ProjectRouter");
const ProjectPhaseRouter = require("./ProjectPhasesRouter");
const router = express.Router();

router.use("/admin", userRouter);
router.use("/prospect", prospectRouter);
router.use("/meeting", meetingRouter);
router.use("/user", AuthRouter);
router.use("/file", FileRouter);
router.use("/activity", ActivityRouter);
router.use("/devis", DevisRouter);
router.use("/project", ProjectRouter);
router.use("/projectPhase", ProjectPhaseRouter);

module.exports = router;
