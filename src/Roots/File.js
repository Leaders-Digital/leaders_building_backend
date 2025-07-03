const express = require("express");
const multer = require("multer");
const createUploadMiddleware = require("../Middlewares/GenericUpload");
const { AddFile, GetFileByRef,DeleteFile,GetFileById } = require("../Controllers/File_Controller");
const FileRouter = express.Router();

const uploadFile = createUploadMiddleware({
  directory: "Uploads_files",
  fileTypes: ["jpg", "png", "jpeg", "pdf", "xlsx"],
  maxSize: 20 * 1024 * 1024, // 20MB limit
  fieldName: "file",
});

FileRouter.post("/addFile/:modelType/:refId", uploadFile, AddFile);

// Error handling middleware for multer
FileRouter.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        message: `File too large. Maximum size is ${20}MB.`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Too many files. Only one file allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        message: 'Unexpected file field.' 
      });
    }
  }
  next(error);
});
FileRouter.get("/getFile/:id", GetFileByRef);
FileRouter.get("/getFileById/:id", GetFileById);


FileRouter.delete("/delete/:id",DeleteFile)

module.exports = FileRouter;
