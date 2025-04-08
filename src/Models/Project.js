const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String },
  projectType: { type: String },
  description: { type: String },
  status: { type: String },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  budget: { type: String },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Prospect" },
  location: { type: String },
});
module.exports = mongoose.model("Project", ProjectSchema);
