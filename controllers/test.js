const Attendance = require("../modals/attendance");
const Current = require("../modals/current");
const logger = require("../config/logger");

let nowDate;
Current.find().exec((err, current) => {
  if (err) {
    logger.error(err);
    return;
  }
  nowDate = current[0];
  logger.info(current);
});

exports.test = {
  addAttendes: (req, res) => {},
  create: (req, res) => {
    try {
      const obj = new Attendance();
      obj.save((err, att) => {
        if (err) return res.status(400).json(err);
        return res.json(att);
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  },
};
// nowDate && console.log(nowDate, "its form therwaf");
