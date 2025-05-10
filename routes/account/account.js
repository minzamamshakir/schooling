const router = require("express").Router();
const { fee } = require("../../controllers/accounts/fee");
const { account } = require("../../controllers/accounts/account");
const { auth } = require("../../controllers/auth");
const { admin } = require("../../controllers/admin");
const { student } = require("../../controllers/student");
router.param("superId", admin.getUserById);
const { permissions } = require("../../controllers/permissions");
const { check } = require("express-validator");
const validationError = require("../../controllers/validationError");

router.post(
  "/:superId/fee/genrateFee",
  [check("month", "Months are required").exists()],
  [check("dueDate", "Date is required").exists()],
  [check("afterDueDate", "After Due Date is required").exists()],
  [check("note", "Note is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateFee,
  fee.guardianFeeCreate
);
router.post(
  "/:superId/fee/guardians",
  [check("month", "Months are required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canReceiveFeeByGaurdian,
  fee.getGuardianWiseFee
);
router.post(
  "/:superId/fee/guardian/receiving",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetGuardianVoucher,
  fee.getGuardianWiseFeeVocher
);
router.post(
  "/:superId/fee/students",
  [check("month", "Months are required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentVouchers,
  fee.getStudentFeeVoucher
);
router.post(
  "/:superId/fee/singleVoucher",
  [check("month", "Months are required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetStudentFeeVoucherByRegNo,
  student.getstudentByRegNoMW,
  fee.getStudentFeeVoucherByRegNo
);
router.post(
  "/:superId/fee/student/voucher",
  [check("regNum", "Admission No. is required").exists()],
  [check("school", "School is required").exists()],
  [check("session", "Session is Requierd").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canReceiveFeeByStudent,
  fee.getStudentFee
);
router.post(
  "/:superId/fee/singleStudent",
  [check("regNum", "Admission No. is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canReceiveFeeByStudent,
  fee.getSingleStudentFee
);
router.post(
  "/:superId/fee/guardian/voucher",
  [check("regNum", "Family No. is required").exists()],
  [check("session", "Session is Requierd").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetGuardianFeeVoucherByRegNo,
  fee.getGuardianFeeVoucherByRegNo
);
router.post(
  "/:superId/fee/student/payVoucher",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdateFee,
  fee.updateFee
);
router.post(
  "/:superId/fee/student/getSingleStudentVoucher",
  [check("admissionNo", "Admission No. is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleStudentFeeVoucher,
  fee.getSingleStudentFeeVoucher
);
router.post(
  "/:superId/fee/student/createSingleStudentVoucher",
  [check("admissionNo", "Admission No. is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSingleStudentFeeVoucher,
  fee.creatSingleStudentFee
);
router.post(
  "/:superId/fee/guardian/getSingleGuardianVouchers",
  [check("regNum", "Reg No. is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGetSingleGuardianFeeVoucher,
  fee.getSingleGuardianWiseFee
);
router.post(
  "/:superId/fee/guardian/createSingleGuardianFee",
  [check("regNum", "Reg No. is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateSingleGuardianFeeVoucher,
  fee.singleGuardianFeeCreate
);
router.post(
  "/:superId/fee/studentfee",
  [check("month", "Month is required").exists()],
  [check("school", "School is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canGenrateFee,
  fee.createNewMonthFee
);
router.post(
  "/:superId/studentMonths",
  student.getstudentByRegNoMW,
  fee.getStudentMonthByFee
);
router.post(
  "/:superId/UnpaidFeeBySchool/student",
  [check("schoolId", "School is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsUnPaidFeeBySchool
);
router.post(
  "/:superId/paidFeeBySchool/student",
  [check("schoolId", "School is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsPaidFeeBySchool
);
router.post(
  "/:superId/paidFeeByClass/student",
  [check("classId", "Class is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsPaidFeeByClass
);
router.post(
  "/:superId/paidFeeBySection/student",
  [check("section", "Section is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsPaidFeeBySection
);
router.post(
  "/:superId/unpaidFeeBySection/student",
  [check("section", "Section is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsUnpaidFeeBySection
);
router.post(
  "/:superId/unpaidFeeByClass/student",
  [check("classId", "Class is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsUnpaidFeeByClass
);
router.post(
  "/:superId/paidFeeByDate",
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsPaidFeeByDate
);
router.post(
  "/:superId/studentsFeeBySchool",
  [check("schoolId", "School is required!").exists()],
  // [check("session", "Session is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsFeeBySchool
);
router.post(
  "/:superId/studentsPaidFeeAmount",
  [check("schoolId", "School is required!").exists()],
  // [check("session", "Session is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsPaidFeeAmount
);
router.post(
  "/:superId/studentsUnpaidFeeAmount",
  [check("schoolId", "School is required!").exists()],
  // [check("session", "Session is required!").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsUnpaidFeeAmount
);

router.post("/reverseStudentFee", fee.reverseStudentFee);
router.post(
  "/:superId/deleteVoucher",
  auth.isSignedIn,
  auth.isAuthenticated,
  auth.isAdmin,
  fee.getFeeVoucherForDelete,
  fee.deleteFeeVoucher
);
router.post(
  "/:superId/classFees",
  [check("month", "Month is required").exists()],
  [check("school", "School is required").exists()],
  [check("session", "Session is Requierd").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.newClassFee
);
router.get(
  "/:superId/:studentId/studentsFeeByGuardian",
  [check("studentId", "student ID is required").exists()],
  validationError,
  auth.isSignedIn,
  auth.isAuthenticated,
  fee.getStudentsFeeByGuardian
);
module.exports = router;
