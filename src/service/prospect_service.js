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
  console.log("Updated Data:", updatedData);

  const updatedProspect = await Prospect.findByIdAndUpdate(
    prospectId,
    updatedData,
    { new: true }
  );

  if (!updatedProspect) {
    throw new Error("No prospect found with this ID");
  }

  console.log("Prospect after update:", updatedProspect.toJSON());
  return updatedProspect;
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
