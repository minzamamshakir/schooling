const Section = require("../modals/section");
const { Class } = require("../modals/class");
const { validationResult } = require("express-validator");
const Student = require("../modals/student");

exports.section = {
  create: (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) return res.status(400).json(err);
      Section.findOne({
        name: req.body.name,
        level: req.body.level,
        gender: req.body.gender,
        session: req.body.session,
        school: req.body.school,
        class: req.body.class,
      }).exec((err, obj) => {
        if (obj) return res.status(400).json({ err: "duplicate entry" });
        else {
          const section = new Section(req.body);
          section.createdBy = req.profile._id;
          section.save((err, section) => {
            if (err) return res.status(400).json(err);
            Class.findOneAndUpdate(
              { _id: req.body.class },
              {
                $push: { section: section._id },
              },
              {
                new: true,
                useFindAndModify: true,
              },
              (err, classObj) => {
                if (err) return res.status(400).json(err);
                return res.json(classObj);
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
      Section.find()
        .populate("school", "name")
        .populate("session", "duration")
        .populate("level", "name")
        .populate("gender", "name")
        .populate("class", "name")
        .exec((err, section) => {
          if (err) return res.status(400).json(err);
          return res.json(section);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // getSingleSection: (req, res) => {
  //   try {
  //     res.json(req.section);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },
  // updateSection: (req, res) => {
  //   try {
  //     Section.findOneAndUpdate(
  //       { _id: req.section },
  //       {
  //         $set: req.body,
  //       },
  //       { new: true, userFindAndModify: false },
  //       (err, section) => {
  //         if (err) res.status(400).json(err);
  //         res.json(section);
  //       }
  //     );
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // },
  getStudents: (req, res) => {
    try {
      Section.findOne({ _id: req.section._id })
        .populate([
          {
            path: "students",
            populate: [
              {
                path: "class",
                select: "name",
              },
              {
                path: "session",
                select: "duration",
              },
              {
                path: "school",
                select: "schoolCardAddress",
              },
              {
                path: "guardian",
                select: "guardian pic regNum",
              },
            ],
          },
        ])
        .exec((err, section) => {
          if (err) return res.status(400).json(err);
          return res.json(section);
        });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getRollNo: (req, res) => {
    try {
      Student.findOne({ section: req.section._id})
        .sort([["rollNo", -1]])
        .exec((err, student) => {
          if (err) return res.status(400).json(err);
          else if (!student) return res.json({ lastRollNo: 0 });
          else return res.json({ lastRollNo: student && student.rollNo });
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSectionById: (req, res, next, id) => {
    try {
      Section.findById(id).exec((err, section) => {
        if (err || !section) {
          return res.status(400).json({
            error: "no such section was found in Db",
          });
        }
        req.section = section;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleSection: (req, res) => {
    res.json(req.section);
  },
  updateSection: (req, res) => {
    try {
      Section.findOneAndUpdate(
        { _id: req.body.section },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, section) => {
          if (err) return res.status(400).json(err);
          return res.json(section);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getAllSectionByClass: (req, res) => {
    try {
      Section.find({ class: req.body.classes }, "name").exec(
        (err, sections) => {
          if (err) return res.status(400).json(err);
          return res.json(sections);
        }
      );
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleSectionPic: (req, res) => {
    try {
      Section.findOne({ _id: req.params.sectionId }).exec((err, section) => {
        if (err) return res.status(400).json(err);
        return res.json(section.pic);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
