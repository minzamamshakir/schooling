const Register = require("../modals/register");
const logger = require("../config/logger");
const Staff = require("../modals/staff");
const Student = require("../modals/student");
const Guardian = require("../modals/guardian");

exports.register = {
  newNum: async (req, res) => {
    try {
      const reg = await Register.findOne({
        level: req.body.level,
        gender: req.body.gender,
      });
      const num = `${reg.prefix}-${reg.count + 1}`;
      res.json(num);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  guardNum: async (req, res, next) => {
    try {
      const reg = new Register({ name: "guardNum", school: req.school._id });
      reg.prefix = req.body.guardPrefix;
      reg.save((err, reg) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          req.newData = { ...req.school, guardNum: reg && reg._doc };
          next();
        }
      });
    } catch (err) {
      logger.error(err);
    }
  },
  certNum: async (req, res, next) => {
    try {
      const reg = new Register({
        name: "certNum",
        school: req.school._id,
      });
      reg.prefix = req.body.certPrefix;
      reg.save((err, reg) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          req.newData = { ...req.school, certNum: reg && reg._doc };
          next();
        }
      });
    } catch (err) {
      logger.error(err);
    }
  },
  staffNum: async (req, res) => {
    try {
      const reg = new Register({ name: "staffNum", school: req.school._id });
      reg.prefix = req.body.staffPrefix;
      reg.save((err, reg) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json({ ...req.newData, staffNum: reg && reg._doc });
          return;
        }
      });
    } catch (err) {
      logger.error(err);
    }
  },
  getStaffNum: async (req, res) => {
    try {
      Register.findOne({ name: "staffNum" }).exec((err, register) => {
        if (err) return res.status(400).json(err);
        else return res.json(register);
      });
    } catch (err) {
      logger.error(err);
    }
  },
  getCertNum: async (req, res) => {
    try {
      Register.findOne({ name: "certNum" }).exec((err, register) => {
        if (err) return res.status(400).json(err);
        else return res.json(register);
      });
    } catch (err) {
      logger.error(err);
    }
  },
  checkRegister: async (req, res, next) => {
    try {
      const query =
        req &&
        req.body &&
        req.body.regNum &&
        typeof req.body.regNum === "string" &&
        req.body.regNum.split("-")[0];

      const data = await Register.findOne({
        prefix: query && query.toUpperCase(),
      });
      if (data && data.name) {
        req.name = data.name;
        // res.json({ name: req.name });
        next();
      } else if (data && data._id) {
        req.name = "student";
        // res.json({ name: req.name });
        next();
      } else {
        res.status(400).json({ err: "Please Enter a Valid Reg Num" });
        return;
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  findUser: async (req, res) => {
    try {
      switch (req.name) {
        case "staffNum":
          const resStaff = await Staff.findOne({
            regNum: req.body.regNum.toUpperCase(),
          });
          if (resStaff && resStaff._id) {
            res.json({ id: resStaff._id.toString(), model: "staff" });
          } else {
            res.status(400).json({ err: "No Such User found" });
          }
          break;
        case "guardNum":
          const resGuardian = await Guardian.findOne({
            regNum: req.body.regNum.toUpperCase(),
          });
          if (resGuardian && resGuardian._id) {
            res.json({ id: resGuardian._id.toString(), model: "guardian" });
          } else {
            res.status(400).json({ err: "No Such User found" });
          }
          break;
        case "student":
          const resStudent = await Student.findOne({
            admissionNo: req.body.regNum.toUpperCase(),
            inActive: { $ne: true },
          });
          if (resStudent && resStudent._id) {
            res.json({ id: resStudent._id.toString(), model: "student" });
          } else {
            res.status(400).json({ err: "No Such User found" });
          }
          break;
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  updateCertNum: (req, res, next) => {
    try {
      Register.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { count: req.body.count },
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, register) => {
          if (err) return res.status(400).json(err);
          next();
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
