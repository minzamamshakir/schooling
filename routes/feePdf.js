const express = require("express");
router = express.Router();

const { feePdf } = require("../controllers/feePdf");
const { fee } = require("../controllers/accounts/fee");
const { admin } = require("../controllers/admin");
router.param("superId", admin.getUserById);

router.post("/:superId/feevoucher", fee.getStudentFeeVoucherMW, feePdf.create2);
router.post(
  "/:superId/feevoucher/guard",
  fee.getGuardianWiseFeeMW,
  feePdf.create3
);

module.exports = router;
