const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { student } = require("../controllers/student");
const { guardian } = require("../controllers/guardian");
const { check } = require("express-validator");
const { attendance } = require("../controllers/attendance");
const { permissions } = require("../controllers/permissions");
const { user } = require("../controllers/user");

router.param("staffId", admin.getUserById);
router.param("studentId", student.getStudentById);
router.param("guardianId", guardian.getGuardianById);

router.post(
  "/:staffId/student/create",
  [
    check("session", "Session is required"),
    check("level", "Level is required"),
    check("gender", "Gender is required"),
    check("class", "Class is required"),
    check("section", "Section is required"),
    check("stdName", "stdName is required"),
    check("religion", "Religion is required"),
    check("homeAddress", "Home Address is required"),
    check("admissionNo", "Adminssion Number is required"),
    check("dob", "Date of birth is required"),
    check("Roll No", "Roll No is required"),
  ],
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateStudent,
  guardian.search,
  guardian.create,
  permissions.createStepForGuardian,
  user.createStepForGuardian,
  student.create,
  permissions.createStepForStudent,
  attendance.sessionAttendence,
  user.createStepForStudent
);
router.get("/students", student.all);
router.get(
  "/:studentId/singleStudent",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudent,
  student.getSingleStudent
);
router.get(
  "/:staffId/:studentId/singleStudent",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudent,
  student.getSingleStudent
);
router.get(
  "/:staffId/:studentId/singleStudentForUser",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudent,
  student.getSingleStudentForUser
);
router.get(
  "/:staffId/:studentId/getUpdateData/singleStudent",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateStudent,
  student.getSingleStudent
);
router.put(
  "/:staffId/:studentId/updateStudent",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateStudent,
  student.updateStudent
);
router.get(
  "/:staffId/:guardianId/singleGuardian",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleGuardian,
  guardian.getSingleGuardian
);
router.put(
  "/:staffId/:guardianId/updateGuardian",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateGuardian,
  guardian.updateGuardian
);
router.post(
  "/:staffId/student/getStudentById",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAllStudents,
  student.getstudentByRegNo
);
router.post(
  "/:staffId/student/getStudentbySchool",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentBySchool,
  student.getStudentBySchool
);
router.post(
  "/:staffId/student/getStudentbyClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentByClass,
  student.getStudentByClass
);
router.post(
  "/:staffId/student/getStudentbySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentBySection,
  student.getStudentBySection
);
router.post("/student/machine", student.getStudentforMachine);
router.post("/student/machineservice", student.getStudentforMachineNewService);
router.post(
  "/:staffId/student/getSingleStudentContact",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudentContact,
  student.getStudentContact
);
router.post(
  "/:staffId/student/getSingleClassContact",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleClassContact,
  student.getClassContact
);
router.post(
  "/:staffId/student/getSingleSectionContact",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSectionContact,
  student.getSectionContact
);
router.post(
  "/:staffId/student/getSingleSchoolContact",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleSchoolContact,
  student.getCampusContact
);
router.get(
  "/:staffId/student/profile",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.singleStudentProfile
);
router.post(
  "/:staffId/students",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.allStudentsOfSchool
);
router.post(
  "/:staffId/studentsBySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.allStudentsBySection
);
router.post(
  "/:staffId/studentsByClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.allStudentsOfClass
);
router.post(
  "/:staffId/activeStudentsByClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.allActiveStudentsOfClass
);
router.post(
  "/:staffId/activeStudentsBySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.allActiveStudentsBySection
);
router.post(
  "/:staffId/inActiveStudentsByClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.allInActiveStudentsOfClass
);
router.post(
  "/:staffId/inActiveStudentsBySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.allInActiveStudentsBySection
);
router.post(
  "/:staffId/getStudentStrength",
  auth.isSignedIn,
  auth.isAuthenticated,
  student.getStudentStrength
);
router.post(
  "/:staffId/updateUserForStudent",
  auth.isSignedIn,
  auth.isAuthenticated,
  user.updateUserForStudent
);
// router.post("/updateRegNo", student.updateRegNo);
router.post("/arrangeMachine_id", student.studentUpdateMachine);

module.exports = router;
