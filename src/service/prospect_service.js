const Prospect = require("../Models/Prospect");
const getAllRecords = require("../utils/getAllRecords");
const createProspect = async (data) => {
  const { name, lastName, telephone, email, adress, dateDeNaissance, cin } =
    data;

  if (!name || !lastName || !telephone || !email) {
    throw new Error("One of the required fields is missing");
  }

  const existPros = await Prospect.findOne({ email: email });
  if (existPros) {
    throw new Error("This email already exists");
  }

  const prospect = await Prospect.create({
    name,
    lastName,
    telephone,
    email,
    adress,
    dateDeNaissance,
    CIN: cin,
  });

  return prospect;
};

const deleteProspect = async (prospectId) => {
  const prospectExists = await Prospect.exists({ _id: prospectId });
  if (!prospectExists) {
    throw new Error("There is no prospect by this ID");
  }

  const prospect = await Prospect.findByIdAndUpdate(
    { _id: prospectId },
    { isDeleted: true },
    { new: true }
  ).select("-password -CIN");

  return prospect;
};

const updateProspect = async (prospectId, updatedData) => {
  const prospect = await Prospect.findOne({
    _id: prospectId,
    isDeleted: false,
  });
  if (!prospect) {
    throw new Error("There is no prospect by this ID");
  }

  for (const key in updatedData) {
    if (
      updatedData[key] !== undefined &&
      updatedData[key] !== prospect[key] &&
      key !== "type" &&
      key !== "_id"
    ) {
      prospect[key] = updatedData[key];
    }
  }
  await prospect.save();

  return prospect;
};

const getAllProspects = async (page, limit, filters = {}, search = "") => {
  const extraQuery = { isDeleted: false };

  const searchFields = ["name", "lastName", "email"];

  const result = await getAllRecords(
    Prospect,
    page,
    limit,
    filters,
    search,
    extraQuery,
    searchFields
  );

  return {
    prospects: result.records,
    totalItems: result.totalItems,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
  };
};

const getProspectById = async (prospectId) => {
  const prospect = await Prospect.findOne({
    _id: prospectId,
    isDeleted: false,
  }).select("-password");

  if (!prospect) {
    throw new Error("There is no prospect by this ID");
  }

  return prospect;
};

const becomeClient = async (prospectId, data) => {
  const { cin, password } = data;

  if (!cin || !password) {
    throw new Error("Password and CIN are required");
  }

  const prospect = await Prospect.findOne({
    _id: prospectId,
    isDeleted: false,
  }).select("-password");

  if (!prospect) {
    throw new Error("There is no prospect by this ID");
  }

  prospect.password = password;
  prospect.CIN = cin;
  prospect.type = "client";
  await prospect.save();

  return prospect;
};

module.exports = {
  createProspect,
  deleteProspect,
  updateProspect,
  getAllProspects,
  getProspectById,
  becomeClient,
};
