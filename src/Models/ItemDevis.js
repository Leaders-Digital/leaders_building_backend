const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  unite: { type: String },
  qte: { type: Number },
  puHT: { type: Number },
  ptHT: { type: Number },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SectionDevis",
    require: "true",
  },
});
module.exports = mongoose.model("ItemSection", ItemSchema);
