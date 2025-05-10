const LoanHistory = require("../modals/loanHistory");
exports.loanHistory = {
  create: async (req, res) => {
    try {
      const newloan = new LoanHistory(req.body);
      newloan.save((err, loanHistory) => {
        if (err) return res.status(400).json(err);
        else return res.json(loanHistory);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getLoanHistory: (req, res) => {
    try {
      LoanHistory.find().exec((err, loans) => {
        if (err) return res.status(400).json(err);
        else res.json(loans);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
