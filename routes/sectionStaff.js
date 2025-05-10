const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { check } = require("express-validator");
const { section } = require("../controllers/section");
const { permissions } = require("../controllers/permissions");
router.param("staffId", admin.getUserById);
router.param("sectionId", section.getSectionById);

router.post(
  "/:staffId/section/create",
  [
    check("school", 'School is required to genrate "Section"'),
    check("level", 'Level is required to genrate "Section"'),
    check("gender", 'Gender is required to genrate "Section"'),
    check("class", 'Class is required to genrate "Section"'),
    check("name", 'Name is required to genrate "Section"'),
    check("color", 'Color is required to genrate "Section"'),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSection,
  section.create
);
router.get(
  "/:staffId/section",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSection,
  section.all
);
router.get(
  "/:staffId/section/:sectionId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSectionById,
  section.getSingleSection
);
router.get(
  "/:staffId/section/:sectionId/rollNo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetRollNo,
  section.getRollNo
);
router.put(
  "/:staffId/section/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSection,
  section.updateSection
);
router.get(
  "/:staffId/section/:sectionId/students",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentsBySection,
  section.getStudents
);
router.post(
  "/:staffId/section/getSectionByClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSectionByClass,
  section.getAllSectionByClass
);
router.get(
  "/:staffId/sectionPic/:sectionId",
  auth.isSignedIn,
  auth.isAuthenticated,
  section.getSingleSectionPic
);

module.exports = router;
