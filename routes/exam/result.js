const router = require("express").Router();
const { result } = require("../../controllers/exam/result");
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");
const { permissions } = require("../../controllers/permissions");

router.param("staffId", admin.getUserById);

router.post(
  "/:staffId/result/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  result.create,
  result.positionOfStd
);
router.post(
  "/:staffId/resultBySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  result.getResultBySection
);
router.post(
  "/:staffId/resultBySectionForPrint",
  auth.isSignedIn,
  auth.isAuthenticated,
  result.alltermResultBySection,
  result.getResultBySectionForPrint
);
router.post(
  "/:staffId/result/stdRegNo",
  auth.isSignedIn,
  auth.isAuthenticated,
  result.getResultByStdRegNo
);
router.post(
  "/:staffId/studentStrengthForResult",
  auth.isSignedIn,
  auth.isAuthenticated,
  result.studentStrengthForResult
);
router.post(
  "/:staffId/deleteDuplicate",
  auth.isSignedIn,
  auth.isAuthenticated,
  result.deleteDuplicate
);
// router.post(
//   "/:staffId/passStudentStrengthForResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   result.passStudentStrengthForResult
// );
// router.post(
//   "/:staffId/failStudentStrengthForResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   result.failStudentStrengthForResult
// );
// router.post(
//   "/:staffId/failButPromoteStudentStrengthForResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   result.failButPromoteStudentStrengthForResult
// );
// router.post(
//   "/:staffId/classStrengthForResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   result.classStrengthForResult
// );
// router.post(
//   "/:staffId/passClassStrengthForResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   result.passClassStrengthForResult
// );
// router.post(
//   "/:staffId/failClassStrengthForResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   result.failClassStrengthForResult
// );
// router.post(
//   "/:staffId/failButPromoteClassStrengthForResult",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   result.failButPromoteClassStrengthForResult
// );
router.put(
  "/:staffId/updateResultForSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  result.updateResult,
  result.positionOfStd
);
module.exports = router;
