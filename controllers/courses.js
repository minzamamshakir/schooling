const Course = require("../modals/course");
const Section = require("../modals/section");
const { Class } = require("../modals/class");
exports.course = {
  create: (req, res) => {
    try {
      const obj = new Course(req.body);
      obj.createdBy = req.profile._id;
      obj.save((err, courses) => {
        if (err) return res.status(400).json(err);
        return res.json(courses);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  compulsory: (req, res) => {
    try {
      Course.find({ subjectType: "compulsory" }).exec((err, courses) => {
        if (err) return res.status(400).json(err);
        return res.json(courses);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  optional: (req, res) => {
    try {
      Course.find({ subjectType: "optional" }).exec((err, courses) => {
        if (err) return res.status(400).json(err);
        return res.json(courses);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Course.find().exec((err, courses) => {
        if (err) return res.status(400).json(err);
        return res.json(courses);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getCourseById: (req, res, next, id) => {
    try {
      Course.findById(id).exec((err, course) => {
        if (err || !course) {
          return res.status(400).json({
            error: "no course was found in Db",
          });
        }
        req.course = course;
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleCourse: (req, res) => {
    try {
      res.json(req.course);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateCourse: (req, res) => {
    try {
      Course.findOneAndUpdate(
        { _id: req.course._id },
        {
          $set: req.body,
        },
        { new: true, userFindAndModify: false },
        (err, course) => {
          if (err) res.status(400).json(err);
          res.json(course);
        }
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getCourseByType: (req, res) => {
    try {
      Course.find({ subjectType: req.body.type }).exec((err, courses) => {
        if (err) return res.status(400).json(err);
        return res.json(courses);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getCoursesBySectionAndClass: (req, res) => {
    try {
      Section.findOne({ _id: req.body.section })
        .populate([
          {
            path: "class",
            populate: { path: "courses", select: "name" },
            select: "courses",
          },
          { path: "courses", select: "name" },
        ])
        .exec((err, section) => {
          if (err || !section) {
            return res.status(400).json({
              error: "no courses was found in Db",
            });
          }
          res.json({
            sectionCourses: section.courses,
            classCourses: section.class.courses,
          });
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getCoursesBySection: (req, res) => {
    try {
      Section.findOne({ _id: req.body.section })
        .populate([{ path: "courses", select: "name" }])
        .exec((err, section) => {
          if (err || !section) {
            return res.status(400).json({
              error: "no courses was found in Db",
            });
          }
          res.json(section.courses);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getCoursesByClass: (req, res) => {
    try {
      Class.findOne({ _id: req.body.classId })
        .populate([{ path: "courses", select: "name" }])
        .exec((err, classes) => {
          if (err || !classes) {
            return res.status(400).json({
              error: "no courses was found in Db",
            });
          }
          res.json(classes.courses);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
