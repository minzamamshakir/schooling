const express = require("express");
router = express.Router();
const { guardian } = require("../controllers/guardian");
control = require("../controllers/pdf");

router.post("/getPdf", control.create);
router.post("/getPdfWithPic", control.createPicPdf);
router.post("/getPdfOfPaidSalary", control.createPaidSalaryPdf);
router.post("/getGuardianReport", guardian.guardianMW, control.guardCreate);
module.exports = router;
