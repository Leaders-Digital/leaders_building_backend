const express = require("express");
const createUploadMiddleware = require("../Middlewares/GenericUpload");
const { AddFile } = require("../Controllers/File_Controller");
const FileRouter = express.Router();

const uploadFile = createUploadMiddleware({
  directory: "Uploads_files",
  fileTypes: ["jpg", "png", "jpeg", "pdf"],
  maxSize: 5 * 1024 * 1024,
  fieldName: "file",
});

FileRouter.post("/addFile/:modelType/:refId", uploadFile, AddFile);

module.exports = FileRouter;
