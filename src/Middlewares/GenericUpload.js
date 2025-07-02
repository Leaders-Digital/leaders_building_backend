const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const createUploadMiddleware = ({
                                  directory,
                                  fileTypes,
                                  maxSize,
                                  fieldName,
                                }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = `./uploads/${directory}`;
      req.directory = directory;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const originalFileName = path
          .basename(file.originalname)
          .replace(/\s+/g, "_")
          .replace(/[^\w.-]/g, "");

      const fileUuid = uuidv4();
      const fileExtension = path.extname(file.originalname);
      const uniqueFileName = `${fileUuid}${fileExtension}`;
      cb(null, uniqueFileName);
    },
  });
  const upload = multer({
    storage: storage,
    limits: { 
      fileSize: maxSize,
      files: 1 // Only allow 1 file at a time
    },
    fileFilter: (req, file, cb) => {
      console.log("Multer fileFilter called");
      console.log("File:", file);
      console.log("Max size:", maxSize);
      console.log("File size:", file.size);
      const allowedExtensions = fileTypes.map(
          (type) => `.${type.toLowerCase()}`
      );
      const allowedMimeTypes = fileTypes.map((type) => `application/${type}`);
      const fileExt = path.extname(file.originalname).toLowerCase();
      const fileMime = file.mimetype.toLowerCase();

      const isAllowedExt = allowedExtensions.includes(fileExt);
      const isAllowedMime = allowedMimeTypes.some((mime) =>
          fileMime.includes(mime)
      );

      if (isAllowedExt || isAllowedMime) {
        return cb(null, true);
      }

      cb(
          new Error(
              `Invalid file type. Allowed types are: ${fileTypes.join(", ")}`
          )
      );
    },
  }).single(fieldName);
  
  // Add error handling wrapper
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.log("Multer error:", err);
        if (err instanceof multer.MulterError) {
          console.log("Multer error code:", err.code);
          console.log("Multer error message:", err.message);
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};
module.exports = createUploadMiddleware;
