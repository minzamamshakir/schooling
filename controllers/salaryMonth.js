const SalaryMonth = require("../modals/salaryMonth");

exports.salaryMonth = {
  create: (req, res) => {
    try {
      const salaryMon = new SalaryMonth(req.body);
      salaryMon.session = req.session;
      salaryMon.save((err, SalaryMonths) => {
        if (err) return res.status(400).json(err);
        else return res.json(SalaryMonths);
      });
    } catch (err) {
      return res.json(err);
    }
  },
  getSalaryMonth: (req, res) => {
    try {
      SalaryMonth.findOne({
        school: req.body.school,
        session: req.body.session,
      }).exec((err, month) => {
        if (err) return res.status(400).json(err);
        else return res.json(month);
      });
    } catch (err) {
      return res.json(err);
    }
  },
  all: (req, res) => {
    try {
      SalaryMonth.find().exec((err, modals) => {
        if (err) return res.status(400).json(err);
        else return res.json(modals);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
