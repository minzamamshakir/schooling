const router = require("express").Router();
const multer = require("multer");
const { auth } = require("../controllers/auth");
const fs = require("fs");
const path = require("path");
const logger = require("../config/logger");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    school = `school`;
    campus = `school/${req.school}`;
    newPath = `school/${req.school}/staff`;
    // school = path.join(__dirname, `../school`);
    // campus = path.join(__dirname, `../school/${req.school}`);
    // newPath = path.join(__dirname, `../school/${req.school}/staff`);
    if (fs.existsSync(newPath)) {
      return cb(null, newPath);
    } else {
      if (!fs.existsSync(school)) {
        fs.mkdirSync(school);
        fs.mkdirSync(campus);
        fs.mkdirSync(newPath);
      } else if (!fs.existsSync(campus)) {
        fs.mkdirSync(campus);
        fs.mkdirSync(newPath);
      } else {
        fs.mkdirSync(newPath);
      }
      return cb(null, newPath);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + `.${file.originalname}`);
  },
});
router.param("school", (req, res, next, id) => {
  req.school = id;
  next();
});
const upload = multer({ storage: storage });
router.post(
  "/image/upload/:school/staff",
  upload.single("file"),
  function (req, res) {
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
  }
);

module.exports = router;
