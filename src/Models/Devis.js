const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ItemSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  description: { type: String },
  puHT: { type: Number },
  ptHT: { type: String },
  qte: { type: Number },
  title: { type: String },
  unite: { type: String },
});
const sectionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String },
  items: [ItemSchema],
  description: { type: String },
  ptHT: { type: String },
});

const DevisSchema = new mongoose.Schema(
  {
    title: { type: String },
    devistotal: { type: String },
    name: { type: String },
    lastName: { type: String },
    sections: [sectionSchema],
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    prospectId: { type: mongoose.Schema.Types.ObjectId, ref: "Prospect" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Devis", DevisSchema);
