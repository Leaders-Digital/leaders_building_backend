const {
  createDevis,
  getDevisById,
  createSection,
} = require("../service/devisService");

const CreateDevis = async (req, res) => {
  try {
    console.log("data", req.body);
    const data = req?.body;
    const devis = { ...data, section: [] };

    const resulta = await createDevis(devis);
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
module.exports = {
  CreateDevis,
  GetDevisbyId,
  CreateSection,
};
