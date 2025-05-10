const router = require("express").Router();
const { eventManagement } = require("../controllers/eventManagment");
const { admin } = require("../controllers/admin");
const { auth } = require("../controllers/auth");
const { school } = require("../controllers/school");
const { staff } = require("../controllers/staff");
const { permissions } = require("../controllers/permissions");
router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("school", school.getSchoolById);
router.post(
  "/:staffId/event/:school/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateEvent,
  eventManagement.create
);
router.get(
  "/:staffId/event",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetEvents,
  eventManagement.get
);
router.get(
  "/:staffId/:school/events",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSchoolEvents,
  eventManagement.getEventOfSchool
);
router.get(
  "/:staffId/:school/eventDates",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetEventDates,
  eventManagement.getAllSchoolDates
);
router.post(
  "/:staffId/singleEvent",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleEvent,
  eventManagement.getEventById
);
router.put(
  "/:staffId/event/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateEvent,
  eventManagement.updateEvent
);
router.get(
  "/:staffId/:school/eventDatesForUpdate",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateEvent,
  eventManagement.getAllSchoolDates
);

module.exports = router;
