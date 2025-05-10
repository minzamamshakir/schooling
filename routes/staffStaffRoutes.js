const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { staff } = require("../controllers/staff");
const { check } = require("express-validator");
const { attendance } = require("../controllers/attendance");
const { school } = require("../controllers/school");
const { permissions } = require("../controllers/permissions");
const { user } = require("../controllers/user");
router.param("superId", admin.getUserById);
// router.param("getStaffId", permissions.getPermissionsById);
router.param("staffId", staff.getStaffByIdToSet);
router.param("school", school.getSchoolById);
router.post(
  "/:superId/staff/create",
  [
    check("title", "Title is Required"),
    check("school", "School is Required"),
    check("firstName", "First name is required"),
    check("lastName", "Last name is required"),
    check("jobTitle", "Job title is required"),
    check("username", "UserName is required"),
    check("education", "Education is required"),
    check("cnic", "cnic is required"),
    check("contactNum", "contact Num is required"),
    check("contactNum2", "contact Num2 is required"),
    check("password", "password is required"),
    check("cardNo", "card No is required"),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateStaff,
  staff.create,
  permissions.createStepForStaff,
  attendance.sessionAttendenceStaff,
  user.createStepForStaff
);
router.post(
  "/:superId/staff",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStaff,
  staff.all
);
router.get(
  "/:staffId/singleStaffMember",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStaffSingleMember,
  staff.singleStaff
);
router.get(
  "/:superId/:staffId/singleStaffMember",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStaffSingleMember,
  staff.singleStaff
);
router.get(
  "/:superId/:staffId/singleStaffForUser",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStaffSingleMember,
  staff.getSingleStaffForUser
);
router.put(
  "/:superId/:staffId/updateStaff",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateStaff,
  staff.getStaffById,
  staff.updateSingleStaff
);
router.put(
  "/:superId/:staffId/updateStaffForActiveInActive",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateStaff,
  staff.getStaffById,
  staff.updateStaffForActiveInActive
);
router.post(
  "/:superId/staff/regNum",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStaffRegNum,
  staff.getStaffByReg
);
router.post(
  "/:superId/staff/section",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStaffBySection,
  staff.getStaffBySection
);
router.get(
  "/:superId/:school/sectionIncharges",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSectionIncharges,
  staff.getClassIncharges
);
router.post(
  "/:superId/setSectionIncharge",
  auth.isSignedIn,
  auth.isAuthenticated,
  auth.isAdmin,
  staff.setIncharge
);
router.post(
  "/:superId/clearSectionIncharge",
  auth.isSignedIn,
  auth.isAuthenticated,
  auth.isAdmin,
  staff.clearIncharge
);
router.post(
  "/:superId/getStaffStrength",
  auth.isSignedIn,
  auth.isAuthenticated,
  staff.getStaffStrength
);
router.post(
  "/:superId/getStaffAsTeachers",
  auth.isSignedIn,
  auth.isAuthenticated,
  staff.staffOfTeachers
);
router.get(
  "/:superId/:school/allStaff",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAllStaff,
  staff.getStaffBySchool
);
router.get(
  "/:superId/:school/allStaffForActiveInActive",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAllStaff,
  staff.getStaffForActiveInActive
);
router.get(
  "/:superId/profile",
  auth.isSignedIn,
  auth.isAuthenticated,
  staff.singleStaffProfile
);
router.put(
  "/:superId/:staffId/profile/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  staff.updateSingleStaff
);
router.get(
  "/:superId/:school/allStaffPermissions",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetPermissions,
  staff.getStaffWithPermission
);
router.get(
  "/:superId/:staffId/inchargeBySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  staff.inchargeBySection
);
router.post(
  "/:superId/updateUserForStaff",
  auth.isSignedIn,
  auth.isAuthenticated,
  user.updateUserForStaff
);
router.post("/staff/machine", staff.getStaffforMachine);
router.post("/staff/machineService", staff.getStaffforMachineNewService);
router.post("/staff/reArrange", staff.staffUpdateMachine);
module.exports = router;
