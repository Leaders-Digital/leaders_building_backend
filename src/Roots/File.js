const express = require("express");
const createUploadMiddleware = require("../Middlewares/GenericUpload");
const { AddFile, GetFileByRef,DeleteFile,GetFileById } = require("../Controllers/File_Controller");
const FileRouter = express.Router();

const uploadFile = createUploadMiddleware({
  directory: "Uploads_files",
  fileTypes: ["jpg", "png", "jpeg", "pdf", "xlsx"],
  maxSize: 20 * 1024 * 1024,
  fieldName: "file",
});

FileRouter.post("/addFile/:modelType/:refId", uploadFile, AddFile);
FileRouter.get("/getFile/:id", GetFileByRef);
FileRouter.get("/getFileById/:id", GetFileById);

FileRouter.delete("/delete/:id",DeleteFile)

module.exports = FileRouter;
