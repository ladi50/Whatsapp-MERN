const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "public", "images"));
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${uuidv4()}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const isValid = !!MIME_TYPE_MAP[file.mimetype];
  const error = isValid ? null : new Error("Invalid image type!");
  cb(error, isValid);
}

const imageUpload = multer({
  limits: 500000,
  storage,
  fileFilter
});

module.exports = imageUpload;
