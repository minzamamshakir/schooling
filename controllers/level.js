const Level = require("../modals/level");
const Register = require("../modals/register");
const Session = require("../modals/session");
const { validationResult } = require("express-validator");
exports.level = {
  create: (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(400).json({ err: err.error });
      }
      Level.findOne({
        name: req.body.name,
        session: req.body.session,
        school: req.body.school,
      }).exec((err, obj) => {
        if (obj) {
          return res.status(400).json({ err: "duplicate Entry" });
        } else {
          const level = new Level(req.body);
          level.createdBy = req.profile._id;
          level.save((err, level) => {
            if (err) {
              return res.status(400).json(err);
            }
            Session.findByIdAndUpdate(
              { _id: req.body.session },
              { $push: { level: level._id } },
              { new: true, userFindAndModify: false },
              (err, session) => {
                if (err) return res.status(400).json(err);

                return res.json(session);
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
      Level.find()
        .populate("school", "name")
        .populate("gender", "name classes")
        .exec((err, level) => {
          if (err) {
            return res.status(0).json(err);
          }
          return res.json(level);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getLevelById: (req, res, next, id) => {
    try {
      Level.findById(id).exec((err, level) => {
        if (err || !level) {
          return res.status(400).json({
            error: "no level was found in Db",
          });
        }
        req.level = level;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleLevel: (req, res) => {
    try {
      res.json(req.level);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateLevel: (req, res) => {
    try {
      Level.findOneAndUpdate(
        { _id: req.body.level },
        {
          $set: req.body,
        },
        { new: true, userFindAndModify: false },
        (err, level) => {
          if (err) res.status(400).json(err);
          res.json(level);
        }
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllLevelsBySession: (req, res) => {
    try {
      Level.find({ session: req && req.body && req.body.session }, "name").exec(
        (err, levels) => {
          if (err) return res.status(400).json(err);
          else return res.json(levels);
        }
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
