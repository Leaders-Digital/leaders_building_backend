const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String },
  projectType: { type: String },
  description: { type: String },
  status: { type: String },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  budget: { type: String },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Prospect" },
  location: { type: String },
  isDeleted: { type: Boolean, default: false },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  adress: {
    suburb: { type: String },
    city_district: { type: String },
    city: { type: String },
    state: { type: String },
    postcode: { type: String },
    country: { type: String },
  },
  expoToken: {type:String},
  video: [{ type: String }],
  lat: { type: String },
  lon: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
module.exports = mongoose.model("Project", ProjectSchema);
