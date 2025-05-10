const express = require("express");

const dev = process.env.NODE_ENV !== "production";

const port = 7000;
// exports form other files
const { connectDB } = require("./db");
const errorController = require("./errorController");
const logger = require("./config/logger");
// all Routes from other files
const authRoutes = require("./routes/auth");
const schoolRoutes = require("./routes/schoolStaff");
const sessionRoutes = require("./routes/sessionStaff");
const levelRoutes = require("./routes/levelStaff");
const genderRoutes = require("./routes/genderStaff");
const classRoutes = require("./routes/classStaff");
const sectionRoutes = require("./routes/sectionStaff");
const staffRoutes = require("./routes/staffStaffRoutes");
const studentRoutes = require("./routes/studentStaff");
const attendanceRoutes = require("./routes/attendanceStaff");
const courseRoutes = require("./routes/courseStaff");
const registerRoutes = require("./routes/register");
const accountsRoutes = require("./routes/account/account");
const addChargesRoutes = require("./routes/addChargesStaff");
const inTermsOfRoutes = require("./routes/account/inTermsOf");
const transactionRoutes = require("./routes/account/transactionStaff");
const guardianRoutes = require("./routes/guardianStaff");
const uploadRoutes = require("./routes/pictureUpload");
const uploadStudentRoutes = require("./routes/pictureUploadStudent");
const uploadStaffRoutes = require("./routes/pictureUploadStaff");
const uploadGuardianRoutes = require("./routes/pictureUploadGuardian");
const uploadAdminRoutes = require("./routes/pictureUploadAdmin");
const uploadDiaryRoutes = require("./routes/pictureUploadForDiary");
const monthRoutes = require("./routes/monthStaff");
const eventRoutes = require("./routes/eventManagmentStaff");
const templetPermissionRoutes = require("./routes/templetPermission");
const staffSchedule = require("./staffSchedule");
const pdfRoutes = require("./routes/pdf");
const pdfAllStdRoutes = require("./routes/allStdpdf");
const monthReceiving = require("./routes/receiveMonth");
const userAndPermissionsRoutes = require("./routes/usersAndPermissions");
const feePdfRoutes = require("./routes/feePdf");
const singleFeePdfRoutes = require("./routes/singleFeePdf");
const examRoutes = require("./routes/exam/exam");
const dateSheetRoutes = require("./routes/exam/dateSheet");
const resultRoutes = require("./routes/exam/result");
const smsPortalRoutes = require("./routes/smsPortal");
const aggregationRoutes = require("./routes/aggregate");
const createStdRoutes = require("./routes/createStudent");
const printStdCardsRoutes = require("./routes/printStdCards");
const getStdRoutes = require("./routes/getStudent");
const updateGuardianRoutes = require("./routes/updateGuardian");
const printStaffCradsRoutes = require("./routes/printStaffCards");
const updateStaffRoutes = require("./routes/updateStaff");
const getStaffRoutes = require("./routes/getStaff");
const diaryRoutes = require("./routes/uploadDiary");
const getDiaryRoutes = require("./routes/getDiary");
const createExamTermRoutes = require("./routes/createExamTerm");
const createDateSheetRoutes = require("./routes/createNUpdateDateSheet");
const getDateSheetRoutes = require("./routes/getDateSheet");
const getResultRoutes = require("./routes/getResult");
const createResultRoutes = require("./routes/createResult");
const examDashboardRoutes = require("./routes/examDashboard");
const getAttendanceRoutes = require("./routes/getAttendence");
const getSmsPortalRoutes = require("./routes/getSmsPortal");
const getStdinfoReportRoutes = require("./routes/getStdInfoReport");
const getGuardianRepoRoutes = require("./routes/getGuardianRepo");
const staffInfoRepoRoutes = require("./routes/staffInfoRepo");
const accountInfoRepoRoutes = require("./routes/accountInfoRepo");
const singleStdChargesRoutes = require("./routes/singleStdCharges");
const classNSectionChargesRoutes = require("./routes/classNSectionCharges");
const schoolChargesRoutes = require("./routes/schoolCharges");
const genrateSchoolFeeRoutes = require("./routes/genrateSchoolFee");
const createGuardianFeeRoutes = require("./routes/createSingleGuardianFee");
const createStdFeeRoutes = require("./routes/createSingleStdFee");
const schoolFeeVoucherRoutes = require("./routes/getSchoolFeeVoucher");
const singleStdFeeVoucherRoutes = require("./routes/getSingleStdFeeVoucher");
const singleGuardianFeeVoucherRoutes = require("./routes/getSingleGuardianFeeVoucher");
const receiveFeeByGuardianRoutes = require("./routes/recieveFeeByGuardian");
const receiveFeeByStdRoutes = require("./routes/receiveFeeByStd");
const getExpenseRoutes = require("./routes/getExpense");
const createTransactionRoutes = require("./routes/createTransaction");
const createNUpdateLevelRoutes = require("./routes/createNUpdateLevel");
const createNUpdateGenderRoutes = require("./routes/createNUpdateGender");
const createNUpdateClassRoutes = require("./routes/createNUpdateClass");
const createNUpdateSectionRoutes = require("./routes/createNUpdateSection");
const addBulkStudentsRoutes = require("./routes/addBulkStudent");
const activeInActiveStudentsRoutes = require("./routes/activeInactiveStudent");
const activeInActiveStaffsRoutes = require("./routes/activeInactiveStaff");
const updateSchoolRoutes = require("./routes/updateSchool");
const seeDashboardRoutes = require("./routes/seeDashBoard");
const salaryRoutes = require("./routes/account/salary");
const addBonusRoutes = require("./routes/addBonus");
const salaryMonthRoutes = require("./routes/salaryMonth");
const loanRoutes = require("./routes/loan");
const loanHistoryRoutes = require("./routes/loanHistory");
const finalCriteriaRoutes = require("./routes/exam/finalCriteria");
const studentHistoryRoutes = require("./routes/studentHistory");
const duplicateRoutes = require("./routes/duplicate");
const { takeBackup } = require("./backup");
// not in use for the current project

// midnight Schedule function
// const { job } = require("./studentSchedule");

require("dotenv").config();
// db connection

connectDB();

// importing Middel wares
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// main body
const app = express();

// middel wares
app.use(errorController);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("build"));
app.use(express.static("build/index.html"));
app.use("/school/", express.static("school"));
app.use("/staffApp", (req, res) => {
  res.send("welcom to staff dashboard");
});

// my routes
app.use("/api", authRoutes);
app.use("/api", schoolRoutes);
app.use("/staffApi", schoolRoutes);
app.use("/api", sessionRoutes);
app.use("/api", levelRoutes);
app.use("/api", genderRoutes);
app.use("/api", classRoutes);
app.use("/api", sectionRoutes);
app.use("/api", staffRoutes);
// app.use("/api", feeRoutes);
app.use("/api", studentRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", courseRoutes);
app.use("/api", registerRoutes);
app.use("/api", accountsRoutes);
app.use("/api", addChargesRoutes);
app.use("/api", inTermsOfRoutes);
app.use("/api", transactionRoutes);
app.use("/api", guardianRoutes);
app.use("/api", uploadRoutes);
app.use("/api", uploadStudentRoutes);
app.use("/api", uploadStaffRoutes);
app.use("/api", uploadGuardianRoutes);
app.use("/api", uploadAdminRoutes);
app.use("/api", monthRoutes);
app.use("/api", eventRoutes);
app.use("/api", templetPermissionRoutes);
app.use("/api", pdfRoutes);
app.use("/api", pdfAllStdRoutes);
app.use("/api", monthReceiving);
app.use("/api", userAndPermissionsRoutes);
app.use("/api", feePdfRoutes);
app.use("/api", singleFeePdfRoutes);
app.use("/api", examRoutes);
app.use("/api", dateSheetRoutes);
app.use("/api", resultRoutes);
app.use("/api", smsPortalRoutes);
app.use("/api", aggregationRoutes);
app.use("/api", createStdRoutes);
app.use("/api", printStdCardsRoutes);
app.use("/api", getStdRoutes);
app.use("/api", updateGuardianRoutes);
app.use("/api", printStaffCradsRoutes);
app.use("/api", updateStaffRoutes);
app.use("/api", getStaffRoutes);
app.use("/api", diaryRoutes);
app.use("/api", getDiaryRoutes);
app.use("/api", createExamTermRoutes);
app.use("/api", createDateSheetRoutes);
app.use("/api", getDateSheetRoutes);
app.use("/api", getResultRoutes);
app.use("/api", createResultRoutes);
app.use("/api", examDashboardRoutes);
app.use("/api", getAttendanceRoutes);
app.use("/api", getSmsPortalRoutes);
app.use("/api", getStdinfoReportRoutes);
app.use("/api", getGuardianRepoRoutes);
app.use("/api", staffInfoRepoRoutes);
app.use("/api", accountInfoRepoRoutes);
app.use("/api", singleStdChargesRoutes);
app.use("/api", classNSectionChargesRoutes);
app.use("/api", schoolChargesRoutes);
app.use("/api", genrateSchoolFeeRoutes);
app.use("/api", createGuardianFeeRoutes);
app.use("/api", createStdFeeRoutes);
app.use("/api", schoolFeeVoucherRoutes);
app.use("/api", singleStdFeeVoucherRoutes);
app.use("/api", singleGuardianFeeVoucherRoutes);
app.use("/api", receiveFeeByGuardianRoutes);
app.use("/api", receiveFeeByStdRoutes);
app.use("/api", getExpenseRoutes);
app.use("/api", createTransactionRoutes);
app.use("/api", createNUpdateLevelRoutes);
app.use("/api", createNUpdateGenderRoutes);
app.use("/api", createNUpdateClassRoutes);
app.use("/api", createNUpdateSectionRoutes);
app.use("/api", addBulkStudentsRoutes);
app.use("/api", activeInActiveStudentsRoutes);
app.use("/api", activeInActiveStaffsRoutes);
app.use("/api", updateSchoolRoutes);
app.use("/api", seeDashboardRoutes);
app.use("/api", salaryRoutes);
app.use("/api", addBonusRoutes);
app.use("/api", salaryMonthRoutes);
app.use("/api", loanRoutes);
app.use("/api", loanHistoryRoutes);
app.use("/api", finalCriteriaRoutes);
app.use("/api", studentHistoryRoutes);
app.use("/api", duplicateRoutes);
app.use("/api", uploadDiaryRoutes);

// job;
// staffSchedule;

app.post("/getData", (req, res) => {
  logger.info(req.body);
  res.json({
    log: "some log",
    message: "A response message",
  });
});
app.get("/", (req, res) => {
  res.send("welcom to dashboard");
});
app.get("/takeBackup", takeBackup);
// app starts from
app.listen(process.env.PORT || port, (err) => {
  if (err) throw err;
  logger.info(`> Ready on localhost:${port}`);
});
