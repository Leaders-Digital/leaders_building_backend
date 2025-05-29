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
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
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
  return upload;
};
module.exports = createUploadMiddleware;
