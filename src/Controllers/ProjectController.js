const Project = require("../Models/Project");
const Prospect = require("../Models/Prospect");
const User = require("../Models/User");

const {
  CreateProject,
  updateProject,
  deleteProject,
  getProjectById,
} = require("../service/projectService");
const getAllRecords = require("../utils/getAllRecords");

const createProject = async (req, res) => {
  try {
    const data = req?.body;
console.log(data)
    if (!data.clientId) {
      return res.status(400).json({ message: "to create project need client" });
    }
    const Client = await  User.findById(data?.clientId);
    if (!Client || Client == undefined) {
      return res
        .status(400)
        .json({ message: "there is no Client byh this client id" });
    }

    const result = await CreateProject(data);

    if (!result) {
      return res.status(400).json({
        message: "problem occured dureing the creation of the project",
      });
    }
    return res.status(200).json({ message: "sucess", data: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const UpdateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await updateProject(id, data);
    if (!result) {
      return res
        .status(400)
        .json({ message: "problem occured duriong the update of a project" });
    }
    return res.status(200).json({ message: "sucess", data: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
const DeleteProject = async (req, res) => {
  try {
    const id = req?.params?.id;
    const result = await deleteProject(id);

    if (!result) {
      return res
        .status(400)
        .json({ message: "a problem occured during the delete" });
    }
    return res.status(200).json({ message: "sucess", data: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
const getAllProjects = async (req, res) => {
  try {
    const filters = { isDeleted: false };
    const searchFields = [
      "name",
      "lastName",
      "status",
      "location",
      "projectId",
    ];
    await getAllRecords(Project, req, res, searchFields, filters);

  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
const GetProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getProjectById(id);
    if (!result) {
      throw new Error("there is no project by this id");
    }
    return res.status(200).json({ message: "sucess", data: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
const GetProjectsByClientId = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }
    const projects = await Project.find({ clientId: clientId }).populate(
      "members"
    );
    res.status(200).json({ data: projects });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
module.exports = {
  createProject,
  UpdateProject,
  DeleteProject,
  getAllProjects,
  GetProjectById,
  GetProjectsByClientId,
};
