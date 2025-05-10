const Month = require("../modals/month");

exports.month = {
  create: (req, res) => {
    try {
      const mon = new Month(req.body);
      mon.save((err, months) => {
        if (err) return res.status(400).json(err);
        else return res.json(months);
      });
    } catch (err) {
      return res.json(err);
    }
  },
  getMonth: (req, res) => {
    try {
      Month.findOne({
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
      Month.find().exec((err, modals) => {
        if (err) return res.status(400).json(err);
        else return res.json(modals);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
