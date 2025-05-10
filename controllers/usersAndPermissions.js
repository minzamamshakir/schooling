const Student = require("../modals/student");
const Guardian = require("../modals/guardian");
const Staff = require("../modals/staff");
const User = require("../modals/user");
const Admin = require("../modals/admin");
const Permissions = require("../modals/permissions");
const TempletPermission = require("../modals/templetPermission");
const logger = require("../config/logger");

exports.usersAndPermissions = {
  createStaffsPermissions: (req, res, next) => {
    try {
      Staff.find({ inActive: { $ne: true } }).exec(async (err, staff) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          const defaultPermission = await TempletPermission.findOne({
            templetFor: "teacher",
          });
          delete defaultPermission._doc._id;
          delete defaultPermission.templetFor;
          staff.map((data) => {
            const permission = new Permissions({
              ...defaultPermission._doc,
              permissionsOf: data._doc._id,
            });
            permission.save((err, permission) => {
              if (err) {
                logger.error(err);
              } else {
                logger.info("success");
              }
            });
          });
          next();
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createStudentsPermissions: (req, res, next) => {
    try {
      Student.find({ inActive: { $ne: true } }).exec(async (err, student) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          const defaultPermission = await TempletPermission.findOne({
            templetFor: "student",
          });
          delete defaultPermission._doc._id;
          delete defaultPermission.templetFor;
          student.map((data) => {
            const permission = new Permissions({
              ...defaultPermission._doc,
              permissionsOf: data._doc._id,
            });
            permission.save((err, permission) => {
              if (err) {
                logger.error(err);
              } else {
                logger.info("success");
              }
            });
          });
          next();
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createGuardiansPermissions: (req, res, next) => {
    try {
      Guardian.find().exec(async (err, guardian) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          const defaultPermission = await TempletPermission.findOne({
            templetFor: "guardian",
          });
          delete defaultPermission._doc._id;
          delete defaultPermission.templetFor;
          guardian.map((data) => {
            const permission = new Permissions({
              ...defaultPermission._doc,
              permissionsOf: data._doc._id,
            });
            permission.save((err, permission) => {
              if (err) {
                logger.error(err);
              } else {
                logger.info("success");
              }
            });
          });
          next();
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createAdminPermissions: (req, res, next) => {
    try {
      Admin.find().exec(async (err, admin) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          const defaultPermission = await TempletPermission.findOne({
            templetFor: "admin",
          });
          delete defaultPermission._doc._id;
          delete defaultPermission.templetFor;
          admin.map(async (data) => {
            const permission = new Permissions({
              ...defaultPermission._doc,
              permissionsOf: data._doc._id,
            });
            permission.save((err, permission) => {
              if (err) {
                logger.error(err);
              } else {
                logger.info("success");
              }
            });
          });
          next();
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createStudentsUser: async (req, res, next) => {
    try {
      const student = await Student.find({ inActive: { $ne: true } });
      student.map(async (data) => {
        const permis = await Permissions.findOne({
          permissionsOf: data._doc._id,
        });
        const user = new User({
          permissions: permis && permis._id,
          userFor: "Student",
          role: 5,
          informativeModel: data._doc._id,
          email: data._doc.admissionNo + "@ghazalians.com",
          password: Math.random().toString(36).slice(2, 10),
        });
        user.save(async (err, user) => {
          if (err) {
            logger.error(err);
          } else {
            const student = await Student.findById(data._doc._id);
            logger.info(student.username);
          }
        });
      });
      res.json(allUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createStaffsUser: async (req, res, next) => {
    try {
      const staff = await Staff.find({ inActive: { $ne: true } });
      staff.map(async (data) => {
        const permis = await Permissions.findOne({
          permissionsOf: data._doc._id,
        });
        const user = new User({
          permissions: permis && permis._id,
          userFor: "Staff",
          role: 4,
          informativeModel: data._doc._id,
          email: data._doc.username,
          password: Math.random().toString(36).slice(2, 10),
        });
        user.save(async (err, user) => {
          if (err) {
            logger.error(err);
          } else {
            const staff = await Staff.findById(data._doc._id);
            logger.info(staff.username);
          }
        });
      });
      res.json(allUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createGuardiansUser: async (req, res, next) => {
    try {
      const guardian = await Guardian.find();
      guardian.map(async (data) => {
        const permis = await Permissions.findOne({
          permissionsOf: data._doc._id,
        });
        const user = new User({
          permissions: permis && permis._id,
          userFor: "Guardian",
          role: 6,
          informativeModel: data._doc._id,
          email: data._doc.regNum + "@ghazalians.com",
          password: Math.random().toString(36).slice(2, 10),
        });
        user.save(async (err, user) => {
          if (err) {
            logger.error(err);
          } else {
            const guardian = await Guardian.findById(data._doc._id);
            logger.info(guardian.username);
          }
        });
      });
      res.json(allUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createAdminUser: async (req, res, next) => {
    try {
      const admin = await Admin.find();
      const allUser = admin.map(async (data) => {
        const permis = await Permissions.findOne({
          permissionsOf: data._doc._id,
        });
        const user = new User({
          permissions: permis._id,
          userFor: "Admin",
          role: 1,
          informativeModel: data._doc._id,
          email: data._doc.email,
          password: Math.random().toString(36).slice(2, 10),
        });
        user.save(async (err, user) => {
          if (err) logger.error(err);
          const admin = await Admin.findById(data._doc._id);
          logger.info(admin.email);
        });
        return user;
      });
      await res.json(allUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
