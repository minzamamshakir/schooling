const express = require("express");
router = express.Router();

control = require("../controllers/allStdpdf");
const { student } = require("../controllers/student");

router.post("/getAllStdPdf", student.allStudents, control.create);
router.post("/getAllStdPdfWithPic", student.allStudents, control.createPicPdf);
module.exports = router;
