const Project = require("../Models/Project");
const {sendPushNotification} = require("../utils/sendPushNotification");

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

    for (const key in updatedData) {
      if (
          updatedData[key] !== undefined &&
          updatedData[key] !== project[key] &&
          key !== "type" &&
          key !== "_id"
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


    await project.save();

    if (updates.length && project.clientId) {
      const token=project.expoToken
      if (token) {
        const message=await sendPushNotification(token, updates.join(", "));
        console.log(message);
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
    const project = await Project.findOne({ _id: id }).populate("clientId");
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
