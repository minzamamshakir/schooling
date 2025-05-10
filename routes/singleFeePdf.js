const express = require("express");
router = express.Router();

const { feePdf } = require("../controllers/singleFeePdf");
const { fee } = require("../controllers/accounts/fee");
const { admin } = require("../controllers/admin");
router.param("superId", admin.getUserById);

router.post(
  "/singlestdfeevoucher",
  fee.getSingleStudentFeeVoucherMW,
  feePdf.create2
);
router.post(
  "/singleguardfeevoucher",
  fee.getSingleGuardianWiseFeeMW,
  feePdf.create3
);

module.exports = router;
