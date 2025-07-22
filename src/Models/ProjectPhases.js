const mongoose = require("mongoose");

const SubPhaseSchema = new mongoose.Schema({
  name: String,
  status: String,
  pourcentage: String,
  startDate: String,
  finishDate: String
});

const PhaseSchema = new mongoose.Schema({
  name: String,
  status: String,
  pourcentage: String,
  startDate: String,
  finishDate: String,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  subphases: [SubPhaseSchema]
}, { timestamps: true });

module.exports = mongoose.model("ProjectPhases", PhaseSchema);

