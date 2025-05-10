const router = require("express").Router();
const multer = require("multer");
const { auth } = require("../controllers/auth");
const fs = require("fs");
const path = require("path");
const logger = require("../config/logger");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    newPath = path.join(__dirname, "../tmp");
    if (fs.existsSync(newPath)) {
      return cb(null, newPath);
    } else {
      fs.mkdirSync(newPath);
      return cb(null, newPath);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + `.${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
router.post("/image/upload", upload.single("file"), function (req, res) {
  try {
    logger.info(req.file, req.body);
    if (req.file) {
      return res.json(req.file);
    } else {
      return res.status(400).json({ err: "file not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
