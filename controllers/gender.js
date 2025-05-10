const Gender = require("../modals/gender");
const Level = require("../modals/level");
const { validationResult } = require("express-validator");
const Register = require("../modals/register");
exports.gender = {
  create: async (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(400).json(err);
      }
      Gender.findOne({
        name: req.body.name,
        school: req.body.school,
        session: req.body.session,
        level: req.body.level,
      }).exec((err, gender) => {
        if (gender && gender.name) {
          return res.status(400).json({ err: "dupllicate values" });
        } else {
          const gender = new Gender(req.body);
          gender.createdBy = req.profile._id;
          gender.save((err, gender) => {
            if (err) {
              return res.status(400).json(err);
            }

            Level.findByIdAndUpdate(
              { _id: req.body.level },
              {
                $push: { gender: gender._id },
              },
              { new: true, userFindAndModify: true },
              (err, level) => {
                if (err) return res.status(400).json(err);
                else {
                  Register.findOne({ prefix: req.body.prefix }).exec(
                    (err, register) => {
                      if (register !== null && register.prefix) {
                        Register.findByIdAndUpdate(
                          { _id: register._id },
                          {
                            $set: {
                              level: req.body.level,
                              gender: gender._id,
                            },
                          },
                          { new: true, userFindAndModify: true },
                          (err, updatedRegister) => {
                            if (err) return res.status(400).json(err);
                            else {
                              return res.json({
                                updatedRegister,
                                level: level && level._id,
                              });
                            }
                          }
                        );
                      } else {
                        const reg = new Register({
                          level: req.body.level,
                          gender: gender._id,
                          prefix: req.body.prefix,
                          count: req.body.count,
                        });
                        reg.save((err, reg) => {
                          if (err) return res.status(400).json(reg);
                          else
                            return res.json({
                              reg: reg && reg._id,
                              level: level && level._id,
                            });
                        });
                      }
                    }
                  );
                }
              }
            );
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Gender.find()
        .populate("level", "name")
        .populate("school", "name")
        .populate("session", "duration")
        .populate("createdBy", "name")
        .exec((err, gender) => {
          if (err) return res.status(400).json(err);
          return res.json(gender);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getGenderById: (req, res, next, id) => {
    try {
      Gender.findById(id).exec((err, gender) => {
        if (err || !gender) {
          return res.status(400).json({
            error: "no such Gender was found in Db",
          });
        }
        req.gender = gender;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleGender: (req, res) => {
    res.json(req.gender);
  },
  updateGender: (req, res) => {
    try {
      Gender.findOneAndUpdate(
        { _id: req.gender._id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, gender) => {
          if (err) return res.status(400).json(err);
          return res.json(gender);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getAllGendersByLevel: (req, res) => {
    try {
      Gender.find({ level: req && req.body && req.body.level }, "name").exec(
        (err, gender) => {
          if (err) return res.status(400).json(err);
          else return res.json(gender);
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
