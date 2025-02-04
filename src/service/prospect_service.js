const Prospect = require("../Models/Prospect");
const getAllRecords = require("../utils/getAllRecords");

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
  deleteProspect,
  updateProspect,
  getAllProspects,
  getProspectById,
  becomeClient,
};
