const Devis = require("../Models/Devis");

const createDevis = async (data) => {
  try {
    console.log("dfata from service ", data);
    const res = new Devis(data);
    await res.save();
    return res;
  } catch (e) {
    throw e;
  }
};
const getDevisById = async (id) => {
  try {
    const resultat = await Devis.find({ _id: id });

    return resultat;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createDevis,
  getDevisById,
};
