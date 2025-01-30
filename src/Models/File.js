const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    name: { type: String },

    FilePath: { type: String, required: true },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "modelType",
    },
    modelType: {
      type: String,
      required: true,
      enum: ["Meeting", "Prospect"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
