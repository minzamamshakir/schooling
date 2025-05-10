const router = require("express").Router();
const { exam } = require("../../controllers/exam/exam");
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");
const { dateSheet } = require("../../controllers/exam/dateSheet");
const { result } = require("../../controllers/exam/result");
const { permissions } = require("../../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.post(
  "/:staffId/dateSheet/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  dateSheet.create
);
router.post(
  "/:staffId/dateSheetBySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  dateSheet.getDateSheetBySection,
  dateSheet.getDataForResultForAdmin
);
router.post(
  "/:staffId/dataForResult",
  auth.isSignedIn,
  auth.isAuthenticated,
  dateSheet.getDataForResult,
  dateSheet.getDataForResultForAdmin
);
router.get(
  "/:staffId/dateSheet/all",
  auth.isSignedIn,
  auth.isAuthenticated,
  dateSheet.all
);
router.put(
  "/:staffId/:id/dateSheet/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  dateSheet.updateDateSheet
);
module.exports = router;
