const { Salary } = require("../../modals/accounts/salary");
const Staff = require("../../modals/staff");
const AddBonus = require("../../modals/addBonus");
const Attendance = require("../../modals/attendance");
const SalaryMonth = require("../../modals/salaryMonth");
const Transaction = require("../../modals/accounts/transaction");
const IntermsOf = require("../../modals/accounts/intermsOf");
const logger = require("../../config/logger");
const Loan = require("../../modals/loan");
exports.salary = {
  createSalaryOfAllStaff: async (req, res) => {
    try {
      const staffs = await Staff.find({
        school: req.body.school,
        inActive: { $ne: true },
      });
      const data = staffs.map(async (staff) => {
        const salary = await Salary.find({
          $and: [
            { staff: staff._id },
            {
              $or: [
                ...(req &&
                  req.body &&
                  req.body.month &&
                  req.body.month.map((mon) => ({
                    salaryMonth: mon,
                  }))),
              ],
            },
          ],
        });
        if (salary.length) {
          return "Salary is Already Present";
        } else {
          const addBonus = await AddBonus.find({
            $and: [
              {
                $or: [
                  { school: staff.school },
                  {
                    staff: staff.regNum,
                  },
                ],
              },
              {
                $or: [
                  ...(req &&
                    req.body &&
                    req.body.month &&
                    req.body.month.map((mon) => ({
                      month: mon,
                    }))),
                ],
              },
            ],
          });
          let bonus = 0;
          addBonus &&
            addBonus.length &&
            addBonus.map((item) => {
              item &&
                item.bonus &&
                item.bonus.length &&
                item.bonus.map((data) => {
                  Object.keys(data) &&
                    Object.keys(data).length &&
                    Object.keys(data).map((name) => {
                      bonus = bonus + +data[name];
                    });
                });
            });
          const staffSalary = new Salary({
            regNo: staff.regNum,
            staff: staff._id,
            session: req.body.session,
            salaryMonth: req.body.month.join(","),
            basicSalary: staff.salary,
            year: req.body.year,
            bonus: addBonus,
          });
          let newRemain;
          let loanStatus;
          const loan = await Loan.find({
            staffId: staff._id,
          });
          if (loan.length !== 0) {
            if (loan[0].remaining >= loan[0].deductAmount) {
              staffSalary.totalSalary =
                staff.salary * req.body.month.length +
                bonus -
                loan[0].deductAmount;
              newRemain = loan[0].remaining - loan[0].deductAmount;
              loanStatus = true;
            } else if (loan[0].remaining > 0) {
              staffSalary.totalSalary =
                staff.salary * req.body.month.length +
                bonus -
                loan[0].remaining;
              newRemain = loan[0].remaining;
              loanStatus = true;
            } else if (loan[0].remaining == 0) {
              staffSalary.totalSalary =
                staff.salary * req.body.month.length + bonus;
              loanStatus = false;
            }
          } else {
            staffSalary.totalSalary =
              staff.salary * req.body.month.length + bonus;
          }
          Loan.findOneAndUpdate(
            {
              staffId: staff._id,
            },
            {
              $set: { remaining: newRemain, active: loanStatus },
            },
            { new: true, userFindAndModify: false }
          ).exec((err, loan) => {
            if (err) {
              logger.error(err);
            } else {
              logger.info(loan);
            }
          });
          return staffSalary.save();
        }
      });
      Promise.allSettled(data).then(async (data) => {
        const salaryMonth = await SalaryMonth.findOne({
          session: req.body.session,
        });
        req.body.month &&
          req.body.month.map((mon) => {
            salaryMonth.month[mon] = true;
          });
        await salaryMonth.save();
        res.json(data);
        return;
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createSalaryOfSingleStaff: async (req, res) => {
    try {
      const staff = await Staff.findOne({
        regNum: req.body.regNum,
        inActive: { $ne: true },
      });
      const salary = await Salary.find({
        $and: [
          { staff: staff._id },
          {
            $or: [
              ...(req &&
                req.body &&
                req.body.month &&
                req.body.month.map((mon) => ({
                  salaryMonth: mon,
                }))),
            ],
          },
        ],
      });
      if (salary.length) {
        res.json("Salary is Already Present");
      } else {
        const addBonus = await AddBonus.find({
          $and: [
            {
              $or: [
                { school: staff.school },
                {
                  staff: staff.regNum,
                },
              ],
            },
            {
              $or: [
                ...(req &&
                  req.body &&
                  req.body.month &&
                  req.body.month.map((mon) => ({
                    month: mon,
                  }))),
              ],
            },
          ],
        });
        let bonus = 0;
        addBonus &&
          addBonus.length &&
          addBonus.map((item) => {
            item &&
              item.bonus &&
              item.bonus.length &&
              item.bonus.map((data) => {
                Object.keys(data) &&
                  Object.keys(data).length &&
                  Object.keys(data).map((name) => {
                    bonus = bonus + +data[name];
                  });
              });
          });
        const staffSalary = new Salary({
          regNo: staff.regNum,
          staff: staff._id,
          session: req.body.session,
          salaryMonth: req.body.month.join(","),
          basicSalary: staff.salary,
          year: req.body.year,
          bonus: addBonus,
        });
        let newRemain;
        let loanStatus;
        const loan = await Loan.find({
          staffId: staff._id,
        });
        if (loan.length !== 0) {
          if (loan[0].remaining >= loan[0].deductAmount) {
            staffSalary.totalSalary =
              staff.salary * req.body.month.length +
              bonus -
              loan[0].deductAmount;
            newRemain = loan[0].remaining - loan[0].deductAmount;
            loanStatus = true;
          } else if (loan[0].remaining > 0) {
            staffSalary.totalSalary =
              staff.salary * req.body.month.length + bonus - loan[0].remaining;
            newRemain = loan[0].remaining;
            loanStatus = true;
          } else if (loan[0].remaining == 0) {
            staffSalary.totalSalary =
              staff.salary * req.body.month.length + bonus;
            loanStatus = false;
          }
        } else {
          staffSalary.totalSalary =
            staff.salary * req.body.month.length + bonus;
        }
        Loan.findOneAndUpdate(
          {
            staffId: staff._id,
          },
          {
            $set: { remaining: newRemain, active: loanStatus },
          },
          { new: true, userFindAndModify: false }
        ).exec((err, loan) => {
          if (err) {
            logger.error(err);
          } else {
            logger.info(loan);
          }
        });
        staffSalary.save((err, staffsal) => {
          if (err) {
            res.status(400).json(err);
          } else {
            res.json(staffsal);
          }
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStaffSalarySlip: (req, res, next) => {
    try {
      if (req.body.month.length) {
        Staff.find({
          school: req.body.school,
          session: req.body.session,
          inActive: { $ne: true },
        }).exec((err, staffs) => {
          if (err) return res.status(400).json(err);
          else {
            const slips = staffs.map((staff) => {
              return Salary.find({
                $and: [
                  { staff: staff._id },
                  {
                    $or: [
                      ...req.body.month.map((item) => {
                        return { salaryMonth: item };
                      }),
                    ],
                  },
                ],
              }).populate([
                {
                  path: "staff",
                  select: "title firstname lastname jobTitle cnic inActive",
                },
                {
                  path: "session",
                  select: "name",
                },
                {
                  path: "bonus",
                },
              ]);
            });
            Promise.allSettled(slips).then((data) => {
              req.SalaryData = data;
              next();
            });
          }
        });
      } else {
        return res.status(400).json({ err: "month array is requied" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleStaffSalarySlip: (req, res, next) => {
    try {
      if (req.body.month.length) {
        Staff.find({
          regNum: req.body.regNum,
          inActive: { $ne: true },
        }).exec((err, staffs) => {
          if (err) {
            return res.status(400).json(err);
          } else if (staffs.length == 0) {
            return res.status(400).json("Invalid RegNo.");
          } else {
            const slips = staffs.map((staff) => {
              return Salary.find({
                $and: [
                  { staff: staff._id },
                  {
                    $or: [
                      ...req.body.month.map((item) => {
                        return { salaryMonth: item };
                      }),
                    ],
                  },
                ],
              }).populate([
                {
                  path: "staff",
                  select: "title firstname lastname jobTitle cnic inActive",
                },
                {
                  path: "bonus",
                },
              ]);
            });
            Promise.allSettled(slips).then((data) => {
              req.SalaryData = data;
              next();
            });
          }
        });
      } else {
        return res.status(400).json({ err: "month array is requied" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffSalary: (req, res) => {
    try {
      Staff.findOne({
        regNum: req.body.regNum,
        school: req.body.school,
        inActive: { $ne: true },
      }).exec((err, staff) => {
        if (err) return res.status(400).json(err);
        else {
          if (staff && staff.length !== 0) {
            Salary.find({
              staff: staff && staff._id,
              session: req.body.session,
            })
              .populate([
                {
                  path: "staff",
                  select: "title firstname lastname jobTitle cnic",
                },
                {
                  path: "session",
                  select: "duration",
                },
                {
                  path: "bonus",
                },
              ])
              .exec((err, salary) => {
                if (err) return res.status(400).json(err);
                else return res.json(salary);
              });
          }
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getMonthlyAttendence: (req, res) => {
    try {
      const allData = req.SalaryData.map(async (salary) => {
        if (salary.value[0].staff.inActive !== true) {
          const salMonth =
            new Date(
              Date.parse(salary.value[0].salaryMonth + " 1, 2012")
            ).getMonth() + 1;
          const newData = {};
          newData.totalDays = await Attendance.find({
            id: salary.value[0].staff._id,
            month: salMonth,
            year: salary.value[0].year,
          }).countDocuments();
          newData.leave = await Attendance.find({
            id: salary.value[0].staff._id,
            month: salMonth,
            year: salary.value[0].year,
            onLeave: true,
          }).countDocuments();
          newData.absent = await Attendance.find({
            id: salary.value[0].staff._id,
            month: salMonth,
            year: salary.value[0].year,
            absent: true,
          }).countDocuments();
          newData.present = await Attendance.find({
            id: salary.value[0].staff._id,
            month: salMonth,
            year: salary.value[0].year,
            present: true,
          }).countDocuments();
          return newData;
        }
      });
      Promise.all(allData).then((data) =>
        res.json({ monthlyAttend: data, staffSalary: req.SalaryData })
      );
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateSalary: (req, res) => {
    try {
      if (req && req.body && req.body.amount) {
        if (+req.body.amount >= req.body.totalSalary) {
          req.body.paid = true;
        } else {
          return res.status(400).json("Please enter correct amount");
        }
      }
      Salary.findOneAndUpdate(
        { _id: req.body._id },
        { $set: req.body },
        { new: true, userFindAndModify: true },
        (err, voucher) => {
          if (err) return res.status(400).json(err);
          IntermsOf.findOne({ typeOfAmount: "expense", name: "salary" }).exec(
            (err, obj) => {
              if (err) return res.status(400).json(err);
              else {
                const transaction = new Transaction({
                  session: req.body.session._id,
                  transactionType: "expense",
                  inTermsOf: obj && obj._id,
                  amount: +req.body.amount,
                  salary: req.body._id,
                  enteredBy: "Admin",
                  createdBy: req.profile._id,
                });
                transaction.save((err, trans) => {
                  if (err) return res.status(400).json(err);
                  else {
                    return res.json(trans);
                  }
                });
              }
            }
          );
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStaffPaidSalary: async (req, res, id) => {
    try {
      const staff = await Staff.find({
        school: req.body.schoolId,
        inActive: { $ne: true },
      });
      const data = staff.map(async (staf) => {
        if (req.body.month !== undefined) {
          const salaryData = await Salary.findOne({
            paid: true,
            session: req.body.session,
            salaryMonth: req.body.month,
            staff: staf._id.toString(),
          }).populate({
            path: "staff",
            select: "firstname regNum pic",
          });
          return salaryData;
        } else {
          const salaryData = await Salary.findOne({
            paid: true,
            staff: staf._id.toString(),
          }).populate({
            path: "staff",
            select: "firstname regNum pic",
          });
          return salaryData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStaffUnpaidSalary: async (req, res, id) => {
    try {
      const staff = await Staff.find({
        school: req.body.schoolId,
        inActive: { $ne: true },
      });
      const data = staff.map(async (staf) => {
        if (req.body.month !== undefined) {
          const salaryData = await Salary.findOne({
            paid: false,
            session: req.body.session,
            salaryMonth: req.body.month,
            staff: staf._id.toString(),
          }).populate({
            path: "staff",
            select: "firstname regNum pic",
          });
          return salaryData;
        } else {
          const salaryData = await Salary.findOne({
            paid: false,
            staff: staf._id.toString(),
          }).populate({
            path: "staff",
            select: "firstname regNum pic",
          });
          return salaryData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStaffsPaidSalaryByDate: (req, res) => {
    try {
      if (req.body.data.Fromdate == req.body.data.Todate) {
        var query = {
          paid: true,
          paidDate: req.body.data.Todate,
        };
      } else {
        var query = {
          paid: true,
          paidDate: {
            $gte: req.body.data.Fromdate,
            $lte: req.body.data.Todate,
          },
        };
      }
      console.log(query);
      Salary.find(query)
        .populate("staff", "firstname regNum pic")
        .exec((err, obj) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            console.log(obj.paidDate);
            res.json(obj);
            return;
          }
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
