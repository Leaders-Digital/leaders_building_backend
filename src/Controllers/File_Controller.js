const path = require("path");
const File = require("../Models/File");
const AddFile = async (req, res) => {
  try {
    const { refId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "failed to upload the file " });
    }
    const fileData = {
      name: req.file.filename,
      FilePath: path
        .join("uploads", req.directory, req.file.filename)
        .replace(/\\/g, "/"),
      refId,
    };

    const fileRecord = new File(fileData);
    await fileRecord.save();
    return res
      .status(201)
      .json({ message: "file uploaded ", data: fileRecord });
  } catch (e) {
    return res
      .status(500)
      .json({ message: `internal server error : ${e.message}` });
  }
};

const GetFileByRef = async (req, res) => {
  try {
    const refid = req.params.id;
    const files = await File.find({ refId: refid });

    if (!files) {
      return res
        .status(200)
        .json({ message: "there is no files for this ref" });
    }
    return res
      .status(200)
      .json({ messages: "files retrieved with sucess", data: files });
  } catch (e) {
    return res.status(500).json({ message: `internal server error : ${e}` });
  }
};
module.exports = { AddFile, GetFileByRef };
