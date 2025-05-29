const Devis = require("../Models/Devis");
const {
  createDevis,
  getDevisById,
  createSection,
} = require("../service/devisService");
const getAllRecords = require("../utils/getAllRecords");

const CreateDevis = async (req, res) => {
  try {
    console.log("data", req.body);
    const data = req?.body;

    const resulta = await createDevis(data);
    return res.status(200).json({ message: "sucess", data: resulta });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const GetDevisbyId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getDevisById(id);
    if (!result || !result.length) {
      return res.status(400).json({ message: "there is no devis by this id " });
    }
    return res.status(200).json({ message: "sucess", data: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
const CreateSection = async (req, res) => {
  try {
    const data = req?.body;
    console.log("section", data);
    const result = await createSection(data);
    if (!result || !result.length) {
      return res.status(400).json({ message: "there is no section" });
    }
    return res.status(200).json({ message: "sucess", data: result });
  } catch (e) {
    return res.status(500).json({ mesage: e.message });
  }
};
const GetAllDevis = async (req, res) => {
  try {
    const filters = { isDeleted: false };
    const searchFields = ["name", "status"];
    const objectIdFields = ["projectId"];
    await getAllRecords(
      Devis,
      req,
      res,
      searchFields,
      filters,
      "createdAt",
      objectIdFields
    );
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
module.exports = {
  CreateDevis,
  GetDevisbyId,
  CreateSection,
  GetAllDevis,
};
