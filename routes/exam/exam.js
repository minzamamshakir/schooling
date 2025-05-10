const router = require("express").Router();
const { exam } = require("../../controllers/exam/exam");
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");
const { dateSheet } = require("../../controllers/exam/dateSheet");
const { permissions } = require("../../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.post(
  "/:staffId/exam/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  exam.create,
);
router.post(
  "/:staffId/allExamTermsBySession",
  auth.isSignedIn,
  auth.isAuthenticated,
  exam.getExamTermBySession
);
router.get(
  "/:staffId/:schoolId/examBySchool",
  auth.isSignedIn,
  auth.isAuthenticated,
  exam.getExamBySchool
);
router.get(
  "/:staffId/exam/all",
  auth.isSignedIn,
  auth.isAuthenticated,
  exam.all,
);
module.exports = router;
