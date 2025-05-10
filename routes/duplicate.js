const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
// getting admin controllers
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
const { duplicate } = require("../controllers/duplicate");

router.param("Id", admin.getUserById);
// all post routes
router.post(
  "/duplicate",
  // auth.isSignedIn,
  // auth.isAuthenticated,
  duplicate.forLevel,
  duplicate.forGender,
  duplicate.forClass,
  duplicate.forSection
);

module.exports = router;
