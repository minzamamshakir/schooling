const router = require("express").Router();
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");
const { salary } = require("../../controllers/accounts/salary");
const { session } = require("../../controllers/session");
const { salaryMonth } = require("../../controllers/salaryMonth");
const { permissions } = require("../../controllers/permissions");
const { check } = require("express-validator");
const validationError = require("../../controllers/validationError");
router.param("superId", admin.getUserById);

router.post(
  "/:superId/salary/forAllStaffs",
  [check("month", "Months are required").exists()],
  [check("school", "School Id is required is required").exists()],
  [check("session", "Session Id is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSalaryOfAllStaffs,
  salary.createSalaryOfAllStaff
);
router.post(
  "/:superId/salary/forSingleStaff",
  [check("month", "Months are required").exists()],
  [check("regNum", "Reg Num of Staff is required").exists()],
  [check("session", "Session Id is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSalaryOfSingleStaff,
  salary.createSalaryOfSingleStaff
);
router.post(
  "/:superId/salarySlip/allStaff",
  [check("month", "Months are required").exists()],
  [check("school", "School Id is required").exists()],
  [check("session", "Session Id is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSalaryOfAllStaffs,
  salary.getStaffSalarySlip,
  salary.getMonthlyAttendence
);
router.post(
  "/:superId/salarySlip/singleStaff",
  [check("month", "Months are required").exists()],
  [check("regNum", "Reg Num of Staff is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSalaryOfSingleStaff,
  salary.getSingleStaffSalarySlip,
  salary.getMonthlyAttendence
);
router.post(
  "/:superId/staffSalary",
  [check("regNum", "Reg Num of Staff is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  // permissions.canGetSalaryOfSingleStaff,
  salary.getStaffSalary
);
router.post(
  "/:superId/school/sessionsForGenrateSchoolSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSalaryOfAllStaffs,
  session.getSessionBySchool
);
router.post(
  "/:superId/monthForGenrateSchoolSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSalaryOfAllStaffs,
  salaryMonth.getSalaryMonth
);
router.post(
  "/:superId/school/sessionsForGenrateStaffSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSalaryOfSingleStaff,
  session.getSessionBySchool
);
router.post(
  "/:superId/monthForGenrateStaffSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSalaryOfSingleStaff,
  salaryMonth.getSalaryMonth
);
router.post(
  "/:superId/school/sessionsForGetSchoolSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSalaryOfAllStaffs,
  session.getSessionBySchool
);
router.post(
  "/:superId/school/sessionsForGetSingleStaffSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSalaryOfSingleStaff,
  session.getSessionBySchool
);
router.post(
  "/:superId/monthForGetSchoolSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSalaryOfAllStaffs,
  salaryMonth.getSalaryMonth
);
router.post(
  "/:superId/school/sessionsForRecieveSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canReceiveSalaryOfStaff,
  session.getSessionBySchool
);
router.post(
  "/:superId/staffSalaryForRecieveSalary",
  [check("regNum", "Reg Num of Staff is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canReceiveSalaryOfStaff,
  salary.getStaffSalary
);
router.post(
  "/:superId/updateSalaryForRecieveSalary",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canReceiveSalaryOfStaff,
  salary.updateSalary
);
router.post(
  "/:superId/unpaidSalaryRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetUnpaidSalaryRepo,
  salary.getStaffUnpaidSalary
);
router.post(
  "/:superId/paidSalaryRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetPaidSalaryRepo,
  salary.getStaffPaidSalary
);
router.post(
  "/:superId/monthForUnpaidSalaryRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetUnpaidSalaryRepo,
  salaryMonth.getSalaryMonth
);
router.post(
  "/:superId/school/sessionsForUnpaidSalaryRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetUnpaidSalaryRepo,
  session.getSessionBySchool
);
router.post(
  "/:superId/monthForPaidSalaryRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetPaidSalaryRepo,
  salaryMonth.getSalaryMonth
);
router.post(
  "/:superId/school/sessionsForPaidSalaryRepo",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetPaidSalaryRepo,
  session.getSessionBySchool
);
router.post(
  "/:superId/staffsPaidSalaryByDate",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSalaryByDate,
  salary.getStaffsPaidSalaryByDate
);

module.exports = router;
