const express = require("express");
const router = express.Router();
const { usersAndPermissions } = require("../controllers/usersAndPermissions");

router.get(
  "/allUsersForAdmin",
  usersAndPermissions.createAdminPermissions,
  usersAndPermissions.createAdminUser
);
router.get(
  "/allUsersForStaffs",
  usersAndPermissions.createStaffsPermissions,
  usersAndPermissions.createStaffsUser
);
router.get(
  "/allUsersForGuardians",
  usersAndPermissions.createGuardiansPermissions,
  usersAndPermissions.createGuardiansUser
);
router.get(
  "/allUsersForStudents",
  usersAndPermissions.createStudentsPermissions,
  usersAndPermissions.createStudentsUser
);

module.exports = router;
