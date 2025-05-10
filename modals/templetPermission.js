const { Schema, model } = require("mongoose");

const templetPermissionSchema = new Schema({
  templetFor: {
    type: String,
    unique: true,
    enum: [
      "superAdmin",
      "admin",
      "teacher",
      "principal",
      "clerk",
      "computerOperator",
      "student",
      "guardian",
      "maid",
      "watchman",
      "canteenManager",
      "sweeper",
    ],
  },
  // all  charges permission
  canCreateCharges: {
    type: Boolean,
    default: false,
  },
  canGetCharges: {
    type: Boolean,
    default: false,
  },
  canAddChargesToSchool: {
    type: Boolean,
    default: false,
  },

  canAddChargesToStudents: {
    type: Boolean,
    default: false,
  },
  canAddChargesToClassOrSection: {
    type: Boolean,
    default: false,
  },
  // classes Permissions
  canCreateClass: {
    type: Boolean,
    default: false,
  },
  canGetAllClasses: {
    type: Boolean,
    default: false,
  },
  canGetClassById: {
    type: Boolean,
    default: false,
  },
  canGetSingleClassStudents: {
    type: Boolean,
    default: false,
  },
  canUpdateClass: {
    type: Boolean,
    default: false,
  },
  canGetClassSectionBySchool: {
    type: Boolean,
    default: false,
  },
  canGetClassByGender: {
    type: Boolean,
    default: false,
  },
  // Courses
  canCreateCourses: {
    type: Boolean,
    default: false,
  },
  // Events
  canCreateEvent: {
    type: Boolean,
    default: false,
  },
  canUpdateEvent: {
    type: Boolean,
    default: false,
  },
  canGetEvents: {
    type: Boolean,
    default: false,
  },
  canGetSchoolEvents: {
    type: Boolean,
    default: false,
  },
  canGetEventDates: {
    type: Boolean,
    default: false,
  },
  canGetSingleEvent: {
    type: Boolean,
    default: false,
  },
  canCreateFee: {
    type: Boolean,
    default: false,
  },
  canGetSingleFeeVoucher: {
    type: Boolean,
    default: false,
  },
  canGetSchoolFeeVoucher: {
    type: Boolean,
    default: false,
  },
  canCreateGender: {
    type: Boolean,
    default: false,
  },
  canGetGender: {
    type: Boolean,
    default: false,
  },
  canGetSingleGender: {
    type: Boolean,
    default: false,
  },
  canUpdateGender: {
    type: Boolean,
    default: false,
  },

  canGetGenderByLevels: {
    type: Boolean,
    default: false,
  },
  canGetGuardians: {
    type: Boolean,
    default: false,
  },
  canGetSingleGuardian: {
    type: Boolean,
    default: false,
  },
  canUpdateGuardian: {
    type: Boolean,
    default: false,
  },
  canCreateLevel: {
    type: Boolean,
    default: false,
  },
  canGetSingleLevel: {
    type: Boolean,
    default: false,
  },
  canUpdateLevel: {
    type: Boolean,
    default: false,
  },
  canGetLevelsBySession: {
    type: Boolean,
    default: false,
  },
  canCreateMonths: {
    type: Boolean,
    default: false,
  },
  canGetMonths: {
    type: Boolean,
    default: false,
  },
  canGetReceiveMonth: {
    type: Boolean,
    default: false,
  },
  canCreateCampus: {
    type: Boolean,
    default: false,
  },
  canGetAllSchools: {
    type: Boolean,
    default: false,
  },
  canGetSchoolSessions: {
    type: Boolean,
    default: false,
  },
  canGetSchoolLevel: {
    type: Boolean,
    default: false,
  },
  canGetSchoolGender: {
    type: Boolean,
    default: false,
  },
  canGetSchoolClass: {
    type: Boolean,
    default: false,
  },
  canGetSchoolSections: {
    type: Boolean,
    default: false,
  },
  canGetSchoolStudents: {
    type: Boolean,
    default: false,
  },
  canGetSchoolById: {
    type: Boolean,
    default: false,
  },
  canUpdateSchool: {
    type: Boolean,
    default: false,
  },
  canGetSingleSchoolStudents: {
    type: Boolean,
    default: false,
  },
  canGetGuardiansBySchool: {
    type: Boolean,
    default: false,
  },
  canGetSingleSectionBySchool: {
    type: Boolean,
    default: false,
  },
  canCreateSection: {
    type: Boolean,
    default: false,
  },
  canGetSections: {
    type: Boolean,
    default: false,
  },
  canGetSingleSectionById: {
    type: Boolean,
    default: false,
  },
  canGetRollNo: {
    type: Boolean,
    default: false,
  },
  canUpdateSection: {
    type: Boolean,
    default: false,
  },
  canGetStudentsBySection: {
    type: Boolean,
    default: false,
  },
  canGetSectionByClass: {
    type: Boolean,
    default: false,
  },
  canCreateSession: {
    type: Boolean,
    default: false,
  },
  canGetSession: {
    type: Boolean,
    default: false,
  },
  canGetSingleSession: {
    type: Boolean,
    default: false,
  },
  canUpdateSession: {
    type: Boolean,
    default: false,
  },
  canGetSessionBySchool: {
    type: Boolean,
    default: false,
  },
  canCreateStaff: {
    type: Boolean,
    default: false,
  },
  canGetSingleStaff: {
    type: Boolean,
    default: false,
  },
  canGetStaffSingleMember: {
    type: Boolean,
    default: false,
  },
  canUpdateStaff: {
    type: Boolean,
    default: false,
  },
  canGetStaffRegNum: {
    type: Boolean,
    default: false,
  },
  canGetStaffBySection: {
    type: Boolean,
    default: false,
  },
  canGetSectionIncharges: {
    type: Boolean,
    default: false,
  },
  canGetAllStaff: {
    type: Boolean,
    default: false,
  },
  canCreateStudent: {
    type: Boolean,
    default: false,
  },
  canGetAllStudents: {
    type: Boolean,
    default: false,
  },
  canGetSingleStudent: {
    type: Boolean,
    default: false,
  },
  canGetStudentBySchool: {
    type: Boolean,
    default: false,
  },
  canGetStudentByClass: {
    type: Boolean,
    default: false,
  },
  canGetStudentBySection: {
    type: Boolean,
    default: false,
  },
  canGetSingleStudentContact: {
    type: Boolean,
    default: false,
  },
  canGetSingleClassContact: {
    type: Boolean,
    default: false,
  },
  canGetSingleSectionContact: {
    type: Boolean,
    default: false,
  },
  canGetSingleSchoolContact: {
    type: Boolean,
    default: false,
  },
  canPrintCards: {
    type: Boolean,
    default: false,
  },
  canSeeDashboard: {
    type: Boolean,
    default: false,
  },
  canPrintStudentCards: {
    type: Boolean,
    default: false,
  },
  canPrintStaffCards: {
    type: Boolean,
    default: false,
  },
  canGetStudentById: {
    type: Boolean,
    default: false,
  },
  canGetStudentsByClassId: {
    type: Boolean,
    default: false,
  },
  canUpdateStudent: {
    type: Boolean,
    default: false,
  },
  canGenrateFee: {
    type: Boolean,
    default: false,
  },
  canUpdateFee: {
    type: Boolean,
    default: false,
  },
  canGetGuardianFeeVoucherByRegNo: {
    type: Boolean,
    default: false,
  },
  canGetStudentFeeVoucherByRegNo: {
    type: Boolean,
    default: false,
  },
  canGetGuardianVoucher: {
    type: Boolean,
    default: false,
  },
  canReceiveFeeByGaurdian: {
    type: Boolean,
    default: false,
  },
  canGetStudentVouchers: {
    type: Boolean,
    default: false,
  },
  canGetSingleStudentFeeVoucher: {
    type: Boolean,
    default: false,
  },
  canGetSingleGuardianFeeVoucher: {
    type: Boolean,
    default: false,
  },
  canReceiveFeeByStudent: {
    type: Boolean,
    default: false,
  },
  canCreateSingleStudentFeeVoucher: {
    type: Boolean,
    default: false,
  },
  canCreateSingleGuardianFeeVoucher: {
    type: Boolean,
    default: false,
  },
  canUpdateCourses: {
    type: Boolean,
    default: false,
  },
  canCreateTransactions: {
    type: Boolean,
    default: false,
  },
  canGetTransaction: {
    type: Boolean,
    default: false,
  },
  canCreateInTermsOf: {
    type: Boolean,
    default: false,
  },
  canGetInTermsOf: {
    type: Boolean,
    default: false,
  },
  canGetIncome: {
    type: Boolean,
    default: false,
  },
  canGetExpense: {
    type: Boolean,
    default: false,
  },
  canGetStudentCharges: {
    type: Boolean,
    default: false,
  },
  canUpdateAttendance: {
    type: Boolean,
    default: false,
  },
  canGetAttendance: {
    type: Boolean,
    default: false,
  },
  canGetSmsPortal: {
    type: Boolean,
    default: false,
  },
  canGetStudentInfoReport: {
    type: Boolean,
    default: false,
  },
  canGetGuardianInfoReport: {
    type: Boolean,
    default: false,
  },
  canGetStaffInfoReport: {
    type: Boolean,
    default: false,
  },
  canGetAccountInfoReport: {
    type: Boolean,
    default: false,
  },
  canAddSectionIncharge: {
    type: Boolean,
    default: false,
  },
  canAddBulkStudent: {
    type: Boolean,
    default: false,
  },
  canAddBulkStaff: {
    type: Boolean,
    default: false,
  },
  canGetPermissions: {
    type: Boolean,
    default: false,
  },
  canUpdatePermissions: {
    type: Boolean,
    default: false,
  },
  canGetSection: {
    type: Boolean,
    default: false,
  },
  canCreateExamTerm: {
    type: Boolean,
    default: false,
  },
  canGetExamTerm: {
    type: Boolean,
    default: false,
  },
  canGetDateSheet: {
    type: Boolean,
    default: false,
  },
  canCreateDateSheet: {
    type: Boolean,
    default: false,
  },
  canUpdateDateSheet: {
    type: Boolean,
    default: false,
  },
  canGetResult: {
    type: Boolean,
    default: false,
  },
  canCreateResult: {
    type: Boolean,
    default: false,
  },
  canUpdateResult: {
    type: Boolean,
    default: false,
  },
  canUploadDiary: {
    type: Boolean,
    default: false,
  },
  canGetDiary: {
    type: Boolean,
    default: false,
  },
  canGetTodayDiary: {
    type: Boolean,
    default: false,
  },
  canSeeExamDashboard: {
    type: Boolean,
    default: false,
  },
  canDoActiveInactiveToStudent: {
    type: Boolean,
    default: false,
  },
  canDoActiveInactiveToStaff: {
    type: Boolean,
    default: false,
  },
  canCreateSalaryOfAllStaffs: {
    type: Boolean,
    default: false,
  },
  canGetSalaryOfAllStaffs: {
    type: Boolean,
    default: false,
  },
  canGetSalaryOfSingleStaff: {
    type: Boolean,
    default: false,
  },
  canAddBonusToAllStaffs: {
    type: Boolean,
    default: false,
  },
  canAddBonusToSingleStaff: {
    type: Boolean,
    default: false,
  },
  canGetBonus: {
    type: Boolean,
    default: false,
  },
  canAddLoanToSingleStaff: {
    type: Boolean,
    default: false,
  },
  canGetLoan: {
    type: Boolean,
    default: false,
  },
  canReceiveSalaryOfStaff: {
    type: Boolean,
    default: false,
  },
  canGetPaidSalaryRepo: {
    type: Boolean,
    default: false,
  },
  canGetUnpaidSalaryRepo: {
    type: Boolean,
    default: false,
  },
  canGetSalaryByDate: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("TempletPermission", templetPermissionSchema);
