const Project = require("../Models/Project");
const {sendPushNotification} = require("../utils/sendPushNotification");
const {createPauseRecord, resumeProjectAndShiftDates} = require("../utils/placeProjectOnHold");

const CreateProject = async (data) => {
  try {
    const res = await new Project(data);
    await res.save();
    return res;
  } catch (e) {
    throw e;
  }
};
const updateProject = async (id, updatedData) => {
  try {
    const project = await Project.findOne({ _id: id, isDeleted: false });
    if (!project) throw new Error("there is no project by this id");

    const updates = [];
    const oldStatus = project.status;
    const newStatus = updatedData.status;
    let shouldPreserveDateEnd = false;

    // Check if we're resuming from pause
    if (oldStatus === "En Pause" && newStatus !== "En Pause") {
      shouldPreserveDateEnd = true;
    }

    for (const key in updatedData) {
      if (
          updatedData[key] !== undefined &&
          updatedData[key] !== project[key] &&
          key !== "type" &&
          key !== "_id" &&
          !(shouldPreserveDateEnd && key === "dateEnd") // Don't overwrite dateEnd if resuming from pause
      ) {
        if (
            key === "video" &&
            Array.isArray(updatedData.video) &&
            updatedData.video.length !== (project.video?.length || 0)
        ) {
          updates.push("Video updated");
        }

        project[key] = updatedData[key];
        project.markModified(key);
      }
    }

    if (oldStatus !== newStatus) {
      if (newStatus === "En Pause") {
        await createPauseRecord(project._id);
      } else if (oldStatus === "En Pause" && newStatus !== "En Pause") {
        await resumeProjectAndShiftDates(project._id);
      }
    }

    await project.save();

    if (updates.length && project.clientId) {
      const token = project.expoToken;
      if (token) {
        await sendPushNotification(token, updates.join(", "));
      }
    }

    return project;
  } catch (e) {
    throw e;
  }
};

const deleteProject = async (id) => {
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      throw new Error("there is no project by this id");
    }
    project.isDeleted = true;
    project.save();
    return project;
  } catch (e) {
    throw e;
  }
};
const getProjectById = async (id) => {
  try {
    const project = await Project.findOne({ _id: id })
      .populate("photos")
      .populate("members")
        .populate('phases')

    if (!project) {
      throw new Error("there is no proejct by this id");
    }
    return project;
  } catch (e) {
    throw e;
  }
};
module.exports = {
  CreateProject,
  updateProject,
  deleteProject,
  getProjectById,
};
