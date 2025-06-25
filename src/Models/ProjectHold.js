const mongoose = require("mongoose");

const ProjectHoldSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    holdStartDate: { type: Date, required: true },
    holdEndDate: { type: Date, default: null },
});

module.exports = mongoose.model("ProjectHold", ProjectHoldSchema);

