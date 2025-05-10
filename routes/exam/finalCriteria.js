const router = require("express").Router();
const { finalCriteria } = require("../../controllers/exam/finalCriteria");
const { session } = require("../../controllers/session");
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");

router.param("staffId", admin.getUserById);

router.post(
  "/:staffId/finalCriteria/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  finalCriteria.create
);
router.post(
  "/:staffId/finalCriteria/forAnnual",
  auth.isSignedIn,
  auth.isAuthenticated,
  finalCriteria.finalCriteriaForAnnual
);
router.post(
  "/:staffId/finalCriteria/getFailStd",
  auth.isSignedIn,
  auth.isAuthenticated,
  finalCriteria.getFailStudents
);
router.post(
  "/:staffId/school/sessionsForFinalCriteria",
  auth.isSignedIn,
  auth.isAuthenticated,
  // permissions.canAddBonusToAllStaffs,
  session.getSessionBySchool
);
module.exports = router;
