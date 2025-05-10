const Staff = require("../modals/staff");
const School = require("../modals/school");
const { validationResult } = require("express-validator");
const Register = require("../modals/register");
const User = require("../modals/user");

exports.staff = {
  create: async (req, res, next) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) return res.status(400).json(err);
      const reg = await Register.findOne({
        name: "staffNum",
        school: req.body.school,
      });
      const staffCount = await Staff.find({
        school: req.body.school,
      }).countDocuments();
      const newReg = `${reg.prefix}-${reg.count + 1}`;
      const staff = new Staff(req.body);
      staff.regNum = newReg;
      staff.createdBy = req.profile._id;
      staff.machine_id = staffCount + 1;
      staff.username = `${newReg}@ghazalian.com`;
      staff.save((err, staff) => {
        if (err) return res.status(400).json(err);
        reg.count = reg.count + 1;
        reg.save((err, reg) => {
          if (err) return res.status(400).json(err);
        });
        req.staff = staff._id;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Staff.find({ school: req.body.school, inActive: { $ne: true } }).exec(
        (err, staff) => {
          if (err) {
            return res.status(400).json(err);
          }
          return res.json(staff);
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffBySchool: (req, res) => {
    try {
      Staff.find({ school: req.school._id, inActive: { $ne: true } }).exec(
        (err, staff) => {
          if (err) {
            return res.status(400).json(err);
          }
          return res.json(staff);
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffForActiveInActive: (req, res) => {
    try {
      Staff.find({ school: req.school._id }).exec((err, staff) => {
        if (err) {
          return res.status(400).json(err);
        }
        return res.json(staff);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffById: (req, res, next, id) => {
    try {
      Staff.findById(id).exec((err, staff) => {
        if (err || !staff) {
          return res.status(400).json({
            error: "no staff was found in Db",
          });
        }
        req.profile = staff;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffByIdToSet: (req, res, next, id) => {
    try {
      Staff.findById(id).exec((err, staff) => {
        if (err || !staff) {
          return res.status(400).json({
            error: "no staff was found in Db",
          });
        }
        req.staff = staff;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  singleStaff: (req, res) => {
    if (typeof req.staff !== typeof undefined) {
      res.json(req.staff);
    }
  },
  getSingleStaffForUser: async (req, res) => {
    const userData = await User.findOne({
      informativeModel: req.staff._id,
    });
    res.json({
      staff: req.staff,
      username: userData.email,
      password: userData.password,
      _id: req.staff._id,
    });
  },
  updateSingleStaff: async (req, res) => {
    try {
      const userData = await User.findOne({
        informativeModel: req.staff._id,
      });
      if (typeof req.staff !== typeof undefined) {
        if (
          typeof req.body.inchargeOf !== null &&
          typeof req.body.inchargeOf !== "undefined"
        ) {
          Staff.findOne({ inchargeOf: req.body.inchargeOf }).exec(
            (err, staff) => {
              if (staff)
                return res
                  .status(400)
                  .json({ err: "incharge is alread assigned" });
              else {
                Staff.findOneAndUpdate(
                  { _id: req.staff._id },
                  {
                    $set: req.body,
                    username: userData.email,
                    password: userData.password,
                  },
                  {
                    new: true,
                    userFindAndModify: false,
                  },
                  (err, staff) => {
                    if (err) return res.status(400).json(err);
                    else {
                      return res.json(staff);
                    }
                  }
                );
              }
            }
          );
        } else {
          Staff.findOneAndUpdate(
            { _id: req.staff._id },
            {
              $set: req.body,
              username: userData.email,
              password: userData.password,
            },
            {
              new: true,
              userFindAndModify: false,
            },
            (err, staff) => {
              if (err) return res.status(400).json(err);
              else {
                res.json(staff);
                return;
              }
            }
          );
        }
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateStaffForActiveInActive: (req, res) => {
    try {
      Staff.findOneAndUpdate(
        { _id: req.staff._id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, staff) => {
          if (err) return res.status(400).json(err);
          return res.json(staff);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getStaffByReg: (req, res) => {
    try {
      Staff.findOne({ regNum: req.body.regNum, inActive: { $ne: true } }).exec(
        (err, staff) => {
          if (err) return res.status(400).json(err);
          else return res.json(staff);
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffBySection: (req, res) => {
    try {
      Staff.findOne({
        inchargeOf: req.body.section,
        inActive: { $ne: true },
      }).exec((err, staff) => {
        if (err) return res.status(400).json(err);
        else {
          if ((staff && staff.inchargeOf === null) || !staff) {
            return res
              .status(400)
              .json({ err: "Section Incharge is not Assigned" });
          } else {
            return res.json(staff);
          }
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  setIncharge: (req, res) => {
    try {
      Staff.findOne({
        inchargeOf: req && req.body && req.body.section,
        inActive: { $ne: true },
      }).exec((err, incharge) => {
        if (incharge)
          return res.status(400).json({
            err: "This section is assigned to: " + incharge.firstname,
          });
        else {
          Staff.findOneAndUpdate(
            { _id: req.body.staff },
            {
              $set: { inchargeOf: req.body.section },
            },
            { new: true, userFindAndModify: false },
            (err, staff) => {
              if (err) return res.status(400).json(err);
              else return res.json(staff);
            }
          );
        }
      });
    } catch (err) {
      if (err) return res.status(500).json(err);
    }
  },
  clearIncharge: (req, res) => {
    try {
      Staff.findOne({ _id: req.body.staff, inActive: { $ne: true } }).exec(
        (err, staff) => {
          if (err || staff.inchargeOf === null) {
            return res
              .status(400)
              .json(err || { err: "Staff in Not Assigned a Section" });
          } else {
            Staff.findOneAndUpdate(
              { _id: req.body.staff },
              {
                $set: { inchargeOf: null },
              },
              { new: true, userFindAndModify: false },
              (err, staff) => {
                if (err) return res.status(400).json(err);
                else return res.json(staff);
              }
            );
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getClassIncharges: (req, res) => {
    try {
      Staff.find({
        school: req && req.school && req.school._id,
        inchargeOf: { $ne: null },
        inActive: { $ne: true },
      })
        .populate({
          path: "inchargeOf",
          populate: { path: "class", select: "name" },
        })
        .exec((err, staff) => {
          if (err) return res.status(400).json(err);
          else return res.json(staff);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  singleStaffProfile: (req, res) => {
    if (typeof req.profile !== typeof undefined) {
      User.findById({
        _id: req.profile._doc._id,
      })
        .populate("informativeModel")
        .exec((err, staff) => {
          if (err || !staff) {
            return res.status(400).json({
              error: "no such staff was found in Db",
            });
          } else {
            res.json({
              staff: staff._doc.informativeModel,
              user: staff,
              _id: staff._id,
            });
          }
        });
    }
  },
  getStaffWithPermission: (req, res) => {
    try {
      User.find({ role: 4 })
        .populate([
          {
            path: "informativeModel",
            select: "pic title firstname regNum jobTitle school inActive",
          },
          {
            path: "permissions",
          },
        ])
        .exec((err, staffs) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const arr = staffs.filter((staff) => {
              let a;
              if (staff.informativeModel.school.equals(req.params.school)) {
                if (
                  staff &&
                  staff.informativeModel &&
                  staff.informativeModel.inActive
                ) {
                  a = false;
                } else if (
                  typeof (
                    staff &&
                    staff.informativeModel &&
                    staff.informativeModel.inActive
                  ) === "undefined"
                ) {
                  a = true;
                } else {
                  if (
                    staff &&
                    staff.informativeModel &&
                    staff.informativeModel.inActive === false
                  ) {
                    a = true;
                  }
                }
                return a;
              }
            });
            res.json(arr);
            return;
          }
        });
    } catch (err) {
      res.stauts(500).json(err);
      return;
    }
  },
  getStaffStrength: (req, res) => {
    Staff.countDocuments(
      { school: req && req.body && req.body.school, inActive: { $ne: true } },
      function (err, c) {
        if (err) {
          return res.status(400).json({ err });
        } else {
          res.json(c);
        }
      }
    );
  },
  inchargeBySection: (req, res) => {
    try {
      Staff.findOne({ _id: req.params.staffId, inActive: { $ne: true } })
        .populate({
          path: "inchargeOf",
          populate: {
            path: "students",
            select: "pic stdName admissionNo rollNo",
          },
        })
        .exec((err, staff) => {
          if (err) return res.status(400).json(err);
          else
            return res.json(
              staff && staff.inchargeOf && staff.inchargeOf.students
            );
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  staffOfTeachers: (req, res) => {
    try {
      Staff.find({
        school: req.body.school,
        inActive: { $ne: true },
        jobTitle: "teacher",
      }).exec((err, staff) => {
        if (err) {
          return res.status(400).json(err);
        }
        return res.json(staff);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  staffUpdateMachine: (req, res) => {
    try {
      Staff.find({ school: req.body.school })
        .sort([["machine_id", 1]])
        .exec((err, staff) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const updatedStaff = staff.map((staff, i) => {
              staff.machine_id = i + 101;
              return staff.save();
            });
            Promise.all(updatedStaff).then((result) => res.josn(result));
            //
            // res.json(students);
            // return;
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getStaffforMachine: (req, res) => {
    try {
      Staff.find(
        { school: req.body.school },
        "firstname machine_id cardNo -_id"
      ).exec((err, staff) => {
        if (err) return res.status(400).json(err);
        else {
          return res.json(staff);
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffforMachineNewService: (req, res) => {
    try {
      Staff.find(
        { school: req.body.school },
        "firstname cardNo _id pic school schoolCardType"
      ).exec((err, staff) => {
        if (err) return res.status(400).json(err);
        else {
          return res.json(staff);
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffByCardNo: (req, res, next) => {
    if (req.profile) {
      next();
    } else {
      try {
        Staff.findOne({ cardNo: req.body.cardNo })
          .select("title school firstname pic cardNo jobTitle regNum")
          .exec((err, staff) => {
            if (err) {
              res.status(400).json(err);
              return;
            } else if (!staff) {
              req.profile = false;
              next();
            } else {
              req.profile = staff;
              req.pic = staff.pic;
              req.card = "Staff";
              next();
            }
          });
      } catch (err) {
        res.status(500).json(err);
        return;
      }
    }
  },
};
