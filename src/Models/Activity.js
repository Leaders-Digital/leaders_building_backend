const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    activity: {
      type: String,
      enum: [
        "Appel téléphonique",
        "Rendez-vous physique",
        "Relance",
        "Envoi documents",
        "Evénement",
        "Envoi Mail",
      ],
    },
    description: { type: String },
    date: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    propspectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
