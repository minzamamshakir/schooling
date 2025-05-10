const Session = require("../modals/session");
const School = require("../modals/school");
const Month = require("../modals/month");
const logger = require("../config/logger");
const { validationResult } = require("express-validator");

// code to genrate calender in mongoose
exports.session = {
  create: (req, res, next) => {
    try {
      Session.findOne({
        duration: req.body.duration,
        to: req.body.to,
        from: req.body.from,
        school: req.body.school,
      }).exec((err, obj) => {
        if (obj) return res.status(400).json({ err: "duplicate Entry" });
        else {
          const session = new Session(req.body);
          session.createdBy = req.profile._id;

          session.save((err, session) => {
            if (err) {
              res.status(400).json(err);
              return;
            } else {
              School.findOneAndUpdate(
                { _id: req.body.school },
                {
                  $push: { sessions: session._id },
                  $set: { currentSession: session._id },
                },
                { new: true, userFindAndModify: true },
                (err, school) => {
                  if (err) {
                    res.status(400).json(err);
                    return;
                  } else {
                    const month = new Month({
                      session: session._id,
                      school: req.body.school,
                    });
                    month.save((err, months) => {
                      if (err) {
                        logger.error(err);
                        res.status(400).json(err);
                        return;
                      } else {
                        logger.info(school.name);
                        req.session = session._id;
                        next();
                      }
                    });
                  }
                }
              );
            }
          });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Session.find()
        .populate("school", "name")
        .populate("createdBy")
        .populate({
          path: "level",
          select: "name",
        })
        .exec((err, session) => {
          if (err) return res.status(400).json(err);
          return res.json(session);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  sessionBySchool: (req, res) => {
    try {
      Session.find({ school: req.param.school })
        .populate("school", "name")
        .populate("createdBy")
        .populate({
          path: "level",
          select: "name",
        })
        .exec((err, session) => {
          if (err) return res.status(400).json(err);
          return res.json(session);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSessionById: (req, res, next, id) => {
    try {
      Session.findById(id).exec((err, session) => {
        if (err || !session) {
          return res.status(400).json({
            error: "no such Session was found in Db",
          });
        }
        req.session = session;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleSession: (req, res) => {
    res.json(req.session);
  },
  updateSession: (req, res) => {
    try {
      Session.findOneAndUpdate(
        { _id: req.session._id },
        {
          $set: { annual: req.body.annual },
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, session) => {
          if (err) return res.status(400).json(err);
          return res.json({
            _id: session._id,
            duration: session.duration,
            annual: session.annual,
          });
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getSessionBySchool: (req, res) => {
    try {
      Session.find({ school: req && req.body.school }, "duration").exec(
        (err, session) => {
          if (err) return res.status(400).json(err);
          else return res.json(session);
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
