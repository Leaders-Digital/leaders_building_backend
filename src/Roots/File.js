const express = require("express");
const multer = require("multer");
const createUploadMiddleware = require("../Middlewares/GenericUpload");
const { AddFile, GetFileByRef,DeleteFile,GetFileById } = require("../Controllers/File_Controller");
const FileRouter = express.Router();

// Add CORS headers specifically for file uploads
FileRouter.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3008',
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'http://51.68.172.145:3002',
    'https://serveur.leaders-building.com',
    'https://crm.leaders-building.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
