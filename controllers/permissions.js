const Permissions = require("../modals/permissions");
const TempletPermission = require("../modals/templetPermission");
const Admin = require("../modals/admin");
const Staff = require("../modals/staff");
const Guardian = require("../modals/guardian");
const Student = require("../modals/student");
const User = require("../modals/user");
exports.permissions = {
  createStep: async (req, res, next) => {
    try {
      const defaultPermission = await TempletPermission.findOne({
        templetFor: "admin",
      });
      delete defaultPermission._doc._id;
      delete defaultPermission.templetFor;
      const permission = new Permissions({
        ...defaultPermission._doc,
        permissionsOf: req.admin,
      });
      permission.save(async (err, permission) => {
        if (err) {
          if (req.admin !== null) {
            await Admin.findByIdAndDelete(req.admin);
          }
          res.status(400).json(err);
          return;
        } else {
          req.permission = permission._id;
          next();
        }
      });
    } catch (err) {
      if (req.admin !== null) {
        await Admin.findByIdAndDelete(req.admin);
      }
      res.status(500).json(err);
      return;
    }
  },
  createStepForSuperAdmin: async (req, res, next) => {
    try {
      const defaultPermission = await TempletPermission.findOne({
        templetFor: "superAdmin",
      });
      delete defaultPermission._doc._id;
      delete defaultPermission.templetFor;
      const permission = new Permissions({
        ...defaultPermission._doc,
        permissionsOf: req.admin,
      });
      permission.save(async (err, permission) => {
        if (err) {
          if (req.admin !== null) {
            await Admin.findByIdAndDelete(req.admin);
          }
          res.status(400).json(err);
          return;
        } else {
          req.permission = permission._id;
          next();
        }
      });
    } catch (err) {
      if (req.admin !== null) {
        await Admin.findByIdAndDelete(req.admin);
      }
      res.status(500).json(err);
      return;
    }
  },
  createStepForStaff: async (req, res, next) => {
    try {
      const defaultPermission = await TempletPermission.findOne({
        templetFor: req.body.jobTitle,
      });
      delete defaultPermission._doc._id;
      delete defaultPermission.templetFor;
      const permission = new Permissions({
        ...defaultPermission._doc,
        permissionsOf: req.staff,
      });
      permission.save(async (err, permission) => {
        if (err) {
          if (req.staff !== null) {
            await Staff.findByIdAndDelete(req.staff);
          }
          res.status(400).json(err);
          return;
        } else {
          req.permission = permission._id;
          next();
        }
      });
    } catch (err) {
      if (req.staff !== null) {
        await Staff.findByIdAndDelete(req.staff);
      }
      res.status(500).json(err);
      return;
    }
  },
  createStepForGuardian: async (req, res, next) => {
    try {
      if (req.exsist) next();
      else {
        const defaultPermission = await TempletPermission.findOne({
          templetFor: "guardian",
        });
        delete defaultPermission._doc._id;
        delete defaultPermission.templetFor;
        const permission = new Permissions({
          ...defaultPermission._doc,
          permissionsOf: req.guardian,
        });
        permission.save(async (err, permission) => {
          if (err) {
            if (req.guardian !== null) {
              await Guardian.findByIdAndDelete(req.guardian);
            }
            res.status(400).json(err);
            return;
          } else {
            req.permission = permission._id;
            next();
          }
        });
      }
    } catch (err) {
      if (req.guardian !== null) {
        await Guardian.findByIdAndDelete(req.guardian);
      }
      res.status(500).json(err);
      return;
    }
  },
  createStepForStudent: async (req, res, next) => {
    try {
      const defaultPermission = await TempletPermission.findOne({
        templetFor: "student",
      });
      delete defaultPermission._doc._id;
      delete defaultPermission.templetFor;
      const permission = new Permissions({
        ...defaultPermission._doc,
        permissionsOf: req.student,
      });
      permission.save(async (err, permission) => {
        if (err) {
          if (req.student !== null) {
            await Student.findByIdAndDelete(req.student);
          }
          if (req.permission !== null) {
            await Permissions.findByIdAndDelete(req.permission);
          }
          if (req.userForGaurdian !== null) {
            if (
              (req &&
                req.guardian &&
                req.guardian.childs &&
                req.guardian.childs.length === 0) ||
              !req.guardian.childs
            ) {
              await User.findByIdAndDelete(req.userForGaurdian);
            }
          }
          if (req.guardian !== null) {
            if (
              (req &&
                req.guardian &&
                req.guardian.childs &&
                req.guardian.childs.length === 0) ||
              !req.guardian.childs
            ) {
              await Guardian.findByIdAndDelete(req.guardian);
            }
          }
          res.status(400).json(err);
          return;
        } else {
          req.permissionOfStudent = permission._id;
          next();
        }
      });
    } catch (err) {
      if (req.student !== null) {
        await Student.findByIdAndDelete(req.student);
      }
      if (req.permission !== null) {
        await Permissions.findByIdAndDelete(req.permission);
      }
      if (req.userForGaurdian !== null) {
        await User.findByIdAndDelete(req.userForGaurdian);
      }
      if (req.guardian !== null) {
        await Guardian.findByIdAndDelete(req.guardian);
      }
      res.status(500).json(err);
      return;
    }
  },
  getPermissionsById: (req, res, next, id) => {
    try {
      Permissions.findOne({ permissionsOf: id }).exec((err, permission) => {
        if (err || !permission) {
          res.status(400).json(err);
        } else {
          req.permissions = permission;
          next();
        }
      });
    } catch (err) {
      res.status(err).json(err);
      return;
    }
  },
  canSeeDashboard: (req, res, next) => {
    if (req && req.permissions && req.permissions.canSeeDashboard) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to See Dashboard",
      });
    }
  },
  canCreateCharges: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateCharges) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to AddCharges" });
    }
  },
  canGetCharges: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetCharges) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Charges" });
    }
  },

  canAddChargesToSchool: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddChargesToSchool) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Add Charges to School" });
    }
  },

  canAddChargesToStudents: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddChargesToStudents) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Charges to Single Student",
      });
    }
  },
  canAddChargesToClassOrSection: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canAddChargesToClassOrSection
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Charges to Class OR Section",
      });
    }
  },
  // class permissions
  canCreateClass: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateClass) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Create Class" });
    }
  },
  canGetAllClasses: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetAllClasses) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get All Classes" });
    }
  },
  canGetClassById: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetClassById) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get this Class" });
    }
  },
  canGetClassSectionBySchool: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetClassSectionBySchool) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get this Class & Section",
      });
    }
  },
  canUpdateClass: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateClass) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Update This Class" });
    }
  },
  canGetClassByGender: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetClassByGender) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get All Classes" });
    }
  },
  // coursers
  canCreateCourses: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateCourses) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Create Course" });
    }
  },
  // Events
  canCreateEvent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateEvent) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Creat Event" });
    }
  },
  canUpdateEvent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateEvent) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission Update Event" });
    }
  },
  canGetEvents: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetEvents) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to Get Event" });
    }
  },
  canGetSchoolEvents: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolEvents) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get School Event" });
    }
  },
  canGetEventDates: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetEventDates) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Event Dates" });
    }
  },
  canGetSingleEvent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleEvent) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to Get Event" });
    }
  },
  canCreateFee: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateFee) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to Create Fee" });
    }
  },
  canGetSingleFeeVoucher: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleFeeVoucher) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Sigle Fee Voucher" });
    }
  },
  canCreateGender: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateGender) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Create Gender" });
    }
  },
  canGetGender: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetGender) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to Get Gender" });
    }
  },
  canGetSingleGender: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleGender) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Single Gender",
      });
    }
  },
  canUpdateGender: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateGender) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Update Gender" });
    }
  },
  canGetGenderByLevels: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetGenderByLevels) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get All Genders" });
    }
  },
  canGetGuardians: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetGuardians) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Guardians" });
    }
  },
  canGetSingleGuardian: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleGuardian) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Single Guardian" });
    }
  },
  canGetSingleStudent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleStudent) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Single student" });
    }
  },
  canUpdateGuardian: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateGuardian) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Update Guardian" });
    }
  },
  canCreateTransactions: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateTransactions) {
      next();
    } else {
      res.staus(400).json({
        err: "You do not have permission to Get Single Section By School",
      });
    }
  },
  canGetTransaction: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetTransaction) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Single Section By School",
      });
    }
  },
  canGenrateFee: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGenrateFee) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to genrate Fee Voucher" });
    }
  },
  canGetGuardianVoucher: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetGuardianVoucher) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get guardian Fee Voucher",
      });
    }
  },
  canReceiveFeeByGaurdian: (req, res, next) => {
    if (req && req.permissions && req.permissions.canReceiveFeeByGaurdian) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to receive guardian Fee Voucher",
      });
    }
  },
  canGetStudentVouchers: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStudentVouchers) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Student Fee Voucher",
      });
    }
  },
  canGetSingleStudentFeeVoucher: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canGetSingleStudentFeeVoucher
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get single Student Fee Voucher",
      });
    }
  },
  canGetSingleGuardianFeeVoucher: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canGetSingleGuardianFeeVoucher
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get single guardian Fee Voucher",
      });
    }
  },
  canReceiveFeeByStudent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canReceiveFeeByStudent) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to receive fee By student",
      });
    }
  },
  canCreateSingleStudentFeeVoucher: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canCreateSingleStudentFeeVoucher
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to create single student Fee Voucher",
      });
    }
  },
  canGetSchoolFeeVoucher: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolFeeVoucher) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get School Fee Voucher",
      });
    }
  },
  canCreateSingleGuardianFeeVoucher: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canCreateSingleGuardianFeeVoucher
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to create single guardain Fee Voucher",
      });
    }
  },
  canUpdateFee: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateFee) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to update Fee Voucher",
      });
    }
  },
  canGetGuardianFeeVoucherByRegNo: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canGetGuardianFeeVoucherByRegNo
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get guardain Fee Voucher by Reg No",
      });
    }
  },
  canGetStudentFeeVoucherByRegNo: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canGetStudentFeeVoucherByRegNo
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get student Fee Voucher by Reg No",
      });
    }
  },
  canCreateInTermsOf: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateInTermsOf) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Create InTermOf" });
    }
  },
  canGetInTermsOf: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetInTermsOf) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get InTermOf" });
    }
  },
  canGetIncome: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetIncome) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to Get income" });
    }
  },
  canGetExpense: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetExpense) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get expense" });
    }
  },
  canGetStudentCharges: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStudentCharges) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get student charges" });
    }
  },
  canGetReceiveMonth: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetReceiveMonth) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get receive month" });
    }
  },
  canCreateLevel: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateLevel) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Create Level" });
    }
  },
  canGetLevels: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetLevels) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to Get Levels" });
    }
  },
  canGetSingleLevel: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleLevel) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Single Level" });
    }
  },
  canUpdateLevel: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateLevel) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Update Single Level" });
    }
  },
  canGetLevelsBySession: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetLevelsBySession) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get all Levels" });
    }
  },
  canGetAttendance: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetAttendance) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Attendance" });
    }
  },
  canUpdateAttendance: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateAttendance) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Update Attendance",
      });
    }
  },
  canGetSmsPortal: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSmsPortal) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get SMS portal",
      });
    }
  },
  canGetStudentInfoReport: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStudentInfoReport) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Student report",
      });
    }
  },
  canGetAccountInfoReport: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetAccountInfoReport) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Account report",
      });
    }
  },
  canGetGuardianInfoReport: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetGuardianInfoReport) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Guardian report",
      });
    }
  },
  canGetStaffInfoReport: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStaffInfoReport) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Staff report",
      });
    }
  },
  canAddSectionIncharge: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddSectionIncharge) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Section Incharge",
      });
    }
  },
  canAddBulkStudent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddBulkStudent) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Bulk Students",
      });
    }
  },
  canAddBulkStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddBulkStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Bulk Staff",
      });
    }
  },
  canCreateMonths: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateMonths) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Create Months" });
    }
  },
  canGetMonths: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetMonths) {
      next();
    } else {
      res.status(400).json({ err: "You do not have permission to Get Months" });
    }
  },
  canCreateCampus: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateCampus) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Create Campus" });
    }
  },
  canGetAllSchools: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetAllSchools) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get All Campus" });
    }
  },
  canGetSchoolSessions: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolSessions) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Session  By School" });
    }
  },
  canGetSchoolLevel: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolLevel) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Level By School" });
    }
  },
  canGetSchoolGender: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolGender) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Gender By School" });
    }
  },
  canGetSchoolClass: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolClass) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Class By School" });
    }
  },
  canGetSchoolSections: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolSections) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Sections by School" });
    }
  },
  canGetSchoolStudents: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolStudents) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get School Students" });
    }
  },
  canUpdateStudent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateStudent) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Charges" });
    }
  },
  canGetSchoolById: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSchoolById) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Single Campus" });
    }
  },
  canUpdateSchool: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateSchool) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Update Campus" });
    }
  },
  canGetSingleSchoolStudents: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleSchoolStudents) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Campus Students " });
    }
  },
  canGetGuardiansBySchool: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetGuardiansBySchool) {
      next();
    } else {
      res
        .status(400)
        .json({ err: "You do not have permission to Get Campus Guardian" });
    }
  },
  canGetSingleSectionBySchool: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleSectionBySchool) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Single Section",
      });
    }
  },
  canCreateSection: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateSection) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Create Section",
      });
    }
  },
  canGetSection: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSection) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Section",
      });
    }
  },
  canGetSingleSectionById: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleSectionById) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Single Section By id",
      });
    }
  },
  canGetRollNo: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetRollNo) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Roll No",
      });
    }
  },
  canUpdateSection: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateSection) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Update Section",
      });
    }
  },
  canGetStudentsBySection: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStudentsBySection) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get This Sections Students",
      });
    }
  },
  canGetSectionByClass: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSectionByClass) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Section",
      });
    }
  },
  canCreateSession: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateSession) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Create Session",
      });
    }
  },
  canGetSession: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSession) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Session",
      });
    }
  },
  canGetSingleSession: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleSession) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Single Session",
      });
    }
  },
  canUpdateSession: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateSession) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Update Session",
      });
    }
  },
  canGetSessionBySchool: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSessionBySchool) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Campus Session",
      });
    }
  },
  canCreateStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Create Staff",
      });
    }
  },
  canGetSingleStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Single Staff",
      });
    }
  },
  canGetStaffSingleMember: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStaffSingleMember) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Single Staff Member",
      });
    }
  },
  canUpdateStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Update Staff",
      });
    }
  },
  canGetStaffRegNum: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStaffRegNum) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Staff By Registration No.",
      });
    }
  },
  canGetStaffBySection: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStaffBySection) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Staff For this Section",
      });
    }
  },
  canGetSectionIncharges: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSectionIncharges) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Section Incharge",
      });
    }
  },
  canGetAllStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetAllStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get All Staff",
      });
    }
  },
  canCreateStudent: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateStudent) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Create Student",
      });
    }
  },
  canGetAllStudents: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetAllStudents) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get All Student",
      });
    }
  },
  canGetStudentBySchool: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStudentBySchool) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Students Of this Campus",
      });
    }
  },
  canGetStudentByClass: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStudentByClass) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Students Of this Class",
      });
    }
  },
  canGetStudentBySection: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetStudentBySection) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Student Of this Section",
      });
    }
  },

  canGetSingleStudentContact: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleStudentContact) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Contact of this Student",
      });
    }
  },
  canGetSingleClassContact: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleClassContact) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get this Class Contact",
      });
    }
  },

  canGetSingleSectionContact: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleSectionContact) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get this Sections Contact",
      });
    }
  },
  canGetSingleSchoolContact: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSingleSchoolContact) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get This Campus Contact",
      });
    }
  },
  canGetPermissions: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetPermissions) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get permissions",
      });
    }
  },
  canUpdatePermission: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdatePermission) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to update permissions",
      });
    }
  },
  canPrintStudentCards: (req, res, next) => {
    if (req && req.permissions && req.permissions.canPrintStudentCards) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Print Student Cards",
      });
    }
  },
  canPrintStaffCards: (req, res, next) => {
    if (req && req.permissions && req.permissions.canPrintStaffCards) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Print Staff Cards",
      });
    }
  },
  canCreateExamTerm: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateExamTerm) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Create Exam Term",
      });
    }
  },
  canGetExamTerm: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetExamTerm) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Exam Term",
      });
    }
  },
  canGetDateSheet: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetDateSheet) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get DateSheet",
      });
    }
  },
  canCreateDateSheet: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateDateSheet) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Create DateSheet",
      });
    }
  },
  canUpdateDateSheet: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateDateSheet) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Update DateSheet",
      });
    }
  },
  canGetResult: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetResult) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Result",
      });
    }
  },
  canCreateResult: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateResult) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Create Result",
      });
    }
  },
  canUpdateResult: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUpdateResult) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Update Result",
      });
    }
  },
  canSeeExamDashboard: (req, res, next) => {
    if (req && req.permissions && req.permissions.canSeeExamDashboard) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to See Exam Dashboard",
      });
    }
  },
  canDoActiveInactiveToStudent: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canDoActiveInactiveToStudent
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Active or InActive to Student",
      });
    }
  },
  canDoActiveInactiveToStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canDoActiveInactiveToStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Active or InActive to Staff",
      });
    }
  },
  canUploadDiary: (req, res, next) => {
    if (req && req.permissions && req.permissions.canUploadDiary) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Upload Diary",
      });
    }
  },
  canGetDiary: (req, res, next) => {
    if (
      (req && req.permissions && req.permissions.canGetDiary) ||
      (req &&
        req.profile &&
        req.profile.informativeModel &&
        req.profile.informativeModel.role > 1)
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Diary",
      });
    }
  },
  canGetTodayDiary: (req, res, next) => {
    if (
      (req && req.permissions && req.permissions.canGetTodayDiary) ||
      (req &&
        req.profile &&
        req.profile.informativeModel &&
        req.profile.informativeModel.role > 1)
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Diary",
      });
    }
  },
  // Salary Permissions
  canCreateSalaryOfAllStaffs: (req, res, next) => {
    if (req && req.permissions && req.permissions.canCreateSalaryOfAllStaffs) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to create Salary Of All Staffs",
      });
    }
  },
  canGetSalaryOfAllStaffs: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSalaryOfAllStaffs) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Salary Of All Staffs",
      });
    }
  },
  canCreateSalaryOfSingleStaff: (req, res, next) => {
    if (
      req &&
      req.permissions &&
      req.permissions.canCreateSalaryOfSingleStaff
    ) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to create Salary Of Single Staff",
      });
    }
  },
  canGetSalaryOfSingleStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSalaryOfSingleStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Salary Of Single Staff",
      });
    }
  },
  canReceiveSalaryOfStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canReceiveSalaryOfStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to recieve Salary Of Staff",
      });
    }
  },
  canGetPaidSalaryRepo: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetPaidSalaryRepo) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Paid Salary Repo",
      });
    }
  },
  canGetSalaryByDate: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetSalaryByDate) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get Paid Salary By Date",
      });
    }
  },
  canGetUnpaidSalaryRepo: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetUnpaidSalaryRepo) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Get unPaid Salary Repo",
      });
    }
  },
  // Add Bonus permissions
  canAddBonusToAllStaffs: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddBonusToAllStaffs) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Bonus To All Staffs",
      });
    }
  },
  canAddBonusToSingleStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddBonusToSingleStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Bonus To  Single Staff",
      });
    }
  },
  canGetBonus: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetBonus) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Bonus",
      });
    }
  },
  canAddLoanToSingleStaff: (req, res, next) => {
    if (req && req.permissions && req.permissions.canAddLoanToSingleStaff) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to Add Loan To  Single Staff",
      });
    }
  },
  canGetLoan: (req, res, next) => {
    if (req && req.permissions && req.permissions.canGetLoan) {
      next();
    } else {
      res.status(400).json({
        err: "You do not have permission to get Loan",
      });
    }
  },
  updatePermissions: (req, res) => {
    try {
      Permissions.findOneAndUpdate(
        { permissionsOf: req && req.body && req.body.id },
        { $set: req.body },
        { new: true, userFindAndModify: false },
        (err, obj) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(obj);
            return;
          }
        }
      );
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
};
