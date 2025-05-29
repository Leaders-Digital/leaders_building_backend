const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    title: { type: String },
    type: { type: String, enum: ["telephone", "en ligne", "rendez-vous"] },
    prospect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prospect",
      required: true,
    },
    note: { type: String },
    date: { type: Date, required: true },
    time: { type: String },
    status: {
      type: String,
      enum: [
        "pas encore de résultat",
        "À rappeler",
        "RDV",
        "Pas intéressé",
        "Injoignable",
        "Reporter",
        "RDV annulé",
      ],
      default: "pas encore de résultat",
    },
    location: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Meeting", MeetingSchema);
