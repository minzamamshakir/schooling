const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { check } = require("express-validator");
const { session } = require("../controllers/session");
const { admin } = require("../controllers/admin");
const { receiveMonth } = require("../controllers/receiveMonth");
const { salaryMonth } = require("../controllers/salaryMonth");
const { permissions } = require("../controllers/permissions");

router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("sessionId", session.getSessionById);
router.post(
  "/:staffId/session/create",
  [
    check("school", 'School is required to genrate "Session"'),
    check("duration", 'Duration is required to genrate "Session"'),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSession,
  session.create,
  receiveMonth.create,
  salaryMonth.create
);

router.get(
  "/:staffId/session",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSession,
  session.all
);
router.get(
  "/:staffId/:school/session",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSession,
  session.sessionBySchool
);
router.get(
  "/:staffId/session/:sessionId",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSession,
  session.getSingleSession
);
router.put(
  "/:staffId/session/:sessionId/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateSession,
  session.updateSession
);
router.post(
  "/:staffId/school/session",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSessionBySchool,
  session.getSessionBySchool
);
module.exports = router;
