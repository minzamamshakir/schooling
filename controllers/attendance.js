const Attendance = require("../modals/attendance");
const Student = require("../modals/student");
const Staff = require("../modals/staff");
const School = require("../modals/school");
const logger = require("../config/logger");
const smsHandler = require("../commonHandlers/sms");
const constants = require("../commonHandlers/constant");
exports.attendance = {
  create: (student) => {
    try {
      const attend = new Attendance({
        id: student._id,
        machine_id: student.machine_id,
        school: student.school,
        modal: "Student",
        section: student.section,
        class: student.class,
      });
      setTimeout(() => {
        attend.save((err, attend) => {
          if (err) return logger.error(err);
          Student.findByIdAndUpdate(
            { _id: student._id },
            {
              $push: { attendence: attend._id },
            },
            { new: true, userFindAndModify: true },
            (err, student) => {
              if (err) return logger.error(err);
              logger.info(student);
            }
          );
        }, 100);
      });
    } catch (err) {
      return conosle.log(err);
    }
  },
  createStaff: (staff) => {
    try {
      const attend = new Attendance({
        id: staff._id,
        machine_id: staff.machine_id,
        school: staff.school,
        modal: "Staff",
      });
      attend.save((err, attend) => {
        if (err) return logger.error(err);
        Staff.findByIdAndUpdate(
          { _id: staff._id },
          {
            $push: { attendence: attend._id },
          },
          { new: true, userFindAndModify: true },
          (err, staff) => {
            if (err) return logger.error(err);
            logger.info(staff);
          }
        );
      });
    } catch (err) {
      return logger.error(err);
    }
  },
  rollCall: (req, res) => {
    try {
      console.log(req.body);
      const data =
        req.body &&
        req.body.length &&
        req.body.map(async (item) => {
          const obj = await Attendance.findOne({
            machine_id: +item.deviceUserId,
            school: req.schoolId,
            date: new Date().toLocaleDateString("en-PK", {
              timeZone: "Asia/Karachi",
            }),
          }).populate("id");
          const time = new Date(item.recordTime).toLocaleTimeString("en-PK", {
            hour12: false,
            timeZone: "Asia/Karachi",
          });
          const { timeIn, timeOut, midTime, fridayTime } = req.school;
          switch (true) {
            case time < timeIn + ":00":
              obj.time_in = time;
              obj.absent = false;
              obj.present = true;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Present
                );
              break;
            case time > timeIn && time < midTime:
              if (!obj.time_in) {
                obj.time_in = time;
                obj.late_in = true;
                obj.absent = false;
                obj.present = true;
                obj &&
                  obj.id &&
                  obj.id.smsNo &&
                  smsHandler(
                    obj && obj.id && obj.id.smsNo,
                    {
                      stdName: obj && obj.id && obj.id.stdName,
                      location: "202 R-B Gatti East, Faisalabad",
                      time,
                      date: new Date().toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      }),
                    },
                    constants.Present
                  );
              } else if (time > obj.time_in) {
                obj.time_Out = time;
                obj.earlyLeave = true;
                obj.absent = true;
                obj.present = false;
                obj &&
                  obj.id &&
                  obj.id.smsNo &&
                  smsHandler(
                    obj && obj.id && obj.id.smsNo,
                    {
                      stdName: obj && obj.id && obj.id.stdName,
                      location: "202 R-B Gatti East, Faisalabad",
                      time,
                      date: new Date().toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      }),
                    },
                    constants.Absent
                  );
              }
              break;
            case new Date().getDay() === 5 && time < fridayTime:
              if (!obj.time_in) {
                obj.time_in = time;
                obj.late_in = true;
                obj.present = true;
                obj.absent = false;
                obj &&
                  obj.id &&
                  obj.id.smsNo &&
                  smsHandler(
                    obj && obj.id && obj.id.smsNo,
                    {
                      stdName: obj && obj.id && obj.id.stdName,
                      location: "202 R-B Gatti East, Faisalabad",
                      time,
                      date: new Date().toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      }),
                    },
                    constants.Present
                  );
              } else if (time > obj.time_in) {
                obj.time_Out = time;
                obj.earlyLeave = true;
                obj.absent = true;
                obj.present = false;
                obj &&
                  obj.id &&
                  obj.id.smsNo &&
                  smsHandler(
                    obj && obj.id && obj.id.smsNo,
                    {
                      stdName: obj && obj.id && obj.id.stdName,
                      location: "202 R-B Gatti East, Faisalabad",
                      time,
                      date: new Date().toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      }),
                    },
                    constants.Departure
                  );
              }
              break;
            case new Date().getDay() === 5 && time > fridayTime:
              if (!obj.time_in) {
                obj.time_in = time;
                obj.late_in = true;
              } else {
                obj.time_Out = time;
                obj &&
                  obj.id &&
                  obj.id.smsNo &&
                  smsHandler(
                    obj && obj.id && obj.id.smsNo,
                    {
                      stdName: obj && obj.id && obj.id.stdName,
                      location: "202 R-B Gatti East, Faisalabad",
                      time,
                      date: new Date().toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      }),
                    },
                    constants.Departure
                  );
              }
              break;
            case new Date().getDay() !== 5 && time > midTime && time < timeOut:
              if (!obj.time_in) {
                obj.absent = true;
              } else {
                obj.time_Out = time;
                obj.halfLeave = true;
                obj &&
                  obj.id &&
                  obj.id.smsNo &&
                  smsHandler(
                    obj && obj.id && obj.id.smsNo,
                    {
                      stdName: obj && obj.id && obj.id.stdName,
                      location: "202 R-B Gatti East, Faisalabad",
                      time,
                      date: new Date().toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      }),
                    },
                    constants.Departure
                  );
              }
              break;
            case new Date().getDay() !== 5 && time > timeOut:
              if (!obj.time_in) {
                obj.absent = true;
              } else if (!obj.time_Out) {
                obj.time_Out = time;
                obj &&
                  obj.id &&
                  obj.id.smsNo &&
                  smsHandler(
                    obj && obj.id && obj.id.smsNo,
                    {
                      stdName: obj && obj.id && obj.id.stdName,
                      location: "202 R-B Gatti East, Faisalabad",
                      time,
                      date: new Date().toLocaleDateString("en-PK", {
                        timeZone: "Asia/Karachi",
                      }),
                    },
                    constants.Departure
                  );
                // smsHandler(
                //   "923037744181",
                //   {
                //     stdName:
                //       `92${obj && obj.id && obj.id.smsNo}` + obj &&
                //       obj.id &&
                //       obj.id.stdName,
                //     location: "202 R-B Gatti East, Faisalabad",
                //     time,
                //     date: new Date().toLocaleDateString("en-PK", {
                //       timeZone: "Asia/Karachi",
                //     }),
                //   },
                //   constants.Departure
                // );
              }
              break;
          }
          logger.info(JSON.stringify(obj));
          return obj.save();
        });
      Promise.allSettled(data).then((data) => res.json(data));
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Attendance.find().exec((err, attend) => {
        if (err) return res.status(400).json(err);
        return res.json(attend);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  todayAttData: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Student",
      })
        .populate([{ path: "id", select: "-fee" }])
        .exec((err, attend) => {
          if (err) return res.status(400).json(err);
          return res.json(attend);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  presentStudents: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        present: true,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Student",
      })
        .countDocuments()
        .exec((err, attendance) => {
          if (err) return res.status(400).json(err);
          else return res.json(attendance);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  outStudents: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        time_Out: { $ne: null },
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Student",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map((data) => {
            const std = Student.find({
              _id: data.id,
              inActive: { $ne: true },
            });
            return std;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  outStaff: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        time_Out: { $ne: null },
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Staff",
      })
        .countDocuments()
        .exec((err, attendance) => {
          if (err) return res.status(400).json(err);
          else return res.json(attendance);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  absentStudents: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        absent: true,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Student",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map((data) => {
            const std = Student.find({
              _id: data.id,
              inActive: { $ne: true },
            });
            return std;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  onLeaveStudents: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        onLeave: true,
        absent: false,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        present: false,
        modal: "Student",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map((data) => {
            const std = Student.find({
              _id: data.id,
              inActive: { $ne: true },
            });
            return std;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  lateStudents: (req, res) => {
    try {
      Attendance.find({
        school: req.body.school,
        absent: false,
        present: true,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        late_in: true,
        modal: "Student",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map((data) => {
            const std = Student.find({
              _id: data.id,
              inActive: { $ne: true },
            });
            return std;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // staff attendance
  presentStaff: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        present: true,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Staff",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map((data) => {
            const staf = Staff.find({
              _id: data.id,
              school: data.school,
              inActive: { $ne: true },
            });
            return staf;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  absentStaff: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        absent: true,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Staff",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map(async (data) => {
            const staf = await Staff.find({
              _id: data.id,
              school: data.school,
              inActive: { $ne: true },
            });
            return staf;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  onLeaveStaff: (req, res) => {
    try {
      Attendance.find({
        school: req.schoolId,
        onLeave: true,
        absent: false,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        present: false,
        modal: "Staff",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map((data) => {
            const staf = Staff.find({
              _id: data.id,
              school: data.school,
              inActive: { $ne: true },
            });
            return staf;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  lateStaff: (req, res) => {
    try {
      Attendance.find({
        school: req.body.school,
        absent: false,
        present: true,
        late_in: true,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
        modal: "Staff",
      }).exec((err, attendance) => {
        if (err) return res.status(400).json(err);
        else {
          const attend = attendance.map((data) => {
            const staf = Staff.find({
              _id: data.id,
              school: data.school,
              inActive: { $ne: true },
            });
            return staf;
          });
          Promise.allSettled(attend).then((data) => {
            let newData = data.filter((val) => {
              if (val && val.value && val.value.length !== 0) {
                return val;
              }
            });
            res.json(newData.length);
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffTodayAttendance: (req, res) => {
    try {
      const { school } = req.body;

      if (school) {
        Attendance.find({
          school: school,
          date: new Date().toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
          modal: "Staff",
        })
          .populate({
            path: "id",
            select: "title jobTitle firstname setting inActive",
          })
          .exec((err, staff) => {
            if (err) return res.status(400).json(err);
            else {
              const arr = staff.filter((staff) => {
                let a;
                if (staff && staff.id && staff.id.inActive) {
                  a = false;
                } else if (
                  typeof (staff && staff.id && staff.id.inActive) ===
                  "undefined"
                ) {
                  a = true;
                } else {
                  if (staff && staff.id && staff.id.inActive === false) {
                    a = true;
                  }
                }
                return a;
              });
              res.json(arr);
            }
          });
      } else {
        res.status(400).json({ err: "Please Send School" });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  allStaffTodayAttendance: (req, res) => {
    try {
      const { schoolId } = req;

      if (schoolId) {
        Attendance.find({
          school: schoolId,
          date: new Date().toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
          modal: "Staff",
        })
          .populate({
            path: "id",
            select: "-_id firstname title jobTitle regNum cardNo pic inActive",
          })
          .exec((err, staff) => {
            if (err) return res.status(400).json(err);
            else {
              const arr = staff.filter((staff) => {
                let a;
                if (staff && staff.id && staff.id.inActive) {
                  a = false;
                } else if (
                  typeof (staff && staff.id && staff.id.inActive) ===
                  "undefined"
                ) {
                  a = true;
                } else {
                  if (staff && staff.id && staff.id.inActive === false) {
                    a = true;
                  }
                }
                return a;
              });
              res.json(arr);
            }
          });
      } else {
        res.status(400).json({ err: "Please Send School" });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  allStudentTodayAttendance: (req, res) => {
    try {
      const { schoolId } = req;

      if (schoolId) {
        Attendance.find({
          school: schoolId,
          date: new Date().toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
          modal: "Student",
        })
          .populate({
            path: "id",
            match: { inActive: { $ne: true } },
            select:
              "_id stdName admissionNo cardNo rollNo pic parentsInfo.father.name",
            populate: [
              {
                path: "class",
                select: "name",
              },
              {
                path: "section",
                select: "name",
              },
            ],
          })
          .exec((err, students) => {
            if (err) return res.status(400).json(err);
            else {
              const arr = students.filter((student) => {
                let a;
                if (student && student.id && student.id.inActive) {
                  a = false;
                } else if (
                  typeof (student && student.id && student.id.inActive) ===
                  "undefined"
                ) {
                  a = true;
                } else {
                  if (student && student.id && student.id.inActive === false) {
                    a = true;
                  }
                }
                return a;
              });
              res.json(arr);
            }
          });
      } else {
        res.status(400).json({ err: "Please Send School" });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  updatePresentAttendance: async (req, res) => {
    try {
      const attend = await Attendance.findOne({
        _id: req && req.body && req.body.id,
      });
      attend.absent = req.body.absent;
      attend.present = req.body.present;
      attend.time_in = req.body.time_in;
      attend.save((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(data);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  updateAbsentAttendance: async (req, res) => {
    try {
      const attend = await Attendance.findOne({
        _id: req && req.body && req.body.id,
      });
      attend.absent = req.body.absent;
      attend.present = req.body.present;
      attend.onLeave = req.body.onLeave;
      attend.time_Out = req.body.time_Out;
      attend.save((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(data);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  updateOnLeaveAttendance: async (req, res) => {
    try {
      const attend = await Attendance.findOne({
        _id: req && req.body && req.body.id,
      });
      attend.absent = req.body.absent;
      attend.present = req.body.present;
      attend.onLeave = req.body.onLeave;
      attend.save((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(data);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  updateTimeOutAttendance: async (req, res) => {
    try {
      const attend = await Attendance.findOne({
        _id: req && req.body && req.body.id,
      });
      attend.absent = req.body.absent;
      attend.present = req.body.present;
      attend.time_Out = req.body.time_out;
      attend.save((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(data);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getStudentAttendance: (req, res) => {
    try {
      let newDate = new Date()
        .toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        })
        .split("/");
      newDate = "" + newDate[1] + "/" + newDate[0] + "/" + newDate[2];
      Attendance.find({
        machine_id: req.body.regNum,
        year: new Date().getFullYear().toString(),
      }).exec((err, attend) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          const filterAttend = attend.filter((attendence) => {
            let attendenceDate = attendence.date.split("/");
            attendenceDate =
              "" +
              attendenceDate[1] +
              "/" +
              attendenceDate[0] +
              "/" +
              attendenceDate[2];
            if (attendenceDate <= newDate) {
              return attendence;
            }
          });
          res.json(filterAttend);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsAttendanceForGuardian: async (req, res) => {
    try {
      let newDate = new Date()
        .toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        })
        .split("/");
      newDate = "" + newDate[1] + "/" + newDate[0] + "/" + newDate[2];
      const students = await Student.findOne({ _id: req.body.student });
      const attend = await Attendance.find({
        id: students._id,
        year: new Date().getFullYear().toString(),
      }).exec((err, attend) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          const filterAttend = attend.filter((attendence) => {
            let attendenceDate = attendence.date.split("/");
            attendenceDate =
              "" +
              attendenceDate[1] +
              "/" +
              attendenceDate[0] +
              "/" +
              attendenceDate[2];
            if (attendenceDate <= newDate) {
              return attendence;
            }
          });
          res.json(filterAttend);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  allStudentTodayClassAttendance: (req, res) => {
    try {
      const { schoolId } = req;

      if (schoolId) {
        Attendance.find({
          school: schoolId,
          date: new Date().toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
          modal: "Student",
        })
          .populate({
            path: "id",
            select:
              "-_id stdName admissionNo cardNo rollNo parentsInfo.father.name pic inActive",
            populate: [
              {
                path: "class",
                select: "name",
              },
              {
                path: "section",
                select: "name",
              },
            ],
          })
          .exec((err, students) => {
            if (err) return res.status(400).json(err);
            else {
              const arr = students.filter((student) => {
                let a;
                if (student.id.class._id.equals(req.body.classId)) {
                  if (student && student.id && student.id.inActive) {
                    a = false;
                  } else if (
                    typeof (student && student.id && student.id.inActive) ===
                    "undefined"
                  ) {
                    a = true;
                  } else {
                    if (
                      student &&
                      student.id &&
                      student.id.inActive === false
                    ) {
                      a = true;
                    }
                  }
                }
                return a;
              });
              res.json(arr);
              return;
            }
          });
      } else {
        res.status(400).json({ err: "Please Send School" });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  allStudentTodaySectionAttendance: (req, res) => {
    try {
      const { schoolId } = req;

      if (schoolId) {
        Attendance.find({
          school: schoolId,
          date: new Date().toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
          modal: "Student",
        })
          .populate({
            path: "id",
            // match: { inActive: { $ne: true } },
            select:
              "-_id stdName admissionNo cardNo rollNo parentsInfo.father.name pic inActive",
            populate: [
              {
                path: "class",
                select: "name",
              },
              {
                path: "section",
                select: "name",
              },
            ],
          })
          .exec((err, students) => {
            if (err) return res.status(400).json(err);
            else {
              const arr = students.filter((student) => {
                let a;
                if (student.id.section._id.equals(req.body.section)) {
                  if (student && student.id && student.id.inActive) {
                    a = false;
                  } else if (
                    typeof (student && student.id && student.id.inActive) ===
                    "undefined"
                  ) {
                    a = true;
                  } else {
                    if (
                      student &&
                      student.id &&
                      student.id.inActive === false
                    ) {
                      a = true;
                    }
                  }
                }
                return a;
              });
              res.json(arr);
              return;
            }
          });
      } else {
        res.status(400).json({ err: "Please Send School" });
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  createAttendenceForStudents: async (req, res) => {
    try {
      const student = await Student.find({ inActive: { $ne: true } });
      student.map((std) => {
        const attend = new Attendance({
          id: std._id,
          machine_id: std.machine_id,
          school: std.school,
          modal: "Student",
          section: std.section,
          class: std.class,
        });
        setTimeout(() => {
          attend.save((err, attend) => {
            if (err) return logger.error(err);
            Student.findByIdAndUpdate(
              { _id: std._id },
              {
                $push: { attendence: attend._id },
              },
              { new: true, userFindAndModify: true },
              (err, student) => {
                if (err) return logger.error(err);
                logger.info(student);
              }
            );
          }, 100);
        });
      });
    } catch (err) {
      return conosle.log(err);
    }
  },
  createAttendenceForStaffs: async (req, res) => {
    try {
      const staff = await Staff.find();
      staff.map((staf) => {
        const attend = new Attendance({
          id: staf._id,
          machine_id: staf.machine_id,
          school: staf.school,
          modal: "Staff",
        });
        attend.save((err, attend) => {
          if (err) return logger.error(err);
          Staff.findByIdAndUpdate(
            { _id: staf._id },
            {
              $push: { attendence: attend._id },
            },
            { new: true, userFindAndModify: true },
            (err, staff) => {
              if (err) return logger.error(err);
              logger.info(staff);
            }
          );
        });
      });
    } catch (err) {
      return conosle.log(err);
    }
  },
  sessionAttendence: async (req, res, next) => {
    try {
      const student = await Student.findOne({
        _id: req.student,
        inActive: { $ne: true },
      }).populate({
        path: "session",
        select: "to",
      });
      const start = new Date();
      const end = new Date(student.session.to);
      for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
        const attend = new Attendance({
          id: student._id,
          machine_id: student.machine_id,
          school: student.school,
          modal: "Student",
          section: student.section,
          class: student.class,
          date: day.toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
          month: day.getMonth() + 1,
          year: day.getFullYear(),
        });
        attend.save((err, attend) => {
          if (err) return logger.error(err);
          console.log(attend);
        });
      }
      logger.info("attendence pass");
      next();
    } catch (err) {
      logger.error(err);
      return res.status(500).json(err);
    }
  },
  sessionAttendenceStaff: async (req, res, next) => {
    try {
      const staff = await Staff.findOne({ _id: req.staff });
      const school = await School.findOne({
        _id: staff.school,
      }).populate({
        path: "currentSession",
        select: "to from",
      });
      const start = new Date();
      const end = new Date(school.currentSession.to);
      for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
        const attend = new Attendance({
          id: staff._id,
          machine_id: staff.machine_id,
          school: staff.school,
          modal: "Staff",
          date: day.toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
          month: day.getMonth() + 1,
          year: day.getFullYear(),
        });
        attend.save((err, attend) => {
          if (err) return logger.error(err);
          console.log(attend);
        });
      }
      next();
    } catch (err) {
      return console.log(err);
    }
  },
  createAttendenceForStudentsForSession: async (req, res) => {
    try {
      const student = await Student.find({
        inActive: { $ne: true },
        session: req.body.session,
      }).populate({
        path: "session",
        select: "to from",
      });
      student.map((std) => {
        const start = new Date();
        const end = new Date(std.session.to);
        for (
          let day = start;
          day <= end;
          day.setTime(day.getTime() + 86400000)
        ) {
          const attend = new Attendance({
            id: std._id,
            machine_id: std.machine_id,
            school: std.school,
            modal: "Student",
            section: std.section,
            class: std.class,
            date: day.toLocaleDateString("en-PK", {
              timeZone: "Asia/Karachi",
            }),
            month: day.getMonth() + 1,
            year: day.getFullYear(),
          });
          console.log(attend.date);
          attend.save((err, attend) => {
            if (err) return logger.error(err);
            logger.info(attend);
          });
        }
      });
    } catch (err) {
      return console.log(err);
    }
  },
  createAttendenceForStaffsForSession: async (req, res) => {
    try {
      const staff = await Staff.find();
      const student = await Student.findOne({
        inActive: { $ne: true },
        session: req.body.session,
      }).populate({
        path: "session",
        select: "to from",
      });
      staff.map((staf) => {
        const start = new Date();
        const end = new Date(student.session.to);
        for (
          let day = start;
          day <= end;
          day.setTime(day.getTime() + 86400000)
        ) {
          // const dayDate = day.toLocaleDateString("en-PK", {
          //   timeZone: "Asia/Karachi",
          // });
          // let newdate =
          //   day.getMonth() + 1 + "/" + day.getDate() + "/" + day.getFullYear();
          const attend = new Attendance({
            id: staf._id,
            machine_id: staf.machine_id,
            school: staf.school,
            modal: "Staff",
            month: day.getMonth() + 1,
            year: day.getFullYear(),
          });
          attend.date = day.toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          });
          console.log(attend.date);
          attend.save((err, attend) => {
            if (err) return logger.error(err);
            logger.info(attend);
          });
        }
      });
    } catch (err) {
      return console.log(err);
    }
  },
  findStaffAttAndUpdateMachineId: (req, res) => {
    try {
      Staff.findOne({ _id: req.body._id })
        .select("machine_id")
        .exec((err, staff) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            Attendance.find({ id: staff._id.toString() }).exec(
              (err, attendance) => {
                if (err) {
                  res.status(400).json(err);
                  return;
                } else {
                  const newAtt = attendance.map((item) => {
                    item.machine_id = staff.machine_id;
                    return item.save();
                  });
                  Promise.allSettled(newAtt).then((data) => res.json(data));
                }
              }
            );
          }
        });
    } catch (err) {
      console.log(err);
    }
  },
  getAttendanceByStudentId: (req, res) => {
    try {
      Attendance.findOne({
        id: req.student._id,
        date: new Date().toLocaleDateString("en-PK", {
          timeZone: "Asia/Karachi",
        }),
      }).exec((err, attend) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json({ attend, pic: req.pic, student: req.student });
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  rollCallWithId: async (req, res) => {
    if (!req.profile) {
      res.status(400).json({ err: "Profile not found with the Card NO." });
    } else {
      try {
        const obj = await Attendance.findOne({
          id: req.profile._id,
          school: req.profile.school,
          date: new Date().toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
        }).populate("id");
        const time = new Date(req.body.recordTime).toLocaleTimeString("en-PK", {
          hour12: false,
          timeZone: "Asia/Karachi",
        });
        const { timeIn, timeOut, midTime, fridayTime } = req.school;
        switch (true) {
          case time < timeIn + ":00":
            obj.time_in = time;
            obj.absent = false;
            obj.present = true;
            obj &&
              obj.id &&
              obj.id.smsNo &&
              smsHandler(
                obj && obj.id && obj.id.smsNo,
                {
                  stdName: obj && obj.id && obj.id.stdName,
                  location: "202 R-B Gatti East, Faisalabad",
                  time,
                  date: new Date().toLocaleDateString("en-PK", {
                    timeZone: "Asia/Karachi",
                  }),
                },
                constants.Present
              );
            break;
          case time > timeIn && time < midTime:
            if (!obj.time_in) {
              obj.time_in = time;
              obj.late_in = true;
              obj.absent = false;
              obj.present = true;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Present
                );
            } else if (time > obj.time_in) {
              obj.time_Out = time;
              obj.earlyLeave = true;
              obj.absent = true;
              obj.present = false;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Absent
                );
            }
            break;
          case new Date().getDay() === 5 && time < fridayTime:
            if (!obj.time_in) {
              obj.time_in = time;
              obj.late_in = true;
              obj.present = true;
              obj.absent = false;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Present
                );
            } else if (time > obj.time_in) {
              obj.time_Out = time;
              obj.earlyLeave = true;
              obj.absent = true;
              obj.present = false;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Departure
                );
            }
            break;
          case new Date().getDay() === 5 && time > fridayTime:
            if (!obj.time_in) {
              obj.time_in = time;
              obj.late_in = true;
            } else {
              obj.time_Out = time;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Departure
                );
            }
            break;
          case new Date().getDay() !== 5 && time > midTime && time < timeOut:
            if (!obj.time_in) {
              obj.absent = true;
            } else {
              obj.time_Out = time;
              obj.halfLeave = true;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Departure
                );
            }
            break;
          case new Date().getDay() !== 5 && time > timeOut:
            if (!obj.time_in) {
              obj.absent = true;
            } else if (!obj.time_Out) {
              obj.time_Out = time;
              obj &&
                obj.id &&
                obj.id.smsNo &&
                smsHandler(
                  obj && obj.id && obj.id.smsNo,
                  {
                    stdName: obj && obj.id && obj.id.stdName,
                    location: "202 R-B Gatti East, Faisalabad",
                    time,
                    date: new Date().toLocaleDateString("en-PK", {
                      timeZone: "Asia/Karachi",
                    }),
                  },
                  constants.Departure
                );
              // smsHandler(
              //   "923037744181",
              //   {
              //     stdName:
              //       `92${obj && obj.id && obj.id.smsNo}` + obj &&
              //       obj.id &&
              //       obj.id.stdName,
              //     location: "202 R-B Gatti East, Faisalabad",
              //     time,
              //     date: new Date().toLocaleDateString("en-PK", {
              //       timeZone: "Asia/Karachi",
              //     }),
              //   },
              //   constants.Departure
              // );
            }
            break;
        }
        obj.save((err, data) => {
          if (err) {
            res.status(400).json(err);
          } else {
            data.id = undefined;
            res.json({
              data,
              pic: req.pic,
              profile: req.profile,
              cardType: req.card,
            });
          }
        });
        // Promise.allSettled(data).then((data) => res.json(data));
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  },
  getStudentAttendanceByGuardian: (req, res) => {
    try {
      Attendance.find({
        id: req.params.studentId,
        date: {
          $lte: new Date().toLocaleDateString("en-PK", {
            timeZone: "Asia/Karachi",
          }),
        },
        year: new Date().getFullYear().toString(),
      }).exec((err, attend) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(attend);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
