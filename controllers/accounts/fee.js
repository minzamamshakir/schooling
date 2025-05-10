const { StudentsFee } = require("../../modals/accounts/fee");
const Guardian = require("../../modals/guardian");
const Student = require("../../modals/student");
const { validationResult } = require("express-validator");
const AddCharges = require("../../modals/addCharges");
const Transaction = require("../../modals/accounts/transaction");
const IntermsOf = require("../../modals/accounts/intermsOf");
const Month = require("../../modals/month");
const { Class } = require("../../modals/class");
const ReceiveMonth = require("../../modals/receiveMonth");
const logger = require("../../config/logger");
const async = require("express-async");
const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const sortByMonth = (arr) => {
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  return arr.sort((a, b) => {
    return months.indexOf(a) - months.indexOf(b);
  });
};

exports.fee = {
  checkDuplicate: (req, res, next) => {},
  guardianFeeCreate: (req, res) => {
    try {
      Guardian.find({ school: req.body.school })
        .populate({
          path: "childs",
          match: {
            inActive: { $ne: true },
          },
        })
        .exec((err, guardian) => {
          if (guardian && guardian.length !== 0) {
            const data = guardian.map((guard) => {
              feeVouchers = guard.childs.map((item) => {
                const data =
                  req &&
                  req.body &&
                  req.body.month &&
                  sortByMonth(req.body.month).length &&
                  sortByMonth(req.body.month).map((mon) => {
                    StudentsFee.findOne({
                      student: item._id,
                      chargedMonth: mon,
                      session: item.session,
                    }).exec(async (err, fee) => {
                      if (fee) return { err: "fee voucher is avaialable" };
                      else {
                        const addCharges = await AddCharges.find({
                          $and: [
                            {
                              $or: [
                                { class: item.class },
                                { section: item.section },
                                { school: item.school },
                                { student: item.admissionNo },
                              ],
                            },
                            {
                              month: mon,
                            },
                          ],
                        });
                        let charge = 0;
                        addCharges &&
                          addCharges.length &&
                          addCharges.map((item) => {
                            item &&
                              item.charges &&
                              item.charges.length &&
                              item.charges.map((data) => {
                                Object.keys(data) &&
                                  Object.keys(data).length &&
                                  Object.keys(data).map((name) => {
                                    charge = charge + +data[name];
                                  });
                              });
                          });
                        const stdFee = new StudentsFee({
                          familyNo: guard.regNum,
                          dueDate: req.body.dueDate,
                          afterDueDate: req.body.afterDueDate,
                          note: req.body.note,
                          student: item._id,
                          session: item.session,
                          otherCharges: addCharges,
                          chargedMonth: mon,
                          basicFee:
                            item.feeData && item.feeData.discount
                              ? item.feeData.fee -
                                (item.feeData.fee * item.feeData.discount) / 100
                              : item.feeData.fee,
                          due:
                            (item.feeData && item.feeData.discount
                              ? item.feeData.fee -
                                (item.feeData.fee * item.feeData.discount) /
                                  100 +
                                charge
                              : item.feeData.fee) + charge,
                        });
                        return stdFee.save();
                      }
                    });
                  });
                return Promise.allSettled(data);
              });
              return Promise.allSettled(feeVouchers);
            });
            Promise.allSettled(data).then(async (data) => {
              const month = await Month.findById(req.body.changeStatusfor);
              req.body.month &&
                req.body.month.map((mon) => {
                  month.month[mon] = true;
                });
              Promise.allSettled([month.save()]).then((data) => {
                res.json(data);
              });
            });
          } else {
            return res.status(400).json("no guardian found");
          }
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getGuardianWiseFee: (req, res) => {
    try {
      if (req.body.month.length) {
        Guardian.find({ school: req.body.school }).exec((err, guards) => {
          if (err) return res.status(400).json(err);
          else {
            const vouchers = guards.map((guard) => {
              const data = guard.childs.map((std) => {
                return StudentsFee.find({
                  $and: [
                    { familyNo: guard.regNum },
                    { student: std._id },
                    {
                      $or: [
                        ...req.body.month.map((item) => {
                          return { chargedMonth: item };
                        }),
                      ],
                    },
                  ],
                }).populate([
                  {
                    path: "student",
                    populate: [
                      {
                        path: "class",
                        select: "name",
                      },
                      {
                        path: "session",
                        select: "duration",
                      },
                    ],
                    select:
                      "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                  },
                  {
                    path: "otherCharges",
                  },
                ]);
              });
              return Promise.allSettled(data);
            });
            Promise.allSettled(vouchers).then((data) => res.json(data));
          }
        });
      } else {
        return res.status(400).json({ err: "plese add month" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getGuardianWiseFeeMW: (req, res, next) => {
    try {
      if (req.body.month.length) {
        Guardian.find({ school: req.body.school }).exec((err, guards) => {
          if (err) return res.status(400).json(err);
          else {
            const vouchers = guards.map((guard) => {
              const data = guard.childs.map((std) => {
                return StudentsFee.find({
                  $and: [
                    { familyNo: guard.regNum },
                    { student: std._id },
                    {
                      $or: [
                        ...req.body.month.map((item) => {
                          return { chargedMonth: item };
                        }),
                      ],
                    },
                  ],
                }).populate([
                  {
                    path: "student",
                    populate: [
                      {
                        path: "class",
                        select: "name",
                      },
                      {
                        path: "session",
                        select: "duration",
                      },
                    ],
                    select:
                      "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                  },
                  {
                    path: "otherCharges",
                  },
                ]);
              });
              return Promise.allSettled(data);
            });
            Promise.allSettled(vouchers)
              .then((data) => {
                req.vouchers = data;
                next();
              })
              .catch((err) => {
                res.status(400).json({
                  err: "could not get vouchers form the database",
                  more: err,
                });
              });
          }
        });
      } else {
        return res.status(400).json({ err: "plese add month" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleGuardianWiseFee: (req, res) => {
    try {
      if (req.body.month.length) {
        Guardian.find({ regNum: req && req.body && req.body.regNum }).exec(
          (err, guards) => {
            if (err) {
              return res.status(400).json(err);
            } else if (guards.length == 0) {
              return res.status(400).json("Invalid RegNo.");
            } else {
              const vouchers = guards.map((guard) => {
                const data = guard.childs.map((std) => {
                  return StudentsFee.find({
                    $and: [
                      { familyNo: guard.regNum },
                      { student: std._id },
                      {
                        $or: [
                          ...req.body.month.map((item) => {
                            return { chargedMonth: item };
                          }),
                        ],
                      },
                    ],
                  }).populate([
                    {
                      path: "student",
                      populate: [
                        {
                          path: "class",
                          select: "name",
                        },
                        {
                          path: "session",
                          select: "duration",
                        },
                      ],
                      select:
                        "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                    },
                    {
                      path: "otherCharges",
                    },
                  ]);
                });
                return Promise.allSettled(data);
              });
              Promise.allSettled(vouchers).then((data) => {
                res.json(data);
                console.log(data);
              });
            }
          }
        );
      } else {
        return res.status(400).json({ err: "plese add month" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  getStudentFeeVoucher: (req, res) => {
    try {
      if (req.body.month.length) {
        Student.find({ school: req.body.school, inActive: { $ne: true } }).exec(
          (err, students) => {
            if (err) return res.status(400).json(err);
            else {
              const vouchers = students.map((std) => {
                return StudentsFee.find({
                  $and: [
                    { student: std._id },
                    {
                      $or: [
                        ...req.body.month.map((item) => {
                          return { chargedMonth: item };
                        }),
                      ],
                    },
                  ],
                }).populate([
                  {
                    path: "student",
                    populate: [
                      {
                        path: "class",
                        select: "name",
                      },
                      {
                        path: "session",
                        select: "duration",
                      },
                    ],
                    select:
                      "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                  },
                  {
                    path: "otherCharges",
                  },
                ]);
              });
              Promise.allSettled(vouchers).then((data) => res.json(data));
            }
          }
        );
      } else {
        return res.status(400).json({ err: "month array is requied" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleStudentFeeVoucher: (req, res) => {
    try {
      if (req.body.month.length) {
        Student.find({
          admissionNo: req && req.body && req.body.admissionNo,
          inActive: { $ne: true },
        }).exec((err, students) => {
          if (err) {
            return res.status(400).json(err);
          } else if (students.length == 0) {
            return res.status(400).json("Invalid RegNo.");
          } else {
            const vouchers = students.map((std) => {
              return StudentsFee.find({
                $and: [
                  { student: std._id },
                  {
                    $or: [
                      ...req.body.month.map((item) => {
                        return { chargedMonth: item };
                      }),
                    ],
                  },
                ],
              }).populate([
                {
                  path: "student",
                  populate: [
                    {
                      path: "class",
                      select: "name",
                    },
                    {
                      path: "session",
                      select: "duration",
                    },
                  ],
                  select:
                    "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                },
                {
                  path: "otherCharges",
                },
              ]);
            });
            Promise.allSettled(vouchers).then((data) => res.json(data));
          }
        });
      } else {
        return res.status(400).json({ err: "month array is requied" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentFeeVoucherMW: (req, res, next) => {
    try {
      if (req.body.month.length) {
        Student.find({ school: req.body.school, inActive: { $ne: true } }).exec(
          (err, students) => {
            if (err) return res.status(400).json(err);
            else {
              const vouchers = students.map((std) => {
                return StudentsFee.find({
                  $and: [
                    { student: std._id },
                    {
                      $or: [
                        ...req.body.month.map((item) => {
                          return { chargedMonth: item };
                        }),
                      ],
                    },
                  ],
                }).populate([
                  {
                    path: "student",
                    populate: [
                      {
                        path: "class",
                        select: "name",
                      },
                      {
                        path: "session",
                        select: "duration",
                      },
                    ],
                    select:
                      "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                  },
                  {
                    path: "otherCharges",
                  },
                ]);
              });
              Promise.allSettled(vouchers)
                .then((data) => {
                  req.voucher = data;
                  next();
                })
                .catch((err) => {
                  res.status(400).json({
                    err: "could not get the data from database",
                    more: err,
                  });
                });
            }
          }
        );
      } else {
        return res.status(400).json({ err: "month array is requied" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getGuardianWiseFeeVocher: (req, res) => {
    try {
      if (req.body.month.length) {
        Guardian.findOne({
          regNum: req.body.guardian,
          school: req.body.school,
        }).exec((err, guard) => {
          if (err) return res.status(400).json(err);
          else {
            const data = guard.childs.map((std) => {
              return StudentsFee.find({
                $and: [
                  { familyNo: guard.regNum },
                  { student: std._id },
                  {
                    $or: [
                      ...req.body.month.map((item) => {
                        return { chargedMonth: item };
                      }),
                    ],
                  },
                ],
              });
            });
            Promise.allSettled(data).then((data) => res.json(data));
          }
        });
      } else {
        return res.status(400).json({ err: "plese add month" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updatedFeeVouchers: (req, res) => {
    if (req.body.feeVouchers.length) return res.status(400).json(err);
  },
  getFeeFromClass: (req, res) => {
    StudentsFee.find({ month: req.body.month });
  },
  getStudentFeeVoucherByRegNo: (req, res) => {
    try {
      StudentsFee.find({
        $and: [
          { student: req.studentId },
          {
            $or: [
              ...(req.body &&
                req.body.month &&
                req.body.month.length &&
                req.body.month.map((month) => {
                  return { chargedMonth: month };
                })),
            ],
          },
        ],
      })
        .populate([
          { path: "otherCharges" },
          {
            path: "session",
            select: "duration",
          },
          {
            path: "student",
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
            select:
              "stdName parentsInfo.father.cnic parentsInfo.father.name rollNo",
          },
        ])
        .exec((err, voucher) => {
          if (err) return res.status(400).json(err);
          else res.json(voucher);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getGuardianFeeVoucherByRegNo: (req, res) => {
    try {
      StudentsFee.find({
        familyNo: req.body.regNum,
        session: req.body.session,
      })
        .populate([
          { path: "otherCharges" },
          {
            path: "session",
            select: "duration",
          },
          {
            path: "student",
            populate: [
              {
                path: "class",
                select: "name",
              },
              {
                path: "section",
                select: "name",
              },
              {
                path: "session",
                select: "duration",
              },
            ],
            select:
              "stdName rollNo parentsInfo.father.cnic parentsInfo.father.name admissionNo",
          },
        ])
        .exec((err, voucher) => {
          if (err) return res.status(400).json(err);
          else res.json(voucher);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateFee: (req, res) => {
    try {
      if (req && req.body && req.body.amount) {
        if (+req.body.amount >= req.body.due) {
          req.body.paid = true;
        } else if (+req.body.amount < req.body.due) {
          req.body.paid = true;
          req.body.partiallyPaid = true;
          req.Arrears = req.body.due - req.body.amount;
        } else {
          return res.status(400).json(err);
        }
      }
      StudentsFee.findOneAndUpdate(
        { _id: req.body._id },
        { $set: req.body },
        { new: true, userFindAndModify: true },
        (err, voucher) => {
          if (err) return res.status(400).json(err);
          IntermsOf.findOne({ name: "studentFee" }).exec((err, obj) => {
            if (err) return res.status(400).json(err);
            else {
              const transaction = new Transaction({
                session: req.body.session._id,
                transactionType: "income",
                inTermsOf: obj && obj._id,
                amount: +req.body.amount,
                voucherNo: req.body._id,
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
          });
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentFee: (req, res) => {
    try {
      Student.findOne({
        admissionNo: req.body.regNum,
        school: req.body.school,
        session: req.body.session,
        inActive: { $ne: true },
      }).exec((err, student) => {
        if (err) return res.status(400).json(err);
        else {
          StudentsFee.find({
            student: student && student._id,
            session: req.body.session,
          })
            .populate([
              {
                path: "student",
                populate: [
                  {
                    path: "class",
                    select: "name",
                  },
                  {
                    path: "session",
                    select: "duration",
                  },
                ],
                select:
                  "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
              },
              {
                path: "otherCharges",
              },
            ])
            .exec((err, studentFee) => {
              if (err) return res.status(400).json(err);
              else return res.json(studentFee);
            });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  testFeeGetForOneStudent: async (req, res) => {
    try {
      const resp = await StudentsFee.find({ familyNo: "GFNG-126" }).populate(
        "otherCharges",
        "charges -_id"
      );

      res.json(resp);
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  singleGuardianFeeCreate: (req, res) => {
    try {
      Guardian.find({
        regNum: req && req.body && req.body.regNum,
      })
        .populate({
          path: "childs",
          match: {
            inActive: { $ne: true },
          },
        })
        .exec((err, guardian) => {
          if (guardian && guardian.length !== 0) {
            const data = guardian.map((guard) => {
              feeVouchers = guard.childs.map((item) => {
                const data =
                  req.body.month &&
                  req.body.month.map((mon) => {
                    StudentsFee.findOne({
                      student: item._id,
                      chargedMonth: mon,
                      session: item.session,
                    }).exec(async (err, fee) => {
                      if (fee) return { err: "fee voucher is avaialable" };
                      else {
                        const addCharges = await AddCharges.find({
                          $and: [
                            {
                              $or: [
                                { class: item.class },
                                { section: item.section },
                                { school: item.school },
                                { student: item.admissionNo },
                              ],
                            },
                            {
                              month: mon,
                            },
                          ],
                        });
                        let charge = 0;
                        addCharges &&
                          addCharges.length &&
                          addCharges.map((item) => {
                            item &&
                              item.charges &&
                              item.charges.length &&
                              item.charges.map((data) => {
                                Object.keys(data) &&
                                  Object.keys(data).length &&
                                  Object.keys(data).map((name) => {
                                    charge = charge + +data[name];
                                  });
                              });
                          });
                        const stdFee = new StudentsFee({
                          familyNo: guard.regNum,
                          dueDate: req.body.dueDate,
                          afterDueDate: req.body.afterDueDate,
                          note: req.body.note,
                          student: item._id,
                          session: item.session,
                          otherCharges: addCharges,
                          chargedMonth: mon,
                          basicFee:
                            item.feeData && item.feeData.discount
                              ? item.feeData.fee -
                                (item.feeData.fee * item.feeData.discount) / 100
                              : item.feeData.fee,
                          due:
                            (item.feeData && item.feeData.discount
                              ? item.feeData.fee -
                                (item.feeData.fee * item.feeData.discount) /
                                  100 +
                                charge
                              : item.feeData.fee) + charge,
                        });
                        return stdFee.save();
                      }
                    });
                  });
                return Promise.allSettled(data);
              });
              return Promise.allSettled(feeVouchers);
            });
            Promise.allSettled(data).then(async (data) => {
              res.json(data);
            });
          } else {
            return res.status(400).json("no guardian found");
          }
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  creatSingleStudentFee: (req, res) => {
    try {
      Student.find({
        admissionNo: req && req.body && req.body.admissionNo,
        inActive: { $ne: true },
      })
        .populate([{ path: "guardian", select: "regNum" }])
        .select(
          "guardian feeData.fee feeData.discount feeData.lastVoucher session class section school admissionNo"
        )
        .exec((err, students) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const data =
              students &&
              students.length &&
              students.map(async (student) => {
                const data = await StudentsFee.find({
                  $and: [
                    { student: student._id },
                    {
                      $or: [
                        ...(req &&
                          req.body &&
                          req.body.month &&
                          req.body.month.map((mon) => ({
                            chargedMonth: mon,
                          }))),
                      ],
                    },
                    { session: student.session },
                  ],
                });
                if (data.length) {
                  return "Fee Vouchers Was Already Present";
                } else {
                  // new  Fee Voucher Calculation here
                  let remains = 0;
                  if (
                    student &&
                    student.feeData &&
                    student.feeData.lastVoucher
                  ) {
                    StudentsFee.findOne({
                      _id: student.feeData.lastVoucher,
                    }).exec(async (err, data) => {
                      logger.info({
                        studentData: student,
                        feeData: data,
                      });
                      console.log(student.admissionNo);
                      console.log(data);
                      const dueDate = new Date(data && data.dueDate).setHours(
                        0,
                        0,
                        0,
                        0
                      );
                      const afterDueDate = data && data.afterDueDate;
                      const paidAmount = data && data.paidAmount;
                      const paidDate =
                        data &&
                        data.paidDate !== null &&
                        typeof (data && data.paidDate) !== "undefined"
                          ? new Date(data && data.paidDate).setHours(0, 0, 0, 0)
                          : undefined;
                      const due = data && data.due;

                      if (
                        typeof paidDate === "undefined" ||
                        paidDate === null
                      ) {
                        remains =
                          typeof paidAmount === "undefined"
                            ? due + afterDueDate
                            : due + afterDueDate - paidAmount;
                      } else if (paidDate > dueDate) {
                        if (paidAmount < due + afterDueDate) {
                          remains = due + afterDueDate - paidAmount;
                        }
                      } else if (paidDate <= dueDate) {
                        if (paidAmount < due) {
                          remains = due + afterDueDate - paidAmount;
                        }
                      }
                      const addCharges = await AddCharges.find({
                        $and: [
                          {
                            $or: [
                              { class: student.class },
                              { section: student.section },
                              { school: student.school },
                              {
                                student: student.admissionNo,
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
                      let charge = 0;
                      addCharges &&
                        addCharges.length &&
                        addCharges.map((item) => {
                          item &&
                            item.charges &&
                            item.charges.length &&
                            item.charges.map((data) => {
                              Object.keys(data) &&
                                Object.keys(data).length &&
                                Object.keys(data).map((name) => {
                                  charge = charge + +data[name];
                                });
                            });
                        });
                      const stdFee = new StudentsFee({
                        familyNo:
                          student &&
                          student.guardian &&
                          student.guardian.regNum,
                        dueDate: req.body.dueDate,
                        afterDueDate: req.body.afterDueDate,
                        note: req.body.note,
                        student: student._id,
                        session: student.session,
                        arrears: remains,
                        otherCharges: addCharges,
                        chargedMonth: req.body.month.join(","),
                        basicFee: Math.round(
                          student.feeData && student.feeData.discount
                            ? student.feeData.fee -
                                (student.feeData.fee *
                                  student.feeData.discount) /
                                  100
                            : student.feeData.fee
                        ),
                        due: Math.round(
                          student.feeData && student.feeData.discount
                            ? (student.feeData.fee -
                                (student.feeData.fee *
                                  student.feeData.discount) /
                                  100) *
                                req.body.month.length +
                                charge +
                                remains
                            : student.feeData.fee * req.body.month.length +
                                charge +
                                remains
                        ),
                      });
                      data.disable = true;
                      student.feeData.lastVoucher = stdFee._id;
                      await data.save();
                      await student.save();
                      return stdFee.save();
                    });
                  } else {
                    let remains = 0;
                    const addCharges = await AddCharges.find({
                      $and: [
                        {
                          $or: [
                            { class: student.class },
                            { section: student.section },
                            { school: student.school },
                            {
                              student: student.admissionNo,
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
                    let charge = 0;
                    addCharges &&
                      addCharges.length &&
                      addCharges.map((item) => {
                        item &&
                          item.charges &&
                          item.charges.length &&
                          item.charges.map((data) => {
                            Object.keys(data) &&
                              Object.keys(data).length &&
                              Object.keys(data).map((name) => {
                                charge = charge + +data[name];
                              });
                          });
                      });
                    const stdFee = new StudentsFee({
                      familyNo:
                        student && student.guardian && student.guardian.regNum,
                      dueDate: req.body.dueDate,
                      afterDueDate: req.body.afterDueDate,
                      note: req.body.note,
                      student: student._id,
                      session: student.session,
                      arrears: remains,
                      otherCharges: addCharges,
                      chargedMonth: req.body.month.join(","),
                      basicFee: Math.round(
                        student.feeData && student.feeData.discount
                          ? student.feeData.fee -
                              (student.feeData.fee * student.feeData.discount) /
                                100
                          : student.feeData.fee
                      ),
                      due: Math.round(
                        student.feeData && student.feeData.discount
                          ? (student.feeData.fee -
                              (student.feeData.fee * student.feeData.discount) /
                                100) *
                              req.body.month.length +
                              charge
                          : student.feeData.fee * req.body.month.length + charge
                      ),
                    });
                    student.feeData.lastVoucher = stdFee._id;
                    await student.save();
                    return stdFee.save();
                  }
                }
              });
            Promise.allSettled(data).then(async (data) => {
              // const month = await Month.findOne({
              //   session: req.body.session,
              // });
              // req.body.month &&
              //   req.body.month.map((mon) => {
              //     month.month[mon] = true;
              //   });
              // await month.save();
              // const receiveMonth = await ReceiveMonth.findOne({
              //   session: req.body.session,
              // });
              // receiveMonth &&
              //   receiveMonth.voucher &&
              //   receiveMonth.voucher.push(req.body.month.join());
              // await receiveMonth.save();
              res.json(data);
              return;
            });
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  createNewMonthFee: (req, res) => {
    try {
      Student.find({
        school: req && req.body && req.body.school,
        inActive: { $ne: true },
      })
        .populate([{ path: "guardian", select: "regNum" }])
        .select(
          "guardian feeData.fee feeData.discount feeData.lastVoucher session class section school admissionNo"
        )
        .exec((err, students) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const data =
              students &&
              students.length &&
              students.map(async (student) => {
                const data = await StudentsFee.find({
                  $and: [
                    { student: student._id },
                    {
                      $or: [
                        ...(req &&
                          req.body &&
                          req.body.month &&
                          req.body.month.map((mon) => ({
                            chargedMonth: mon,
                          }))),
                      ],
                    },
                    { session: student.session },
                  ],
                });
                if (data.length) {
                  return "Fee Vouchers Was Already Present";
                } else {
                  // new  Fee Voucher Calculation here
                  let remains = 0;
                  if (
                    student &&
                    student.feeData &&
                    student.feeData.lastVoucher
                  ) {
                    StudentsFee.findOne({
                      _id: student.feeData.lastVoucher,
                    }).exec(async (err, data) => {
                      // logger.info({
                      //   studentData: student,
                      //   feeData: data,
                      // });
                      console.log(student.admissionNo);
                      console.log(data.disable);
                      const dueDate = new Date(data && data.dueDate).setHours(
                        0,
                        0,
                        0,
                        0
                      );
                      const afterDueDate = data && data.afterDueDate;
                      const paidAmount = data && data.paidAmount;
                      const paidDate =
                        data &&
                        data.paidDate !== null &&
                        typeof (data && data.paidDate) !== "undefined"
                          ? new Date(data && data.paidDate).setHours(0, 0, 0, 0)
                          : undefined;
                      const due = data && data.due;

                      if (
                        typeof paidDate === "undefined" ||
                        paidDate === null
                      ) {
                        remains =
                          typeof paidAmount === "undefined"
                            ? due + afterDueDate
                            : due + afterDueDate - paidAmount;
                      } else if (paidDate > dueDate) {
                        if (paidAmount < due + afterDueDate) {
                          remains = due + afterDueDate - paidAmount;
                        }
                      } else if (paidDate <= dueDate) {
                        if (paidAmount < due) {
                          remains = due + afterDueDate - paidAmount;
                        }
                      }
                      const addCharges = await AddCharges.find({
                        $and: [
                          {
                            $or: [
                              { class: student.class },
                              { section: student.section },
                              { school: student.school },
                              {
                                student: student.admissionNo,
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
                      let charge = 0;
                      addCharges &&
                        addCharges.length &&
                        addCharges.map((item) => {
                          item &&
                            item.charges &&
                            item.charges.length &&
                            item.charges.map((data) => {
                              Object.keys(data) &&
                                Object.keys(data).length &&
                                Object.keys(data).map((name) => {
                                  charge = charge + +data[name];
                                });
                            });
                        });
                      const stdFee = new StudentsFee({
                        familyNo:
                          student &&
                          student.guardian &&
                          student.guardian.regNum,
                        dueDate: req.body.dueDate,
                        afterDueDate: req.body.afterDueDate,
                        note: req.body.note,
                        student: student._id,
                        session: student.session,
                        arrears: remains,
                        otherCharges: addCharges,
                        chargedMonth: req.body.month.join(","),
                        basicFee: Math.round(
                          student.feeData && student.feeData.discount
                            ? student.feeData.fee -
                                (student.feeData.fee *
                                  student.feeData.discount) /
                                  100
                            : student.feeData.fee
                        ),
                        due: Math.round(
                          student.feeData && student.feeData.discount
                            ? (student.feeData.fee -
                                (student.feeData.fee *
                                  student.feeData.discount) /
                                  100) *
                                req.body.month.length +
                                charge +
                                remains
                            : student.feeData.fee * req.body.month.length +
                                charge +
                                remains
                        ),
                      });
                      data.disable = true;
                      student.feeData.lastVoucher = stdFee._id;
                      await data.save();
                      await student.save();
                      return stdFee.save();
                    });
                  } else {
                    let remains = 0;
                    const addCharges = await AddCharges.find({
                      $and: [
                        {
                          $or: [
                            { class: student.class },
                            { section: student.section },
                            { school: student.school },
                            {
                              student: student.admissionNo,
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
                    let charge = 0;
                    addCharges &&
                      addCharges.length &&
                      addCharges.map((item) => {
                        item &&
                          item.charges &&
                          item.charges.length &&
                          item.charges.map((data) => {
                            Object.keys(data) &&
                              Object.keys(data).length &&
                              Object.keys(data).map((name) => {
                                charge = charge + +data[name];
                              });
                          });
                      });
                    const stdFee = new StudentsFee({
                      familyNo:
                        student && student.guardian && student.guardian.regNum,
                      dueDate: req.body.dueDate,
                      afterDueDate: req.body.afterDueDate,
                      note: req.body.note,
                      student: student._id,
                      session: student.session,
                      arrears: remains,
                      otherCharges: addCharges,
                      chargedMonth: req.body.month.join(","),
                      basicFee: Math.round(
                        student.feeData && student.feeData.discount
                          ? student.feeData.fee -
                              (student.feeData.fee * student.feeData.discount) /
                                100
                          : student.feeData.fee
                      ),
                      due: Math.round(
                        student.feeData && student.feeData.discount
                          ? (student.feeData.fee -
                              (student.feeData.fee * student.feeData.discount) /
                                100) *
                              req.body.month.length +
                              charge
                          : student.feeData.fee * req.body.month.length + charge
                      ),
                    });
                    student.feeData.lastVoucher = stdFee._id;
                    await student.save();
                    return stdFee.save();
                  }
                }
              });
            Promise.allSettled(data).then(async (data) => {
              const month = await Month.findOne({
                session: req.body.session,
              });
              req.body.month &&
                req.body.month.map((mon) => {
                  month.month[mon] = true;
                });
              await month.save();
              const receiveMonth = await ReceiveMonth.findOne({
                session: req.body.session,
              });
              receiveMonth &&
                receiveMonth.voucher &&
                receiveMonth.voucher.push(req.body.month.join());
              await receiveMonth.save();
              res.json(data);
              return;
            });
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getStudentMonthByFee: (req, res) => {
    try {
      StudentsFee.find({ student: req.studentId })
        .select("chargedMonth id")
        .exec((err, obj) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(obj);
            return;
          }
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsPaidFeeBySchool: async (req, res, id) => {
    try {
      const student = await Student.find({
        school: req.body.schoolId,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        if (req.body.month !== undefined) {
          const feeData = await StudentsFee.findOne({
            paid: true,
            chargedMonth: req.body.month,
            student: std._id.toString(),
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        } else {
          const feeData = await StudentsFee.findOne({
            paid: true,
            student: std._id.toString(),
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsUnPaidFeeBySchool: async (req, res, id) => {
    try {
      const student = await Student.find({
        school: req.body.schoolId,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        if (req.body.month !== undefined) {
          const feeData = await StudentsFee.findOne({
            paid: false,
            chargedMonth: req.body.month,
            student: std._id,
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        } else {
          const feeData = await StudentsFee.findOne({
            paid: false,
            student: std._id,
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsPaidFeeByClass: async (req, res) => {
    try {
      const student = await Student.find({
        class: req.body.classId,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        if (req.body.month !== undefined) {
          const feeData = await StudentsFee.findOne({
            paid: true,
            chargedMonth: req.body.month,
            student: std._id.toString(),
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        } else {
          const feeData = await StudentsFee.findOne({
            paid: true,
            student: std._id.toString(),
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsPaidFeeBySection: async (req, res) => {
    try {
      const student = await Student.find({
        section: req.body.section,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        if (req.body.month !== undefined) {
          const feeData = await StudentsFee.findOne({
            paid: true,
            chargedMonth: req.body.month,
            student: std._id.toString(),
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        } else {
          const feeData = await StudentsFee.findOne({
            paid: true,
            student: std._id.toString(),
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsUnpaidFeeByClass: async (req, res) => {
    try {
      const student = await Student.find({
        class: req.body.classId,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        if (req.body.month !== undefined) {
          const feeData = await StudentsFee.findOne({
            paid: false,
            chargedMonth: req.body.month,
            student: std._id,
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        } else {
          const feeData = await StudentsFee.findOne({
            paid: false,
            student: std._id,
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsUnpaidFeeBySection: async (req, res) => {
    try {
      const student = await Student.find({
        section: req.body.section,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        if (req.body.month !== undefined) {
          const feeData = await StudentsFee.findOne({
            student: std._id,
            chargedMonth: req.body.month,
            paid: false,
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        } else {
          const feeData = await StudentsFee.findOne({
            student: std._id,
            paid: false,
          }).populate({
            path: "student",
            populate: {
              path: "class section",
              select: "name",
            },
          });
          return feeData;
        }
      });
      Promise.all(data).then(async (data) => {
        await res.json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsPaidFeeByDate: (req, res) => {
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
      StudentsFee.find(query)
        .populate("student")
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
  getSingleStudentFeeVoucherMW: (req, res, next) => {
    try {
      if (req.body.month.length) {
        Student.find({
          admissionNo: req && req.body && req.body.admissionNo,
          inActive: { $ne: true },
        }).exec((err, students) => {
          if (err) {
            return res.status(400).json(err);
          } else if (students.length == 0) {
            return res.status(400).json("Invalid RegNo.");
          } else {
            const vouchers = students.map((std) => {
              return StudentsFee.find({
                $and: [
                  { student: std._id },
                  {
                    $or: [
                      ...req.body.month.map((item) => {
                        return { chargedMonth: item };
                      }),
                    ],
                  },
                ],
              }).populate([
                {
                  path: "student",
                  populate: [
                    {
                      path: "class",
                      select: "name",
                    },
                    {
                      path: "session",
                      select: "duration",
                    },
                  ],
                  select:
                    "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                },
                {
                  path: "otherCharges",
                },
              ]);
            });
            Promise.allSettled(vouchers).then((data) => {
              console.log(data);
              req.singleStudentFeeData = data;
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
  getSingleGuardianWiseFeeMW: (req, res, next) => {
    try {
      if (req.body.month.length) {
        Guardian.find({ regNum: req && req.body && req.body.regNum }).exec(
          (err, guards) => {
            if (err) {
              return res.status(400).json(err);
            } else if (guards.length == 0) {
              return res.status(400).json("Invalid RegNo.");
            } else {
              const vouchers = guards.map((guard) => {
                const data = guard.childs.map((std) => {
                  return StudentsFee.find({
                    $and: [
                      { familyNo: guard.regNum },
                      { student: std._id },
                      {
                        $or: [
                          ...req.body.month.map((item) => {
                            return { chargedMonth: item };
                          }),
                        ],
                      },
                    ],
                  }).populate([
                    {
                      path: "student",
                      populate: [
                        {
                          path: "class",
                          select: "name",
                        },
                        {
                          path: "session",
                          select: "duration",
                        },
                      ],
                      select:
                        "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
                    },
                    {
                      path: "otherCharges",
                    },
                  ]);
                });
                return Promise.allSettled(data);
              });
              Promise.allSettled(vouchers).then((data) => {
                console.log(data);
                req.singleGuardVoucher = data;
                next();
              });
            }
          }
        );
      } else {
        return res.status(400).json({ err: "plese add month" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleStudentFee: (req, res) => {
    try {
      Student.findOne({
        admissionNo: req.body.regNum,
        inActive: { $ne: true },
      }).exec((err, student) => {
        if (err) return res.status(400).json(err);
        else {
          StudentsFee.find({
            student: student && student._id,
          })
            .populate([
              {
                path: "student",
                populate: [
                  {
                    path: "class",
                    select: "name",
                  },
                  {
                    path: "session",
                    select: "duration",
                  },
                ],
                select:
                  "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
              },
              {
                path: "otherCharges",
              },
            ])
            .exec((err, studentFee) => {
              if (err) return res.status(400).json(err);
              else return res.json(studentFee);
            });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  reverseStudentFee: (req, res) => {
    try {
      Student.find({ school: req.body.school, inActive: { $ne: true } }).exec(
        (err, students) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const newStudents = students.map(async (student) => {
              const fee = await StudentsFee.findOne({
                student: student._id,
                chargedMonth: "oct",
              });
              student.feeData.lastVoucher = (fee && fee._id) || undefined;
              return student.save();
            });
            Promise.allSettled(newStudents).then((data) => res.json(data));
          }
        }
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getFeeVoucherForDelete: (req, res, next) => {
    try {
      StudentsFee.findOne({ _id: req.body.voucher }).exec((err, fee) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          if ((fee && fee.paid) || (fee && fee.partiallyPaid)) {
            res.status(400).json({ err: "fee is already paid" });
            return;
          } else {
            const charMon = fee.chargedMonth.split(",");
            StudentsFee.findOne({
              student: fee.student,
              session: fee.session,
              chargedMonth:
                months.indexOf(charMon[0]) == 0
                  ? months[months.indexOf(charMon[0]) + 11]
                  : months[months.indexOf(charMon[0]) - 1],
            }).exec(async (err, result) => {
              if (err) {
                res.status(400).json(err);
                return;
              } else if (result == null || undefined) {
                const std = Student.findById(result.student);
                std.feeData.lastVoucher = null;
                std.save();
                next();
              } else {
                const std = await Student.findById(result.student);
                std.feeData.lastVoucher = result._id;
                std.save();
                next();
              }
            });
          }
        }
      });
    } catch (err) {
      res.status(500);
    }
  },
  deleteFeeVoucher: (req, res, next) => {
    try {
      StudentsFee.findByIdAndDelete({ _id: req.body.voucher }).exec(
        (err, result) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(result);
          }
        }
      );
    } catch (err) {
      res.status(500);
    }
  },
  getStudentsFeeBySchool: async (req, res, id) => {
    try {
      const student = await Student.find({
        school: req.body.schoolId,
        session: req.body.session,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        const feeData = await StudentsFee.find({
          student: std._id.toString(),
        });
        if (feeData !== null) {
          const feeDataByMonth = feeData.map((dataByMonth) => {
            return {
              due: dataByMonth.due,
              chargedMonth: dataByMonth.chargedMonth,
            };
          });
          return Promise.allSettled(feeDataByMonth);
        }
      });
      Promise.all(data).then(async (data) => {
        let updateData = data.filter((upData) => {
          if (data !== undefined) {
            return upData;
          }
        });
        let merged = [];
        updateData.forEach(function (sourceRow) {
          sourceRow.map((data1) => {
            if (
              !merged.some(function (row) {
                return row.chargedMonth == data1.value.chargedMonth;
              })
            ) {
              merged.push({
                chargedMonth: data1.value.chargedMonth,
                due: data1.value.due,
              });
            } else {
              let targetRow = merged.filter(function (targetRow) {
                return targetRow.chargedMonth == data1.value.chargedMonth;
              })[0];
              targetRow.due += data1.value.due;
            }
          });
        });

        // let amount;
        // let newData = data.map((val, i) => {
        //   if (i == 0) {
        //     amount = val;
        //   } else {
        //     amount = amount + val;
        //   }
        //   return amount;
        // });
        res.json(merged);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsPaidFeeAmount: async (req, res, id) => {
    try {
      const student = await Student.find({
        school: req.body.schoolId,
        session: req.body.session,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        const feeData = await StudentsFee.find({
          student: std._id.toString(),
          paid: true,
        });
        if (feeData !== null) {
          const feeDataByMonth = feeData.map((dataByMonth) => {
            return {
              due: dataByMonth.due,
              chargedMonth: dataByMonth.chargedMonth,
            };
          });
          return Promise.allSettled(feeDataByMonth);
        }
      });
      Promise.all(data).then(async (data) => {
        let updateData = data.filter((upData) => {
          if (data !== undefined) {
            return upData;
          }
        });
        let merged = [];
        updateData.forEach(function (sourceRow) {
          sourceRow.map((data1) => {
            if (
              !merged.some(function (row) {
                return row.chargedMonth == data1.value.chargedMonth;
              })
            ) {
              merged.push({
                chargedMonth: data1.value.chargedMonth,
                due: data1.value.due,
              });
            } else {
              let targetRow = merged.filter(function (targetRow) {
                return targetRow.chargedMonth == data1.value.chargedMonth;
              })[0];
              targetRow.due += data1.value.due;
            }
          });
        });
        // let newData = updateData.map((val, i) => {
        //   if (i == 0) {
        //     amount = val;
        //   } else {
        //     amount = amount + val;
        //   }
        //   return amount;
        // });
        res.json(merged);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getStudentsUnpaidFeeAmount: async (req, res, id) => {
    try {
      const student = await Student.find({
        school: req.body.schoolId,
        session: req.body.session,
        inActive: { $ne: true },
      });
      const data = student.map(async (std) => {
        const feeData = await StudentsFee.find({
          student: std._id.toString(),
          paid: false,
        });
        if (feeData !== null) {
          const feeDataByMonth = feeData.map((dataByMonth) => {
            return {
              due: dataByMonth.due,
              chargedMonth: dataByMonth.chargedMonth,
            };
          });
          return Promise.allSettled(feeDataByMonth);
        }
      });
      Promise.all(data).then(async (data) => {
        let updateData = data.filter((upData) => {
          if (data !== undefined) {
            return upData;
          }
        });
        let merged = [];
        updateData.forEach(function (sourceRow) {
          sourceRow.map((data1) => {
            if (
              !merged.some(function (row) {
                return row.chargedMonth == data1.value.chargedMonth;
              })
            ) {
              merged.push({
                chargedMonth: data1.value.chargedMonth,
                due: data1.value.due,
              });
            } else {
              let targetRow = merged.filter(function (targetRow) {
                return targetRow.chargedMonth == data1.value.chargedMonth;
              })[0];
              targetRow.due += data1.value.due;
            }
          });
        });
        // let newData = updateData.map((val, i) => {
        //   if (i == 0) {
        //     amount = val;
        //   } else {
        //     amount = amount + val;
        //   }
        //   return amount;
        // });
        res.json(merged);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // classFees: (req, res) => {
  //   Class.find({ school: req.body.schoolId }).exec((err, classData) => {
  //     const graphData = classData.map(async (classes) => {
  //       const obj = await Student.find({
  //         class: classes._id,
  //         inActive: { $ne: true },
  //       });
  //       const arr = obj.map(async (data) => {
  //         const feeData = await StudentsFee.findOne({
  //           student: data._id.toString(),
  //         });
  //         if (feeData !== null) {
  //           return {
  //             due: feeData.due,
  //             paid: feeData.paid,
  //             partiallyPaid: feeData.partiallyPaid,
  //           };
  //         }
  //       });
  //       return Promise.allSettled(arr);
  //     });
  //     Promise.allSettled(graphData).then((data) => {
  //       let totalFee = [];
  //       let totalPaidFee = [];
  //       let totalUnpaidFee = [];
  //       let totalAmount = 0;
  //       let unPaidAmount = 0;
  //       let paidAmount = 0;
  //       data.map((val) => {
  //         val.value.map((valueOfFee, i) => {
  //           if (i == 0) {
  //             totalAmount = valueOfFee.value.due;
  //           } else {
  //             totalAmount = totalAmount + valueOfFee.value.due;
  //           }
  //           if (i == val.value.length - 1) {
  //             totalFee.push(totalAmount);
  //           }
  //         });
  //       });
  //       data.map((val) => {
  //         val.value.map((valueOfFee, i) => {
  //           if (
  //             valueOfFee.value.paid == true ||
  //             valueOfFee.value.partiallyPaid == true
  //           ) {
  //             paidAmount = valueOfFee.value.due;
  //           } else if (
  //             valueOfFee.value.paid == true ||
  //             valueOfFee.value.partiallyPaid == true
  //           ) {
  //             paidAmount = paidAmount + valueOfFee.value.due;
  //           }
  //           if (i == val.value.length - 1) {
  //             totalPaidFee.push(paidAmount);
  //           }
  //         });
  //       });
  //       data.map((val) => {
  //         val.value.map((valueOfFee, i) => {
  //           if (valueOfFee.value.paid == false) {
  //             unPaidAmount = valueOfFee.value.due;
  //           } else if (valueOfFee.value.paid == false) {
  //             unPaidAmount = unPaidAmount + valueOfFee.value.due;
  //           }
  //           if (i == val.value.length - 1) {
  //             totalUnpaidFee.push(unPaidAmount);
  //           }
  //         });
  //       });
  //       res.json({
  //         totalAmount: totalFee,
  //         paidAmount: totalPaidFee,
  //         unPaidAmount: totalUnpaidFee,
  //       });
  //     });
  //   });
  // },

  newClassFee: (req, res) => {
    try {
      const classData = [];
      Class.find({ school: req.body.school, session: req.body.session })
        .select("_id name")
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const newData =
              data &&
              data.map(async (item) => {
                const students = await Student.find({ class: item._id }).select(
                  "_id"
                );
                if (Array.isArray(students) && students.length) {
                  const newStudent = students.map(async (student) =>
                    StudentsFee.findOne({
                      student: student._id.toString(),
                      chargedMonth: req.body.month,
                    }).select("-_id paid amount due")
                  );
                  return {
                    student: await Promise.all(newStudent),
                    classData: item,
                  };
                }
              });
            Promise.all(newData)
              .then((data) => res.json(data))
              .catch((err) => {
                res.status(400).json(err);
                return;
              });
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getStudentsFeeByGuardian: (req, res) => {
    try {
      Student.findOne({
        _id: req.params.studentId,
        inActive: { $ne: true },
      }).exec((err, student) => {
        if (err) return res.status(400).json(err);
        else {
          StudentsFee.find({
            student: student && student._id,
          })
            .populate([
              {
                path: "student",
                populate: [
                  {
                    path: "class",
                    select: "name",
                  },
                  {
                    path: "session",
                    select: "duration",
                  },
                ],
                select:
                  "parentsInfo.father.name parentsInfo.father.cnic class duration admissionNo stdName",
              },
              {
                path: "otherCharges",
              },
            ])
            .exec((err, studentFee) => {
              if (err) return res.status(400).json(err);
              else return res.json(studentFee);
            });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
