const path = require("path");
const File = require("../Models/File");
const Project = require("../Models/Project");

const {sendPushNotification} = require("../utils/sendPushNotification");
const AddFile = async (req, res) => {
  try {
    const { refId, modelType } = req.params;
    if (!req.file || !modelType) {
      return res.status(400).json({ message: "failed to upload the file " });
    }

    const fileData = {
      name: req.file.filename,
      FilePath: path
        .join("uploads", req.directory, req.file.filename)
        .replace(/\\/g, "/"),
      refId,
      modelType,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
    };

    const fileRecord = new File(fileData);
    await fileRecord.save();
    if (modelType==="Project"){
      console.log("1");
      const project=await Project.findById(req.params.refId);

      if(!project){
        res.status(404).json({message:"Project not found"});
      }
      const token=project.expoToken
      console.log(token)
      if (token) {
        await sendPushNotification(token, "new file has been added");
      }

    }
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
