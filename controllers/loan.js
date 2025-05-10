const Loan = require("../modals/loan");
const Staff = require("../modals/staff");
const LoanHistory = require("../modals/loanHistory");
exports.loan = {
  create: async (req, res) => {
    try {
      const staff = await Staff.findOne({
        regNum: req.body.regNum,
        inActive: { $ne: true },
      });
      if (staff !== null) {
        const loan = await Loan.findOne({ staffId: staff._id });
        if (loan !== null) {
          const newLoanHistory = new LoanHistory(req.body);
          newLoanHistory.save();
          Loan.findOneAndUpdate(
            {
              staffId: staff._id,
            },
            {
              $set: {
                session: req.body.session,
                remaining: +loan.remaining + +req.body.remaining,
                active: req.body.active,
                monthTaken: req.body.monthTaken,
                amount: +loan.amount + +req.body.amount,
                deductAmount: req.body.deductAmount,
              },
            },
            { new: true, userFindAndModify: false }
          ).exec((err, newLoan) => {
            if (err) {
              res.status(400).json(err);
            } else {
              res.json(newLoan);
            }
          });
        } else {
          const newLoanHistory = new LoanHistory(req.body);
          newLoanHistory.staffId = staff._id;
          newLoanHistory.save();
          const newloan = new Loan(req.body);
          newloan.staffId = staff._id;
          newloan.save((err, loan) => {
            if (err) return res.status(400).json(err);
            else return res.json(loan);
          });
        }
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getLoan: (req, res) => {
    try {
      Loan.find({ school: req.params.schoolId })
        .populate([
          {
            path: "school",
            select: "name",
          },
          {
            path: "staffId",
            select: "regNum",
          },
        ])
        .exec((err, loans) => {
          if (err) return res.status(400).json(err);
          else res.json(loans);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
