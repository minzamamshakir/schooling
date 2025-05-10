const Result = require("../../modals/exams/result");
const DateSheet = require("../../modals/exams/dateSheet");
const Section = require("../../modals/section");
const Student = require("../../modals/student");
const { Class } = require("../../modals/class");
exports.result = {
  create: async (req, res, next) => {
    try {
      const wait = (milliseconds) =>
        new Promise((res, rej) => {
          setTimeout(() => {
            res();
          }, milliseconds);
        });
      const dateSheet = await DateSheet.findOne({
        school: req.body.school,
        session: req.body.session,
        section: req.body.section,
      });
      console.log(dateSheet);
      const subjectWiseResult = req.body.resultData.map((dataForResult) => {
        const result = new Result({
          school: req.body.school,
          session: req.body.session,
          section: req.body.section,
          term: req.body.term,
          studentName: dataForResult.stdName,
          admissionNo: dataForResult.admissionNo,
          subjects: dataForResult.subjects,
        });
        let totalObtainedMarks = 0;
        let grandTotal = 0;
        dataForResult.subjects.map((dataForGrade, i) => {
          totalObtainedMarks = +dataForGrade.obtMarks + totalObtainedMarks;
          grandTotal = +dataForGrade.totalMarks + grandTotal;
          if (i == dataForResult.subjects.length - 1) {
            result.totalObtainmarks = totalObtainedMarks;
            result.grandTotal = grandTotal;
            let percentage = (totalObtainedMarks / grandTotal) * 100;
            result.percentage = Math.round(percentage);
            switch (true) {
              case percentage >= 90 && percentage < 100:
                result.grade = "A+";
                break;
              case percentage >= 80 && percentage < 90:
                result.grade = "A";
                break;
              case percentage >= 70 && percentage < 80:
                result.grade = "B+";
                break;
              case percentage >= 65 && percentage < 70:
                result.grade = "B";
                break;
              case percentage >= 60 && percentage < 65:
                result.grade = "C";
                break;
              case percentage >= 55 && percentage < 60:
                result.grade = "D";
                break;
              case percentage >= 50 && percentage < 55:
                result.grade = "E";
                break;
              case percentage >= 40 && percentage < 50:
                result.grade = "F*";
                break;
              case percentage < 40:
                result.grade = "F";
                break;
            }
          }
        });
        result.save();
        return result;
      });
      Promise.allSettled(subjectWiseResult).then(async (data) => {
        req.result = data;
        await wait(5000);
        next();
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  positionOfStd: async (req, res) => {
    try {
      const result = await Result.find({
        session: req.body.session,
        section: req.body.section,
        term: req.body.term,
      }).sort([["totalObtainmarks", -1]]);
      const resultData = result.map((item, index) => {
        item.position = index + 1;
        item.save();
        return item;
      });
      Promise.allSettled(resultData).then((data) => {
        res.json(data);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  alltermResultBySection: (req, res, next) => {
    try {
      Result.find({
        section: req.body.section,
        session: req.body.session,
      })
        .sort([["admissionNo", 1]])
        .exec((err, result) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            req.allTerms = result;
            next();
          }
        });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getResultBySectionForPrint: async (req, res, next) => {
    try {
      const student = await Student.find({
        section: req.body.section,
      })
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "section",
            select: "name",
          },
        ])
        .sort([["admissionNo", 1]]);
      Result.find({
        section: req.body.section,
        session: req.body.session,
        term: req.body.examTerm,
      })
        .sort([["admissionNo", 1]])
        .exec((err, result) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            const allTermsResult = req.allTerms;
            res.json({ result, student, allTermsResult });
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getResultBySection: async (req, res, next) => {
    try {
      Result.find({
        section: req.body.section,
        session: req.body.session,
        term: req.body.examTerm,
      }).exec((err, result) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          res.json(result);
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getResultByStdRegNo: async (req, res, next) => {
    try {
      const student = await Student.find({
        admissionNo: req.body.admissionNo.toUpperCase(),
      }).populate([
        {
          path: "class",
          select: "name",
        },
        {
          path: "section",
          select: "name",
        },
      ]);
      Result.find({
        admissionNo: req.body.admissionNo.toUpperCase(),
        session: req.body.session,
        term: req.body.examTerm,
      }).exec((err, result) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          res.json({ result, student });
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateResult: (req, res, next) => {
    try {
      const secResult = req.body.resultData.map(async (data) => {
        const result = await Result.findOne({ _id: data._id });
        result.subjects = data.subjects;
        let totalObtainedMarks = 0;
        let grandTotal = 0;
        data.subjects.map((dataForGrade, i) => {
          totalObtainedMarks = +dataForGrade.obtMarks + totalObtainedMarks;
          grandTotal = +dataForGrade.totalMarks + grandTotal;
          if (i == data.subjects.length - 1) {
            result.totalObtainmarks = totalObtainedMarks;
            result.grandTotal = grandTotal;
            let percentage = (totalObtainedMarks / grandTotal) * 100;
            result.percentage = Math.round(percentage);
            switch (true) {
              case percentage >= 90 && percentage <= 100:
                result.grade = "A+";
                break;
              case percentage >= 80 && percentage < 90:
                result.grade = "A";
                break;
              case percentage >= 70 && percentage < 80:
                result.grade = "B+";
                break;
              case percentage >= 65 && percentage < 70:
                result.grade = "B";
                break;
              case percentage >= 60 && percentage < 65:
                result.grade = "C";
                break;
              case percentage >= 55 && percentage < 60:
                result.grade = "D";
                break;
              case percentage >= 50 && percentage < 55:
                result.grade = "E";
                break;
              case percentage >= 40 && percentage < 50:
                result.grade = "F*";
                break;
              case percentage < 40:
                result.grade = "F";
                break;
            }
          }
        });
        result.save();
        return result;
      });
      Promise.allSettled(secResult).then((data) => next());
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  studentStrengthForResult: (req, res, next) => {
    try {
      Result.find({
        session: req.body.session,
        term: req.body.examTerm,
      })
        .countDocuments()
        .exec((err, result) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            res.json(result);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  passStudentStrengthForResult: (req, res, next) => {
    try {
      Result.find({
        session: req.body.session,
        term: req.body.examTerm,
        $and: [{ grade: { $ne: "F" } }, { grade: { $ne: "F*" } }],
      })
        .countDocuments()
        .exec((err, result) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            res.json(result);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  failStudentStrengthForResult: (req, res, next) => {
    try {
      Result.find({
        session: req.body.session,
        term: req.body.examTerm,
        grade: "F",
      })
        .countDocuments()
        .exec((err, result) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            res.json(result);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  failButPromoteStudentStrengthForResult: (req, res, next) => {
    try {
      Result.find({
        session: req.body.session,
        term: req.body.examTerm,
        grade: "F*",
      })
        .countDocuments()
        .exec((err, result) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            res.json(result);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  classStrengthForResult: (req, res, next) => {
    try {
      Class.find({ school: req.body.school, session: req.body.session })
        .select("_id name")
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const newData =
              data &&
              data.map(async (item) => {
                const section = await Section.find({
                  class: item._id,
                }).select("_id");
                let sectionCount = 0;
                const classData = section.map(async (data, index) => {
                  const result = await Result.find({
                    section: data._id,
                    session: req.body.session,
                    term: req.body.examTerm,
                  }).countDocuments();
                  sectionCount = result + sectionCount;
                  if (index == section.length - 1) {
                    return { count: sectionCount, className: item.name };
                  }
                });
                return Promise.all(classData);
              });
            Promise.all(newData)
              .then((data) => {
                let updateData = data.map((upData) => {
                  let allData = upData.filter((filterData) => {
                    if (filterData !== undefined) {
                      return filterData;
                    }
                  });
                  return allData;
                });
                Promise.all(updateData).then((result) => res.json(result));
              })
              .catch((err) => {
                res.status(400).json(err);
                return;
              });
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  passClassStrengthForResult: async (req, res) => {
    try {
      Class.find({ school: req.body.school, session: req.body.session })
        .select("_id name")
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const newData =
              data &&
              data.map(async (item) => {
                const section = await Section.find({
                  class: item._id,
                }).select("_id");
                let sectionCount = 0;
                const classData = section.map(async (data, index) => {
                  const result = await Result.find({
                    section: data._id,
                    session: req.body.session,
                    term: req.body.examTerm,
                    $and: [{ grade: { $ne: "F" } }, { grade: { $ne: "F*" } }],
                  }).countDocuments();
                  sectionCount = result + sectionCount;
                  if (index == section.length - 1) {
                    return { count: sectionCount, className: item.name };
                  }
                });
                return Promise.all(classData);
              });
            Promise.all(newData)
              .then((data) => {
                let updateData = data.map((upData) => {
                  let allData = upData.filter((filterData) => {
                    if (filterData !== undefined) {
                      return filterData;
                    }
                  });
                  return allData;
                });
                Promise.all(updateData).then((result) => res.json(result));
              })
              .catch((err) => {
                res.status(400).json(err);
                return;
              });
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  failClassStrengthForResult: async (req, res) => {
    try {
      Class.find({ school: req.body.school, session: req.body.session })
        .select("_id name")
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const newData =
              data &&
              data.map(async (item) => {
                const section = await Section.find({
                  class: item._id,
                }).select("_id");
                let sectionCount = 0;
                const classData = section.map(async (data, index) => {
                  const result = await Result.find({
                    section: data._id,
                    session: req.body.session,
                    term: req.body.examTerm,
                    grade: "F",
                  }).countDocuments();
                  sectionCount = result + sectionCount;
                  if (index == section.length - 1) {
                    return { count: sectionCount, className: item.name };
                  }
                });
                return Promise.all(classData);
              });
            Promise.all(newData)
              .then((data) => {
                let updateData = data.map((upData) => {
                  let allData = upData.filter((filterData) => {
                    if (filterData !== undefined) {
                      return filterData;
                    }
                  });
                  return allData;
                });
                Promise.all(updateData).then((result) => res.json(result));
              })
              .catch((err) => {
                res.status(400).json(err);
                return;
              });
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  failButPromoteClassStrengthForResult: async (req, res, next) => {
    try {
      Class.find({ school: req.body.school, session: req.body.session })
        .select("_id name")
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            const newData =
              data &&
              data.map(async (item) => {
                const section = await Section.find({
                  class: item._id,
                }).select("_id");
                let sectionCount = 0;
                const classData = section.map(async (data, index) => {
                  const result = await Result.find({
                    section: data._id,
                    session: req.body.session,
                    term: req.body.examTerm,
                    grade: "F*",
                  }).countDocuments();
                  sectionCount = result + sectionCount;
                  if (index === section.length - 1) {
                    return { count: sectionCount, className: item.name };
                  }
                });
                return Promise.all(classData);
              });
            Promise.all(newData)
              .then((data) => {
                let updateData = data.map((upData) => {
                  let allData = upData.filter((filterData) => {
                    if (filterData !== undefined) {
                      return filterData;
                    }
                  });
                  return allData;
                });
                Promise.all(updateData).then((result) => res.json(result));
              })
              .catch((err) => {
                res.status(400).json(err);
                return;
              });
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  deleteDuplicate: (req, res) => {
    try {
      var duplicates = [];

      Result.aggregate(
        [
          {
            $match: {
              admissionNo: { $ne: "" },
              term: req.body.term, // discard selection criteria
            },
          },
          {
            $group: {
              _id: { admissionNo: "$admissionNo" }, // can be grouped on multiple properties
              dups: { $addToSet: "$_id" },
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              count: { $gt: 1 }, // Duplicates considered as count greater than one
            },
          },
        ],
        { allowDiskUse: true } // For faster processing if set is larger
      ).exec((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          data.forEach(function (doc) {
            doc.dups.shift(); // First element skipped for deleting
            doc.dups.forEach(function (dupId) {
              duplicates.push(dupId); // Getting all duplicate ids
            });
          });

          // If you want to Check all "_id" which you are deleting else print statement not needed
          // res.json(duplicates);

          // Remove all duplicates in one go
          const deletedData = duplicates.map(async (item) => {
            const data = await Result.findByIdAndDelete({ _id: item });
            return data;
          });
          Promise.all(deletedData).then((data1) => {
            res.json(data1);
          });
        }
      }); // You can display result until this and check duplicates
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
