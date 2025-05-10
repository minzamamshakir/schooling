const DateSheet = require("../../modals/exams/dateSheet");
const Exam = require("../../modals/exams/exam");
exports.dateSheet = {
  create: async (req, res) => {
    try {
      const datesheet = new DateSheet(req.body);
      datesheet.save((err, dateSheets) => {
        if (err) return res.status(400).json(err);
        else return res.json(dateSheets);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getDateSheetBySection: (req, res) => {
    try {
      DateSheet.find({
        section: req.body.section,
        examTerm: req.body.examTerm,
      })
        .populate([
          {
            path: "section",
            populate: {
              path: "class",
              select: "name",
            },
            select: "name",
          },
        ])
        .exec((err, subjects) => {
          if (err) return res.status(400).json(err);
          else res.json(subjects);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getDataForResult: (req, res, next) => {
    try {
      if (req.profile.role !== 1) {
        DateSheet.find({
          section: req.body.section,
          school: req.body.school,
          session: req.body.session,
          examTerm: req.body.examTerm,
        })
          .populate([
            {
              path: "section",
              populate: {
                path: "students",
                select: "stdName admissionNo",
              },
              select: "name",
            },
          ])
          .exec((err, dateSheet) => {
            if (err) {
              return res.status(400).json(err);
            } else if (dateSheet.length == 0) {
              return res
                .status(400)
                .json("Please Firstly Take Exam of this Section");
            } else {
              let resultData = dateSheet[0].examData.filter((data) => {
                // if (data.teacherId === req.teacherId.toString()) {
                return data;
                // }
              });
              dateSheet[0].examData = resultData;
              res.json({
                examData: dateSheet[0] && dateSheet[0].examData,
                students:
                  dateSheet[0] &&
                  dateSheet[0].section &&
                  dateSheet[0].section.students,
                examTerm: dateSheet[0] && dateSheet[0].examTerm,
              });
            }
          });
      } else {
        next();
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getDataForResultForAdmin: (req, res, next) => {
    try {
      DateSheet.find({
        section: req.body.section,
        examTerm: req.body.examTerm,
      })
        .populate([
          {
            path: "section",
            populate: {
              path: "students",
              select: "stdName admissionNo",
            },
            select: "name",
          },
        ])
        .exec((err, subjects) => {
          if (err) {
            return res.status(400).json(err);
          } else if (subjects.length == 0) {
            return res
              .status(400)
              .json("Please Firstly Take Exam of this Section");
          } else
            res.json({
              examData: subjects[0] && subjects[0].examData,
              students:
                subjects[0] &&
                subjects[0].section &&
                subjects[0].section.students,
              examTerm: subjects[0] && subjects[0].examTerm,
            });
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getStudentSubjectsByExamId: (req, res) => {
    try {
      StudentSubject.find({ exam: req.body.examId }).exec((err, subjects) => {
        if (err) return res.status(400).json(err);
        else res.json(subjects);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateDateSheet: (req, res) => {
    try {
      DateSheet.findOneAndUpdate(
        {
          _id: req.params.id,
          session: req.body.session,
          examTerm: req.body.examTerm,
          section: req.body.section,
        },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, dateSheet) => {
          if (err) return res.status(400).json(err);
          return res.json(dateSheet);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  all: (req, res) => {
    try {
      DateSheet.find().exec((err, data) => {
        if (err) res.status(400).json(err);
        else res.json(data);
      });
    } catch (error) {
      return res.status(500).json(err);
    }
  },
};
