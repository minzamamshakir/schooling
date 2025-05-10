const router = require("express").Router();
const { attendance } = require("../controllers/attendance");
const { school } = require("../controllers/school");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { permissions } = require("../controllers/permissions");
const { check } = require("express-validator");
const { student } = require("../controllers/student");
const { staff } = require("../controllers/staff");
const validationError = require("../controllers/validationError");
router.param("schoolId", school.getSchoolById);
router.param("superId", admin.getUserById);
router.param("student", student.getStudentById);
router.post("/getData/:schoolId", attendance.rollCall);

router.get(
  "/:schoolId/presentStudents",
  [check("schoolId", "School is required")],
  validationError,
  attendance.presentStudents
);
router.get(
  "/:schoolId/outStudents",
  [check("schoolId", "School is required")],
  validationError,
  attendance.outStudents
);
router.get(
  "/:schoolId/absentStudents",
  [check("schoolId", "School is required")],
  validationError,
  attendance.absentStudents
);
router.get(
  "/:schoolId/onLeaveStudents",
  [check("schoolId", "School is required")],
  validationError,
  attendance.onLeaveStudents
);
router.get(
  "/:schoolId/lateStudents",
  [check("schoolId", "School is required")],
  validationError,
  attendance.lateStudents
);
router.get(
  "/:schoolId/todayAttData",
  [check("schoolId", "School is required")],
  validationError,
  attendance.todayAttData
);
// staff attendace
router.get(
  "/:schoolId/presentStaff",
  [check("schoolId", "School is required")],
  validationError,
  attendance.presentStaff
);
router.get(
  "/:schoolId/outStaff",
  [check("schoolId", "School is required")],
  validationError,
  attendance.outStaff
);
router.get(
  "/:schoolId/absentStaff",
  [check("schoolId", "School is required")],
  validationError,
  attendance.absentStaff
);
router.get(
  "/:schoolId/onLeaveStaff",
  [check("schoolId", "School is required")],
  validationError,
  attendance.onLeaveStaff
);
router.get(
  "/:schoolId/lateStaff",
  [check("schoolId", "School is required")],
  validationError,
  attendance.lateStaff
);
router.post("/attend", attendance.getStudentAttendance);
router.post("/getStaffAttForToday", attendance.getStaffTodayAttendance);
router.get("/createStudentAttendence", attendance.createAttendenceForStudents);
router.get("/createStaffAttendence", attendance.createAttendenceForStaffs);
router.post(
  "/createStudentsAttendenceForSession",
  attendance.createAttendenceForStudentsForSession
);
router.post(
  "/createStaffsAttendenceForSession",
  attendance.createAttendenceForStaffsForSession
);
router.get(
  "/:superId/:schoolId/staff/staffAttendanceToday",
  [check("schoolId", "School is required")],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAttendance,
  attendance.allStaffTodayAttendance
);
router.get(
  "/:superId/:schoolId/student/studentAttendanceToday",
  [check("schoolId", "School is required")],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAttendance,
  attendance.allStudentTodayAttendance
);
router.post(
  "/:superId/:schoolId/student/studentClassAttendanceToday",
  [check("schoolId", "School is required")],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAttendance,
  attendance.allStudentTodayClassAttendance
);
router.post(
  "/:superId/:schoolId/student/studentSectionAttendanceToday",
  [check("schoolId", "School is required")],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAttendance,
  attendance.allStudentTodaySectionAttendance
);
router.post(
  "/:superId/student/allAttendance",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAttendance,
  attendance.getStudentAttendance
);
router.post(
  "/:superId/student/attendanceForGuardian",
  [check("student", "studentID is required")],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetAttendance,
  attendance.getStudentsAttendanceForGuardian
);
router.put(
  "/:superId/update/attendance",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateAttendance,
  attendance.updatePresentAttendance
);
router.put(
  "/:superId/update/absentAttendance",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateAttendance,
  attendance.updateAbsentAttendance
);
router.put(
  "/:superId/update/onLeaveAttendance",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateAttendance,
  attendance.updateOnLeaveAttendance
);
router.put(
  "/:superId/update/timeOut",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateAttendance,
  attendance.updateOnLeaveAttendance
);
// router.post(
//   "/getStudentData",
//   student.getStudentByCardNo,
//   attendance.getAttendanceByStudentId
// );

router.post(
  "/rollCall",
  student.getStudentByCardNo,
  staff.getStaffByCardNo,
  school.getSchoolByProfile,
  attendance.rollCallWithId
);
router.post(
  "/:student/rollCallService",
  student.getStudentByCardNo,
  staff.getStaffByCardNo,
  school.getSchoolByProfile,
  attendance.rollCallWithId
);
router.get(
  "/:superId/:studentId/studentAttendanceByGuardian",
  [check("studentId", "student ID is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  attendance.getStudentAttendanceByGuardian
);
module.exports = router;
