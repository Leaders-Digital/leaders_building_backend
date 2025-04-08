const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "ItemSection" }],
  devisID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Devis",
    require: true,
  },
});

module.exports = mongoose.model("SectionDevis", SectionSchema);
