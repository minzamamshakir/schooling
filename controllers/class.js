const { Class, Fee, AddCharge } = require("../modals/class");
const Student = require("../modals/student");
const Gender = require("../modals/gender");
const Attendance = require("../modals/attendance");
const { validationResult } = require("express-validator");
exports.classes = {
  create: (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) return res.status(400).json(err);
      Class.findOne({
        name: req.body.name,
        level: req.body.level,
        gender: req.body.gender,
        session: req.body.session,
        school: req.body.school,
      }).exec((err, obj) => {
        if (obj) return res.status(400).json({ err: "dupicate entry" });
        else {
          const fee = new Fee(req.body);
          const classObj = new Class(req.body);
          classObj.defaultFee = fee;
          classObj.createdBy = req.profile._id;
          classObj.save((err, obj) => {
            if (err) return res.status(400).json(err);
            Gender.findOneAndUpdate(
              { _id: req.body.gender },
              {
                $push: { classes: obj._id },
              },
              { new: true, userFindAndModify: true },
              (err, gender) => {
                if (err) return res.status(400).json(err);
                return res.json(gender);
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
      Class.find()
        .populate("school", "name")
        .populate("session", "duration")
        .populate("level", "name")
        .populate("gender", "name")
        .populate("defaultFee")
        .exec((err, classObj) => {
          if (err) return res.status(400).json(err);
          return res.json(classObj);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  allClassesBySession: (req, res) => {
    try {
      Class.find({ session: req.params.sessionId })
        .select("name")
        .exec((err, classObj) => {
          if (err) return res.status(400).json(err);
          return res.json(classObj);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getClassBySchool: (req, res) => {
    try {
      Gender.find(
        { school: req.school._id, session: req.params.session },
        "name"
      )
        .populate([
          {
            path: "classes",
            populate: {
              path: "section",
              select: "name",
            },
            select: "name",
          },
        ])
        .exec((err, data) => {
          if (err) return res.status(400).json(err);
          else {
            return res.json(data);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getClassAndSectionBySchool: (req, res) => {
    try {
      Gender.find({ session: req.body.session }, "name")
        .populate([
          {
            path: "classes",
            populate: {
              path: "section",
              select: "name",
            },
            select: "name",
          },
        ])
        .exec((err, data) => {
          if (err) return res.status(400).json(err);
          else {
            return res.json(data);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getClassById: (req, res, next, id) => {
    try {
      Class.findById(id).exec((err, classes) => {
        if (err || !classes) {
          return res.status(400).json({
            error: "no Class was found in Db",
          });
        }
        req.classes = classes;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleClass: (req, res) => {
    try {
      res.json(req.classes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getSingleClassStudents: (req, res) => {
    try {
      Student.find({ class: req.classes._id, inActive: { $ne: true } })
        .populate([
          { path: "section", select: "name color" },
          { path: "class", select: "name" },
          { path: "session", select: "duration" },
          { path: "school", select: "schoolCardAddress" },
          { path: "guardian" },
        ])
        .exec((err, students) => {
          if (err) return res.status(400).json(err);
          else return res.json(students);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateClass: (req, res) => {
    try {
      Class.findOneAndUpdate(
        { _id: req.body.class },
        {
          $set: req.body,
        },
        { new: true, userFindAndModify: false },
        (err, classes) => {
          if (err) res.status(400).json(err);
          res.json(classes);
        }
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },
  classStrength: (req, res) => {
    Class.find({ school: req.body.school, session: req.body.session }).exec(
      (err, obj) => {
        const arr = obj.map(async (data) => {
          const newData = { name: data.name, counts: 0, absent: 0, present: 0 };
          newData.counts = await Student.find({
            class: data,
            inActive: { $ne: true },
          }).countDocuments();
          const absent = await Attendance.find({
            class: data,
            date: new Date().toLocaleDateString("en-PK", {
              timeZone: "Asia/Karachi",
            }),
            absent: true,
          }).populate("id", "inActive");
          const attend = absent.filter(
            (_attend) => _attend && _attend.id && _attend.id.inActive === false
          );
          newData.absent = attend.length;
          const present = await Attendance.find({
            class: data,
            date: new Date().toLocaleDateString("en-PK", {
              timeZone: "Asia/Karachi",
            }),
            absent: false,
          }).populate("id", "inActive");
          const attendPresent = present.filter(
            (_attend) => _attend && _attend.id && _attend.id.inActive === false
          );
          newData.present = attendPresent.length;
          return newData;
        });
        Promise.allSettled(arr).then((data) => res.json(data));
      }
    );
  },
  getClassByGender: (req, res) => {
    try {
      Class.find(
        { gender: req && req.body && req.body.gender },
        "name defaultFee"
      ).exec((err, gender) => {
        if (err) return res.status(400).json(err);
        res.json(gender);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
