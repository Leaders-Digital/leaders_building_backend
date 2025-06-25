const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String },
  projectType: { type: String },
  description: { type: String },
  status: { type: String },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  budget: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: { type: String },
  isDeleted: { type: Boolean, default: false },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  address: {
    suburb: { type: String },
    city_district: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: String },
    country: { type: String },
  },
  expoToken: {type:String},
  video: [{ type: mongoose.Schema.Types.Mixed }],
  lat: { type: String },
  lon: { type: String },
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectPhases" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.models.Project || mongoose.model("Project", ProjectSchema);