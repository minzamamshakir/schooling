const Guardian = require("../modals/guardian");
const logger = require("../config/logger");
const { register } = require("./register");
const User = require("../modals/user");
const Register = require("../modals/register");
exports.guardian = {
  create: async function (req, res, next) {
    try {
      if (req.exsist) next();
      else {
        const reg = await Register.findOne({
          name: "guardNum",
          school: req.body.student.school,
        });
        const newReg = `${reg.prefix}-${reg.count + 1}`;
        const guardianObj = new Guardian({
          guardian: req.body.guardian.guardian,
        });
        guardianObj.createdByRole = "Admin";
        guardianObj.createdBy = req.profile._id;
        guardianObj.regNum = newReg;
        guardianObj.userid = `${newReg}@ghazalians.com`;
        guardianObj.school = req.body.student.school;
        guardianObj.password = req.body.guardian.password;
        guardianObj.save((err, guard) => {
          if (err) return res.status(400).json(err);
          req.guardian = guard._id;
          reg.count = reg.count + 1;
          reg.save((err, reg) => {
            if (err) return res.status(400).json(err);
          });
          req.guardian = guardianObj._id;
          logger.info("Guardian create pass");
          next();
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  search: async function (request, response, next) {
    try {
      Guardian.findOne({
        $and: [
          {
            "guardian.cnic": request.body.guardian.guardian.cnic,
          },
          {
            school: request.body.student.school,
          },
        ],
      }).exec((err, guardian) => {
        if (err || !guardian) {
          request.exsist = false;
          logger.info("Guardian search pass");
          next();
        } else {
          request.guardian = guardian;
          request.exsist = true;
          logger.info("Guardian search pass");
          next();
        }
      });
    } catch (err) {
      return response.status(500).json(err);
    }
  },
  getGuardianById: (req, res, next, id) => {
    try {
      Guardian.findById(id).exec((err, guardian) => {
        if (err || !guardian) {
          return res.status(400).json({
            error: "No Such Guardian was found in Db",
          });
        }
        req.guardian = guardian;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleGuardian: (req, res) => {
    try {
      Guardian.findOne({ _id: req.guardian._id })
        .populate("childs")
        .exec((err, obj) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(obj);
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  updateGuardian: async (req, res) => {
    try {
      const userData = await User.findOne({
        informativeModel: req.guardian._id,
      }).populate({
        path: "informativeModel",
        populate: {
          path: "childs",
          select: "stdName",
        },
      });
      const children = userData.informativeModel.childs;
      Guardian.findOneAndUpdate(
        { _id: req.guardian._id },
        {
          $set: req.body,
          userid: userData.email,
          password: userData.password,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, guardian) => {
          if (err) return res.status(400).json(err);
          Promise.all(children).then((data) => {
            res.json({ childs: data, guardian });
          });
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  all: (req, res) => {
    try {
      Guardian.find({ school: req.body.school })
        .populate([
          {
            path: "childs",
            match: {
              inActive: { $ne: true },
            },
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
          },
        ])
        .exec((err, guard) => {
          if (err) return res.status(400).json(err);
          return res.json(guard);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  guardianMW: (req, res, next) => {
    try {
      Guardian.find({ school: req.body.school })
        .populate([
          {
            path: "childs",
            match: {
              inActive: { $ne: true },
            },
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
          },
        ])
        .exec((err, guard) => {
          if (err) return res.status(400).json(err);
          req.guardiansData = guard;
          next();
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  singleGuardianProfile: (req, res) => {
    if (typeof req.profile !== typeof undefined) {
      User.findById({
        _id: req.profile._doc._id,
      })
        .populate([
          {
            path: "informativeModel",
            populate: {
              path: "childs",
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
            },
          },
        ])
        .exec((err, guardian) => {
          if (err || !guardian) {
            return res.status(400).json({
              error: "no such student was found in Db",
            });
          } else {
            res.json({
              guardian: guardian._doc.informativeModel,
              user: guardian,
              _id: guardian._id,
            });
          }
        });
    }
  },
};
