const { default: mongoose } = require("mongoose");

const DevisSchema = new mongoose.Schema({
  title: { type: String },

  pTotalHT: { type: Number },
  status: { type: String },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "SectionDevis" }],
});
module.exports = mongoose.model("Devis", DevisSchema);
