const StudentHistory = require("../modals/studentHistory");
const FinalCriteria = require("../modals/exams/finalCriteria");
const Student = require("../modals/student");
exports.studentHistory = {
  create: async (req, res) => {
    try {
      const student = await Student.findOne({
        section: req.body.newSection,
        inActive: { $ne: true },
      }).sort([["rollNo", -1]]);
      const promoteStudent = req.body.students
        .filter(async (value) => {
          const result = await FinalCriteria.findOne({
            admissionNo: value.admissionNo,
            session: req.body.oldSession,
          });
          if (result.grade !== "F") {
            return value;
          }
        })
        .map(async (std, index) => {
          const result = await FinalCriteria.findOne({
            admissionNo: std.admissionNo,
            session: req.body.oldSession,
          });
          if (result.grade !== "F") {
            if (!student) {
              const studentData = await Student.findOne({ _id: std._id });
              studentData.session = req.body.newSession;
              studentData.class = req.body.newClass;
              studentData.section = req.body.newSection;
              studentData.rollNo = index + 1;
              studentData.save();
            } else {
              const studentData = await Student.findOne({ _id: std._id });
              studentData.session = req.body.newSession;
              studentData.class = req.body.newClass;
              studentData.section = req.body.newSection;
              studentData.rollNo = index + 1 + student.rollNo;
              studentData.save();
            }
            const studentHistory = new StudentHistory({
              student: std._id,
              oldSessions: {
                oldSession: req.body.oldSession,
                oldSection: req.body.oldSection,
                oldClasses: req.body.oldClass,
                grade: result.grade,
                percentage: result.percentage,
              },
              newSessions: {
                newSession: req.body.newSession,
                newSection: req.body.newSection,
                newClasses: req.body.newClass,
              },
            });
            return studentHistory.save();
          }
        });
      Promise.all(promoteStudent).then((data) => res.json(data));
    } catch (error) {
      res.status(500).json(error);
    }
  },
  failStudents: async (req, res) => {
    try {
      const student = await Student.findOne({
        section: req.body.newSection,
        inActive: { $ne: true },
      }).sort([["rollNo", -1]]);
      const promoteStudent = req.body.students.map(async (std, index) => {
        const result = await FinalCriteria.findOne({
          admissionNo: std.admissionNo,
          session: req.body.oldSession,
        });
        if (!student) {
          const studentData = await Student.findOne({ _id: std._id });
          studentData.session = req.body.newSession;
          studentData.class = req.body.newClass;
          studentData.section = req.body.newSection;
          studentData.rollNo = index + 1;
          studentData.save();
        } else {
          const studentData = await Student.findOne({ _id: std._id });
          studentData.session = req.body.newSession;
          studentData.class = req.body.newClass;
          studentData.section = req.body.newSection;
          studentData.rollNo = index + 1 + student.rollNo;
          studentData.save();
        }
        const studentHistory = new StudentHistory({
          student: std._id,
          oldSessions: {
            oldSession: req.body.oldSession,
            oldSection: req.body.oldSection,
            oldClasses: req.body.oldClass,
            grade: result.grade,
            percentage: result.percentage,
          },
          newSessions: {
            newSession: req.body.newSession,
            newSection: req.body.newSection,
            newClasses: req.body.newClass,
          },
        });
        return studentHistory.save();
      });
      Promise.all(promoteStudent).then((data) => res.json(data));
    } catch (error) {
      res.status(500).json(error);
    }
  },
  classChangeStudents: async (req, res) => {
    try {
      const student = await Student.findOne({
        section: req.body.newSection,
        inActive: { $ne: true },
      }).sort([["rollNo", -1]]);
      const promoteStudent = req.body.students.map(async (std, index) => {
        if (!student) {
          const studentData = await Student.findOne({ _id: std._id });
          studentData.session = req.body.newSession;
          studentData.class = req.body.newClass;
          studentData.section = req.body.newSection;
          studentData.rollNo = index + 1;
          studentData.save();
          return studentData;
        } else {
          const studentData = await Student.findOne({ _id: std._id });
          studentData.session = req.body.newSession;
          studentData.class = req.body.newClass;
          studentData.section = req.body.newSection;
          studentData.rollNo = index + 1 + student.rollNo;
          studentData.save();
          return studentData;
        }
      });
      Promise.all(promoteStudent).then((data) => res.json(data));
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
