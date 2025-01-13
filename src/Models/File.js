const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    name: { type: String },
    refId: { type: String, required: true },
    FilePath: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);
