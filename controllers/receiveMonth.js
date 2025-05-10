const ReceiveMonth = require("../modals/receiveMonth");
const Session = require("../modals/session");
const Month = require("../modals/month");

exports.receiveMonth = {
  create: (req, res, next) => {
    try {
      const mon = new ReceiveMonth(req.body);
      mon.session = req.session;
      mon.save((err, months) => {
        if (err) {
          Session.findOneAndDelete({
            _id: req.session,
          }).exec((err, session) => {
            if (err) return res.status(400).json(err);
            else res.status(400).json(err);
          });
        } else {
          next();
        }
      });
    } catch (err) {
      return res.json(err);
    }
  },
  getMonth: (req, res) => {
    try {
      ReceiveMonth.findOne({
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
      ReceiveMonth.find().exec((err, modals) => {
        if (err) return res.status(400).json(err);
        else return res.json(modals);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
