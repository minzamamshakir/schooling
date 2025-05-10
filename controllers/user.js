const User = require("../modals/user");
const Admin = require("../modals/admin");
const Staff = require("../modals/staff");
const Guardian = require("../modals/guardian");
const Student = require("../modals/student");
const Permission = require("../modals/permissions");
const Register = require("../modals/register");
const logger = require("../config/logger");
exports.user = {
  createStepForSuperAdmin: async (req, res) => {
    try {
      const user = new User({
        permissions: req.permission,
        userFor: "SuperAdmin",
        informativeModel: req.admin,
        ...req.body,
      });
      user.save(async (err, user) => {
        if (err) {
          if (req.permission !== null) {
            await Permission.findOneAndDelete({ _id: req.permission });
          }
          if (req.admin !== null) {
            await Admin.findOneAndDelete({ _id: req.admin });
          }
          res.status(400).json(err);
          return;
        } else {
          res.json({ email: user.email, password: user.password });
        }
      });
    } catch (err) {
      if (req.permission !== null) {
        await Permission.findOneAndDelete({ _id: req.permission });
      }
      if (req.admin !== null) {
        await Admin.findOneAndDelete({ _id: req.admin });
      }
      res.status(500).json(err);
      return;
    }
  },
  createStep: async (req, res) => {
    try {
      const user = new User({
        permissions: req.permission,
        userFor: "Admin",
        informativeModel: req.admin,
        ...req.body,
      });
      user.save(async (err, user) => {
        if (err) {
          if (req.permission !== null) {
            await Permission.findOneAndDelete({ _id: req.permission });
          }
          if (req.admin !== null) {
            await Admin.findOneAndDelete({ _id: req.admin });
          }
          res.status(400).json(err);
          return;
        } else {
          res.json({ email: user.email, password: user.password });
        }
      });
    } catch (err) {
      if (req.permission !== null) {
        await Permission.findOneAndDelete({ _id: req.permission });
      }
      if (req.admin !== null) {
        await Admin.findOneAndDelete({ _id: req.admin });
      }
      res.status(500).json(err);
      return;
    }
  },
  createStepForStaff: async (req, res) => {
    try {
      const reg = await Register.findOne({
        name: "staffNum",
        school: req.body.school,
      });
      const newReg = `${reg.prefix}-${reg.count}`;
      const user = new User({
        permissions: req.permission,
        userFor: "Staff",
        role: 4,
        informativeModel: req.staff,
        email: `${newReg}@ghazalians.com`,
        password: req.body.password,
      });
      user.save(async (err, user) => {
        if (err) {
          if (req.permission !== null) {
            await Permission.findOneAndDelete({ _id: req.permission });
          }
          if (req.staff !== null) {
            await Staff.findOneAndDelete({ _id: req.staff });
          }
          res.status(400).json(err);
          return;
        } else {
          const staff = await Staff.findById(req.staff);
          logger.info(staff.username);
          req.userForStaff = user._id;
          res.json({
            id: user._id,
            email: staff.username,
            password: user.password,
          });
        }
      });
    } catch (err) {
      if (req.permission !== null) {
        await Permission.findOneAndDelete({ _id: req.permission });
      }
      if (req.staff !== null) {
        await Staff.findOneAndDelete({ _id: req.staff });
      }
      res.status(500).json(err);
      return;
    }
  },
  createStepForGuardian: async (req, res, next) => {
    try {
      if (req.exsist) next();
      else {
        const reg = await Register.findOne({
          name: "guardNum",
          school: req.body.student.school,
        });
        const newReg = `${reg.prefix}-${reg.count}`;
        const user = new User({
          permissions: req.permission,
          userFor: "Guardian",
          role: 6,
          informativeModel: req.guardian,
          email: `${newReg}@ghazalians.com`,
          password: req.body.guardian.password,
        });
        user.save(async (err, user) => {
          if (err) {
            if (req.permission !== null) {
              await Permission.findOneAndDelete({ _id: req.permission });
            }
            if (req.guardian !== null) {
              await Guardian.findOneAndDelete({ _id: req.guardian });
            }
            res.status(400).json(err);
            return;
          } else {
            const guardian = await Guardian.findById(req.guardian);
            req.userForGaurdian = user._id;
            logger.info("Guardian user create pass");
            logger.info(guardian.username);
            next();
          }
        });
      }
    } catch (err) {
      if (req.permission !== null) {
        await Permission.findOneAndDelete({ _id: req.permission });
      }
      if (req.guardian !== null) {
        await Guardian.findOneAndDelete({ _id: req.guardian });
      }
      res.status(500).json(err);
      return;
    }
  },
  createStepForStudent: async (req, res) => {
    try {
      const reg = await Register.findOne({
        $and: [
          { level: req.body.student.level },
          { gender: req.body.student.gender },
        ],
      });
      const newReg = `${reg.prefix}-${reg.count}`;
      const user = new User({
        permissions: req.permission,
        userFor: "Student",
        role: 5,
        informativeModel: req.student,
        email: `${newReg}@ghazalians.com`,
        password: req.body.student.password,
      });
      user.save(async (err, user) => {
        if (err) {
          if (req.permissionOfStudent !== null) {
            await Permission.findOneAndDelete({ _id: req.permissionOfStudent });
          }
          if (req.student !== null) {
            await Student.findOneAndDelete({ _id: req.student });
          }
          if (req.userOfGuardian !== null) {
            if (
              (req &&
                req.guardian &&
                req.guardian.childs &&
                req.guardian.childs.length === 0) ||
              !req.guardian.childs
            ) {
              await User.findOneAndDelete({ _id: req.userOfGuardian });
            }
          }
          if (req.permission !== null) {
            await Permission.findOneAndDelete({ _id: req.permission });
          }
          if (req.guardian !== null) {
            if (
              (req &&
                req.guardian &&
                req.guardian.childs &&
                req.guardian.childs.length === 0) ||
              !req.guardian.childs
            ) {
              await Guardian.findOneAndDelete({ _id: req.guardian });
            }
          }
          res.status(400).json(err);
          return;
        } else {
          const student = await Student.findById(req.student);
          logger.info(student.username);
          res.json({
            id: user._id,
            email: student.username,
            password: user.password,
          });
        }
      });
    } catch (err) {
      if (req.permission !== null) {
        await Permission.findOneAndDelete({ _id: req.permission });
      }
      if (req.student !== null) {
        await Student.findOneAndDelete({ _id: req.student });
      }
      if (req.userOfGuardian !== null) {
        if (
          (req &&
            req.guardian &&
            req.guardian.childs &&
            req.guardian.childs.length === 0) ||
          !req.guardian.childs
        ) {
          await User.findOneAndDelete({ _id: req.userOfGuardian });
        }
      }
      if (req.permission !== null) {
        await Permission.findOneAndDelete({ _id: req.permission });
      }
      if (req.guardian !== null) {
        if (
          (req &&
            req.guardian &&
            req.guardian.childs &&
            req.guardian.childs.length === 0) ||
          !req.guardian.childs
        ) {
          await Guardian.findOneAndDelete({ _id: req.guardian });
        }
      }
      res.status(500).json(err);
      return;
    }
  },
  updateUserForGuardian: async (req, res) => {
    try {
      User.findOneAndUpdate(
        { informativeModel: req.body.id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, guardian) => {
          if (err) return res.status(400).json(err);
          res.json(guardian);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateUserForStaff: async (req, res) => {
    try {
      User.findOneAndUpdate(
        { informativeModel: req.body.id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, staff) => {
          if (err) return res.status(400).json(err);
          res.json(staff);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateUserForStudent: async (req, res) => {
    try {
      User.findOneAndUpdate(
        { informativeModel: req.body.id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, std) => {
          if (err) return res.status(400).json(err);
          res.json(std);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateUserForAdmin: async (req, res) => {
    try {
      User.findOneAndUpdate(
        { informativeModel: req.body.id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, admin) => {
          if (err) return res.status(400).json(err);
          res.json(admin);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
