const Prospect = require("../Models/Prospect");
const {
  createProspectt,
} = require("../service/ProspectService/createProspect");

const getAllRecords = require("../utils/getAllRecords");
const prospectService = require("../service/prospect_service");
const createProspect = async (req, res) => {
  try {
    const prospect = await createProspectt(req.body);
    res.status(201).json({ message: "Prospect created", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProspect = async (req, res) => {
  try {
    const prospect = await prospectService.deleteProspect(req.params.id);
    res.status(200).json({ message: "Prospect deleted", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProspect = async (req, res) => {
  try {
    console.log("propect data", req.body);
    const prospect = await prospectService.updateProspect(
      req.params.id,
      req.body
    );
    res.status(200).json({ message: "Prospect updated", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllProspects = async (req, res) => {
  const filters = { isDeleted: false, type: "prospect" };
  const searchFields = ["name", "lastName", "email", "status"];
  await getAllRecords(Prospect, req, res, searchFields, filters);
};

const getProspectById = async (req, res) => {
  try {
    console.log("the endpoint trrigrd");
    const prospect = await prospectService.getProspectById(req.params.id);
    res.status(200).json({ data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const becomeClient = async (req, res) => {
  try {
    const prospect = await prospectService.becomeClient(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .json({ message: "Prospect became a client", data: prospect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllClients = async (req, res) => {
  const filters = { isDeleted: false, type: "client" };
  const searchFields = ["name", "lastName", "email", "status"];
  await getAllRecords(Prospect, req, res, searchFields, filters);
};
module.exports = {
  createProspect,
  deleteProspect,
  updateProspect,
  getAllProspects,
  getProspectById,
  becomeClient,
  getAllClients,
};
