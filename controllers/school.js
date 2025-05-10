const School = require("../modals/school");
const { validationResult } = require("express-validator");
const Student = require("../modals/student");
const Guardian = require("../modals/guardian");
exports.school = {
  create: (req, res, next) => {
    try {
      // create school here
      const school = new School(req.body);
      const err = validationResult(req);
      if (err.errors.length) {
        return res.status(400).json({ err: err.errors });
      }
      school.createdBy = req.profile._id;

      school.save((err, school) => {
        if (err) {
          res.status(400).json({ err });
          return;
        } else {
          req.school = school && school._doc;
          next();
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  school: (req, res) => {
    try {
      School.find({}, "name schoolCardAddress")
        .populate({
          path: "sessions",
          select: "duration annual",
          options: { sort: { createdAt: -1 } },
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  session: (req, res) => {
    try {
      School.find({}, "name")

        .populate({
          path: "sessions",
          select: "duration",
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  level: (req, res) => {
    try {
      School.find({}, "name")
        .populate({
          path: "sessions",
          select: "duration",
          populate: {
            path: "level",
            select: "name",
          },
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  gender: (req, res) => {
    try {
      School.find({}, "name")
        .populate({
          path: "sessions",
          select: "duration",
          populate: {
            path: "level",
            select: "name",
            populate: {
              path: "gender",
              select: "name",
            },
          },
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  classes: (req, res) => {
    try {
      School.find({}, "name")
        .populate({
          path: "sessions",
          select: "duration",
          populate: {
            path: "level",
            select: "name",
            populate: {
              path: "gender",
              select: "name",
              populate: {
                path: "classes",
                select: "name",
              },
            },
          },
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  section: (req, res) => {
    try {
      School.find({})
        .populate({
          path: "sessions",
          select: "duration",
          populate: {
            path: "level",
            select: "name",
            populate: {
              path: "gender",
              select: "name",
              populate: {
                path: "classes",
                select: "name defaultFee",
                populate: {
                  path: "section",
                  select: "name color",
                },
              },
            },
          },
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  student: (req, res) => {
    try {
      School.find({}, "name")
        .populate({
          path: "sessions",
          select: "duration",
          populate: {
            path: "level",
            select: "name",
            populate: {
              path: "gender",
              select: "name",
              populate: {
                path: "classes",
                select: "name",
                populate: {
                  path: "section",
                  select: "name color students",
                  populate: {
                    path: "students",
                  },
                },
              },
            },
          },
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  getSchoolById: (req, res, next, id) => {
    try {
      School.findById(id).exec((err, school) => {
        if (err || !school) {
          return res.status(400).json({
            error: "no such School was found in Db",
          });
        }
        req.school = school;
        req.schoolId = id;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleSchool: (req, res) => {
    res.json(req.school);
  },
  updateSchool: (req, res) => {
    try {
      School.findOneAndUpdate(
        { _id: req.school._id },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, school) => {
          if (err) return res.status(400).json(err);
          return res.json(school);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  singleSchoolStudents: (req, res) => {
    try {
      Student.find({ school: req.body.school, inActive: { $ne: true } })
        .populate({
          path: "class section",
          select: "name",
        })
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          res.json(student);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  singleSchoolGuardians: (req, res) => {
    Guardian.find()
      .populate({
        path: "childs",
        match: { school: req.body.school },
        select: "school",
      })
      .exec((err, guard) => {
        if (err) return res.status(400).json(err);
        else return res.json(guard);
      });
  },
  getSingleSectionBySchool: (req, res) => {
    try {
      School.find({ _id: req && req.body && req.body.school })
        .populate({
          path: "sessions",
          select: "duration",
          populate: {
            path: "level",
            select: "name",
            populate: {
              path: "gender",
              select: "name",
              populate: {
                path: "classes",
                select: "name defaultFee",
                populate: {
                  path: "section",
                  select: "name color",
                },
              },
            },
          },
        })
        .exec((err, school) => {
          if (err) {
            return res.status(400).json(err);
          }
          res.json(school);
        });
    } catch (err) {
      return res.status();
    }
  },
  getSchoolByProfile: (req, res, next) => {
    if (req.profile) {
      try {
        School.findById(req.profile.school).exec((err, school) => {
          if (err || !school) {
            return res.status(400).json({
              error: "no such School was found in Db",
            });
          }
          req.school = school;
          req.schoolId = req.profile.school;
          next();
        });
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      res.status(400).json({ err: "No Profile found for the Card No" });
    }
  },
};
