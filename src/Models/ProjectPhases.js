const mongoose = require("mongoose");

const ProjectPhasesSchema = new mongoose.Schema({
    name: { type: String },
   status: {
           type: String,
           enum: ["en cours", "terminée","en attente"],
           default: "en attente",
      },
    pourcentage: { type: Number },
    startDate: { type: Date },
    finishDate: { type: Date },
    projectId:{ type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});
module.exports = mongoose.model("ProjectPhases", ProjectPhasesSchema);
