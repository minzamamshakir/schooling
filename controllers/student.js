const Student = require("../modals/student");
const Register = require("../modals/register");
const Section = require("../modals/section");
const Guardian = require("../modals/guardian");
const Staff = require("../modals/staff");
const User = require("../modals/user");
const Permissions = require("../modals/permissions");
const TempletPermission = require("../modals/templetPermission");
const logger = require("../config/logger");
exports.student = {
  create: async (req, res, next) => {
    try {
      const reg = await Register.findOne({
        $and: [
          { level: req.body.student.level },
          { gender: req.body.student.gender },
        ],
      });
      Student.findOne(
        {
          $and: [
            {
              section: req.body.student.section,
            },
            {
              school: req.body.student.school,
            },
            {
              rollNo: req.body.student.rollNo,
            },
          ],
        },
        async (err, std) => {
          if (std) {
            if (
              (req &&
                req.guardian &&
                req.guardian.childs &&
                req.guardian.childs.length === 0) ||
              !req.guardian.childs
            ) {
              Guardian.findOneAndDelete({ _id: req.guardian._id }).exec(
                (err, guardian) => {
                  return logger.error("delete guardian");
                }
              );
              User.findOneAndDelete({ _id: req.userForGaurdian }).exec(
                (err, User) => {
                  return logger.error("delete User Of guardain");
                }
              );
              Permissions.findOneAndDelete({ _id: req.permission }).exec(
                (err, permission) => {
                  return logger.error("delete permissions");
                }
              );
            } else {
              return logger.error("delete guardias");
            }
          } else {
            const stdCount = await Student.find({
              school: req.body.student.school,
            }).countDocuments();
            logger.info(stdCount);
            const newReg = `${reg.prefix}-${reg.count + 1}`;
            const student = new Student(req.body.student);
            student.machine_id = stdCount + 1 + 100;
            student.admissionNo = newReg;
            student.guardian = req.guardian._id;
            student.username = `${newReg}@ghazalians.com`;
            student.password = req.body.student.password;
            student.feeData.fee = req.body.student.fee;
            student.feeData.regFee = req.body.student.regFee;
            student.feeData.discount = req.body.discount;
            student.rollNo = +req.body.student.rollNo;
            student.role = 5;
            //       student.stdName = `${req.body.student.stdFirstName} ${req.body.student.stdLastName}`;
            if (req.profile.role == 1) {
              student.createdByRole = "Admin";
            } else {
              student.createdByRole = "Staff";
            }
            student.createdBy = req.profile._id;
            student.save((stdErr, student) => {
              if (stdErr !== null) {
                if (
                  (req &&
                    req.guardian &&
                    req.guardian.childs &&
                    req.guardian.childs.length === 0) ||
                  !req.guardian.childs
                ) {
                  Guardian.findOneAndDelete({ _id: req.guardian._id }).exec(
                    (err, guardian) => {
                      if (err) return res.status(400).json(err);
                      else res.status(400).json(stdErr);
                    }
                  );
                  User.findOneAndDelete({ _id: req.userForGaurdian }).exec(
                    (err, User) => {
                      if (err) return res.status(400).json(err);
                      else res.status(400).json(stdErr);
                    }
                  );
                  Permissions.findOneAndDelete({ _id: req.permission }).exec(
                    (err, permission) => {
                      if (err) return res.status(400).json(err);
                      else res.status(400).json(stdErr);
                    }
                  );
                } else {
                  return res.status(400).json(stdErr);
                }
              } else {
                Guardian.findOneAndUpdate(
                  { _id: req.guardian._id },
                  {
                    $push: { childs: student._id },
                  },
                  {
                    new: true,
                    userFindAndModify: false,
                  },
                  (err, guardian) => {
                    if (err)
                      if (
                        (req &&
                          req.guardian &&
                          req.guardian.childs &&
                          req.guardian.childs.length === 0) ||
                        !req.guardian.childs
                      ) {
                        Guardian.findOneAndDelete({
                          _id: req.guardian._id,
                        }).exec((err, guardian) => {
                          if (err) return res.status(400).json(err);
                          else res.status(400).json(stdErr);
                        });
                      } else {
                        User.findOneAndDelete({
                          _id: req.userForGaurdian,
                        }).exec((err, User) => {
                          if (err) return res.status(400).json(err);
                          else res.status(400).json(stdErr);
                        });
                        Permissions.findOneAndDelete({
                          _id: req.permission,
                        }).exec((err, permission) => {
                          if (err) return res.status(400).json(err);
                          else res.status(400).json(stdErr);
                        });
                      }
                    reg.count = reg.count + 1;
                    reg.save((err, reg) => {
                      if (err)
                        if (
                          (req &&
                            req.guardian &&
                            req.guardian.childs &&
                            req.guardian.childs.length === 0) ||
                          !req.guardian.childs
                        ) {
                          Guardian.findOneAndDelete({
                            _id: req.guardian._id,
                          }).exec((err, guardian) => {
                            if (err) return res.status(400).json(err);
                            else res.status(400).json(err);
                          });
                        } else {
                          User.findOneAndDelete({
                            _id: req.userForGaurdian,
                          }).exec((err, User) => {
                            if (err) return res.status(400).json(err);
                            else res.status(400).json(err);
                          });
                          Permissions.findOneAndDelete({
                            _id: req.permission,
                          }).exec((err, permission) => {
                            if (err) return res.status(400).json(err);
                            else res.status(400).json(err);
                          });
                        }
                      Section.findOneAndUpdate(
                        { _id: req.body.student.section },
                        {
                          $push: { students: student._id },
                        },
                        {
                          new: true,
                          userFindAndModify: false,
                        },
                        (err, section) => {
                          if (err)
                            if (
                              (req &&
                                req.guardian &&
                                req.guardian.childs &&
                                req.guardian.childs.length === 0) ||
                              !req.guardian.childs
                            ) {
                              Guardian.findOneAndDelete({
                                _id: req.guardian._id,
                              }).exec((err, guardian) => {
                                if (err) return res.status(400).json(err);
                                else res.status(400).json(err);
                              });
                            } else {
                              User.findOneAndDelete({
                                _id: req.userForGaurdian,
                              }).exec((err, User) => {
                                if (err) return res.status(400).json(err);
                                else res.status(400).json(err);
                              });
                              Permissions.findOneAndDelete({
                                _id: req.permission,
                              }).exec((err, permission) => {
                                if (err) return res.status(400).json(err);
                                else res.status(400).json(err);
                              });
                            }
                        }
                      );
                    });
                    req.student = student._id;
                    logger.info("student Create pass");
                    next();
                  }
                );
              }
            });
          }
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Student.find({ inActive: { $ne: true } })
        .populate({
          path: "class section",
          select: "name",
        })
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentById: (req, res, next, id) => {
    try {
      Student.findById(id)
        .populate("school section session class gender guardian")
        .exec((err, student) => {
          if (err || !student) {
            return res.status(400).json({
              error: "no such Student was found in Db",
            });
          }
          req.student = student;
          next();
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleStudent: async (req, res) => {
    res.json(req.student);
  },
  getSingleStudentForUser: async (req, res) => {
    const userData = await User.findOne({
      informativeModel: req.student._id,
    });
    res.json({
      student: req.student,
      username: userData.email,
      password: userData.password,
      _id: req.student._id,
    });
  },
  updateStudent: (req, res) => {
    try {
      Student.findOneAndUpdate(
        { _id: req.student._id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, student) => {
          if (err) return res.status(400).json(err);
          return res.json(student);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateStudentForActiveInActive: (req, res) => {
    try {
      Student.findOneAndUpdate(
        { _id: req.student._id },
        {
          $set: req.body,
          joiningDate: req.body.joiningDate,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, student) => {
          if (err) return res.status(400).json(err);
          return res.json(student);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getstudentByRegNoMW: (req, res, next) => {
    try {
      Student.findOne({
        admissionNo: req.body.regNum,
        inActive: { $ne: true },
      }).exec((err, student) => {
        if (err) return res.status(400).json(err);
        else {
          req.studentId = student._id;
          next();
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getstudentByRegNo: (req, res) => {
    try {
      Student.findOne({
        admissionNo: req.body.admissionNo,
        inActive: { $ne: true },
      })
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "session",
            select: "duration",
          },
          {
            path: "school",
            select: "schoolCardAddress",
          },
          {
            path: "guardian",
          },
          {
            path: "section",
            select: "color",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          else {
            return res.json(student);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentforMachine: (req, res) => {
    try {
      Student.find(
        { school: req.body.school, inActive: { $ne: true } },
        "stdName machine_id cardNo _id"
      ).exec((err, students) => {
        if (err) return res.status(400).json(err);
        else {
          return res.json(students);
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentforMachineNewService: (req, res) => {
    try {
      Student.find({ school: req.body.school, inActive: { $ne: true } })
        .populate([
          {
            path: "class",
            select: "name -_id",
          },
          {
            path: "section",
            select: "name -_id",
          },
        ])
        .select(
          "stdName machine_id cardNo _id pic school class section parentsInfo.father.name schoolCardType"
        )
        .exec((err, students) => {
          if (err) return res.status(400).json(err);
          else {
            return res.json(students);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentBySchool: (req, res) => {
    try {
      Student.find({
        school: req.body.school,
        session: req.body.session,
        inActive: { $ne: true },
      })
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, students) => {
          if (err) return res.status(400).json(err);
          else return res.json(students);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentByClass: (req, res) => {
    try {
      Student.find({ class: req.body.classId, inActive: { $ne: true } })
        .populate([
          {
            path: "section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, students) => {
          if (err) return res.status(400).json(err);
          else return res.json(students);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentBySection: (req, res) => {
    try {
      Student.find({ section: req.body.section, inActive: { $ne: true } })
        .populate([
          {
            path: "section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, students) => {
          if (err) return res.status(400).json(err);
          else return res.json(students);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentContact: (req, res) => {
    try {
      Student.findOne(
        {
          admissionNo: req && req.body && req.body.regNum,
          inActive: { $ne: true },
        },
        "smsNo section class rollNo stdName"
      )
        .populate([
          {
            path: "section",
            select: "name",
          },
          {
            path: "class",
            select: "name",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          else {
            return res.json(student);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getClassContact: (req, res) => {
    try {
      Student.find(
        { class: req && req.body && req.body.classId, inActive: { $ne: true } },
        "smsNo stdName class section rollNo"
      )
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "section",
            select: "name",
          },
        ])
        .distinct("smsNo", (err, contacts) => {
          if (err) return res.status(400).json(err);
          else return res.json(contacts);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSectionContact: (req, res) => {
    try {
      Student.find(
        {
          section: req && req.body && req.body.section,
          inActive: { $ne: true },
        },
        "smsNo stdName class section rollNo"
      )
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "section",
            select: "name",
          },
        ])
        .distinct("smsNo", (err, contacts) => {
          if (err) return res.status(400).json(err);
          else return res.json(contacts);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getCampusContact: (req, res) => {
    try {
      Student.find(
        { school: req && req.body && req.body.school, inActive: { $ne: true } },
        "smsNo stdName class section rollNo"
      )
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "section",
            select: "name",
          },
          {
            path: "guardian",
            select: "regNum",
          },
        ])
        .distinct("smsNo", (err, contacts) => {
          if (err) return res.status(400).json(err);
          else return res.json(contacts);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateRegNo: (req, res) => {
    try {
      Guardian.find().exec((err, guardians) => {
        const data = guardians.sort((a, b) => {
          const f1 = -a.regNum.split("-")[1];
          const f2 = -a.regNum.split("-")[1];
          return f1 - f2;
        });
        const newdata = data.map((guard, i) => {
          const regNum = `GFNG-${i + 1}`;
          guard.userid = regNum + "@ghazalians.com";
          guard.regNum = regNum;
          return guard.save();
        });
        Promise.allSettled(newdata).then((data) => res.json(data));
      });
    } catch (err) {
      console.log(err);
    }
  },
  singleStudentProfile: (req, res) => {
    if (typeof req.profile !== typeof undefined) {
      User.findById({
        _id: req.profile._doc._id,
      })
        .populate("informativeModel")
        .exec((err, student) => {
          if (err || !student) {
            return res.status(400).json({
              error: "no such student was found in Db",
            });
          } else {
            res.json({
              student: student._doc.informativeModel,
              user: student,
              _id: student._id,
            });
          }
        });
    }
  },
  getStudentStrength: (req, res) => {
    Student.countDocuments(
      {
        school: req && req.body && req.body.school,
        session: req.body.session,
        inActive: { $ne: true },
      },
      function (err, c) {
        if (err) {
          return res.status(400).json({ err });
        } else {
          res.json(c);
        }
      }
    );
  },
  allStudents: (req, res, next) => {
    try {
      Student.find()
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          req.students = student;
          next();
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allStudentsOfSchool: (req, res, next) => {
    try {
      Student.find({ school: req.body.school })
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allStudentsBySection: (req, res, next) => {
    try {
      Student.find({
        section: req.body.section,
        session: req.body.session,
        school: req.body.school,
      })
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allStudentsOfClass: (req, res, next) => {
    try {
      Student.find({
        class: req.body.classId,
        session: req.body.session,
        school: req.body.school,
      })
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allActiveStudentsBySection: (req, res, next) => {
    try {
      Student.find({
        section: req.body.section,
        session: req.body.session,
        school: req.body.school,
        inActive: { $ne: true },
      })
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allActiveStudentsOfClass: (req, res, next) => {
    try {
      Student.find({
        class: req.body.classId,
        session: req.body.session,
        school: req.body.school,
        inActive: { $ne: true },
      })
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allInActiveStudentsBySection: (req, res, next) => {
    try {
      Student.find({
        section: req.body.section,
        session: req.body.session,
        school: req.body.school,
        inActive: true,
      })
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allInActiveStudentsOfClass: (req, res, next) => {
    try {
      Student.find({
        class: req.body.classId,
        session: req.body.session,
        school: req.body.school,
        inActive: true,
      })
        .populate([
          {
            path: "class section",
            select: "name",
          },
          {
            path: "guardian",
          },
        ])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  studentUpdateMachine: (req, res) => {
    try {
      Student.find({ school: req.body.school })
        .sort([["machine_id", 1]])
        .exec((err, students) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const updatedStudent = students.map((student, i) => {
              student.machine_id = i + 101;
              return student.save();
            });
            Promise.all(updatedStudent).then((result) => res.josn(result));
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
  getStudentByCardNo: (req, res, next) => {
    try {
      Student.findOne({ cardNo: req.body.cardNo })
        .populate("section class")
        .select(
          "_id pic section class parentsInfo.father.name stdName school admissionNo"
        )
        .exec((err, student) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else if (!student) {
            req.profile = false;

            next();
          } else {
            const section = { name: student.section.name };
            const className = { name: student.class.name };
            req.profile = student;
            req.profile.section = section;
            req.profile.class = className;
            req.pic = student.pic;
            req.card = "Student";
            next();
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  updateStdCertNo: (req, res) => {
    try {
      Student.findOneAndUpdate(
        { _id: req.body.student },
        {
          $set: { certNo: req.body.count },
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, student) => {
          if (err) return res.status(400).json(err);
          return res.json(student);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
