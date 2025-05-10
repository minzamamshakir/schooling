const Exam = require("../../modals/exams/exam");
exports.exam = {
  create: (req, res, next) => {
    try {
      const exam = new Exam(req.body);
      exam.save((err, exams) => {
        if (err) return res.status(400).json(err);
        else {
          // req.exam = exams._id;
          // next();
          res.json(exams);
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getExamBySchool: (req, res) => {
    try {
      Exam.find({ school: req.params.schoolId }).exec((err, exams) => {
        if (err) return res.status(400).json(err);
        else res.json(exams);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getExamTermBySession: (req, res) => {
    try {
      Exam.find({ session: req.body.session })
        .select("termName")
        .exec((err, exams) => {
          if (err) return res.status(400).json(err);
          else res.json(exams);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Exam.find().exec((err, data) => {
        if (err) res.status(400).json(err);
        else res.json(data);
      });
    } catch (error) {
      return res.status(500).json(err);
    }
  },
};
