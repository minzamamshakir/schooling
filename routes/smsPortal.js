const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { sms } = require("../controllers/smsPortal");
const { check } = require("express-validator");
const validationError = require("../controllers/validationError");
router.param("superId", admin.getUserById);

router.post(
  "/:superId/smsToNumberCustom",
  [
    check("to", "Phone Number is Required").exists(),
    check("msg", "Message Data is Required").exists(),
  ],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  sms.sendSmsToNumberCustom
);
router.post(
  "/:superId/smsToMultiCustom",
  [
    check("to", "Phone Number Array is Required").isArray(),
    check("msg", "Message Data is Required").exists(),
  ],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  sms.sendSmsToMultiCustom
);

module.exports = router;
