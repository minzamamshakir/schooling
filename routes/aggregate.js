const router = require("express").Router();
const { aggregate } = require("../controllers/aggregate");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
router.param("staffId", admin.getUserById);

router.post(
  "/:staffId/totalFeeDataOfClassesByMonth",
  auth.isSignedIn,
  auth.isAuthenticated,
  aggregate.getTotalFeeDataOfClassesByMonth
);
// router.post(
//   "/:staffId/feeDataOfClassesByMonth",
//   auth.isSignedIn,
//   auth.isAuthenticated,
//   aggregate.getFeeDataOfClassesByMonth
// );
router.post(
  "/:staffId/schoolFeeHistory",
  auth.isSignedIn,
  auth.isAuthenticated,
  aggregate.getSchoolFeeAllMonth
);
router.post(
  "/:staffId/totalDataForResult",
  auth.isSignedIn,
  auth.isAuthenticated,
  aggregate.getDataForResult
);
router.post(
  "/:staffId/resultDataOfClasses",
  auth.isSignedIn,
  auth.isAuthenticated,
  aggregate.getResultDataOfClasses
);

module.exports = router;
