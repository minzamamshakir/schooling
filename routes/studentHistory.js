const router = require("express").Router();
const { studentHistory } = require("../controllers/studentHistory");
const { student } = require("../controllers/student");
const { session } = require("../controllers/session");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { classes } = require("../controllers/class");
const { school } = require("../controllers/school");
router.param("school", school.getSchoolById);

router.param("staffId", admin.getUserById);

router.post(
  "/:staffId/studentHistory/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  studentHistory.create
);
router.post(
  "/:staffId/studentHistory/ForFailStudents",
  auth.isSignedIn,
  auth.isAuthenticated,
  studentHistory.failStudents
);
// router.post(
//   "/:staffId/studentHistory/promoteSingleStudent",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   studentHistory.promoteSingleStudent
// );
router.post(
  "/:staffId/school/sessionsForPromotion",
  auth.isSignedIn,
  auth.isAuthenticated,
  // permissions.canAddBonusToAllStaffs,
  session.getSessionBySchool
);
router.post(
  "/:staffId/sectionForPromotion",
  auth.isSignedIn,
  auth.isAuthenticated,
  //   permissions.canGetDateSheet,
  classes.getClassAndSectionBySchool
);
router.post(
  "/:staffId/student/studentbySectionForPromotion",
  auth.isSignedIn,
  auth.isAuthenticated,
  //   permissions.canGetSingleSectionContact,
  student.getStudentBySection
);
router.post(
  "/:staffId/student/classChangeStudents",
  auth.isSignedIn,
  auth.isAuthenticated,
  //   permissions.canGetSingleSectionContact,
  studentHistory.classChangeStudents
);
module.exports = router;
