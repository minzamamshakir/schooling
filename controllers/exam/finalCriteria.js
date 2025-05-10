const FinalCriteria = require("../../modals/exams/finalCriteria");
const Result = require("../../modals/exams/result");
const Student = require("../../modals/student");
const { ObjectId } = require("mongoose").Types;
exports.finalCriteria = {
  create: (req, res) => {
    try {
      Result.aggregate([
        {
          $match: {
            session: ObjectId(req.body.session),
          },
        },
        {
          $group: {
            _id: {
              admissionNo: "$admissionNo",
              section: "$section",
              session: "$session",
              school: "$school",
              name: "$studentName",
            },
            totalPecentage: {
              $push: {
                term: "$term",
                percentage: "$percentage",
              },
            },
          },
        },
        {
          $unwind: "$totalPecentage",
        },
        {
          $sort: { "totalPecentage.term": 1 },
        },
        {
          $group: {
            _id: "$_id",
            totalPecentage: { $push: "$totalPecentage" },
          },
        },
        {
          $project: {
            _id: 1,
            totalPecentage: 1,
          },
        },
      ]).exec((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          const termWiseData = req.body.examTerms.map((item, i) => {
            const manageData = data.map((itemData, index) => {
              if (
                itemData &&
                itemData.totalPecentage[i] &&
                itemData.totalPecentage[i].term == item.termName
              ) {
                return {
                  itemData: itemData._id,
                  term: itemData.totalPecentage[i].term,
                  totalPecentage:
                    itemData.totalPecentage[i].percentage *
                    (item.percentage / 100),
                };
              }
            }, {});
            return manageData;
          });
          Promise.all(termWiseData).then((outputData) => {
            const result = outputData.reduce((a, b) =>
              a.map((c, i) => {
                if (c && c.totalPecentage) {
                  return {
                    stdData: b[i].itemData,
                    totalPecentage: Math.round(
                      c.totalPecentage + b[i].totalPecentage
                    ),
                  };
                }
              })
            );
            // res.json(result);
            const allResults = result.map((finalResData) => {
              const finalCriteria = new FinalCriteria({
                school: finalResData.stdData.school,
                session: finalResData.stdData.session,
                section: finalResData.stdData.section,
                studentName: finalResData.stdData.name,
                admissionNo: finalResData.stdData.admissionNo,
                percentage: finalResData.totalPecentage,
              });
              switch (true) {
                case finalResData.totalPecentage >= 90 &&
                  finalResData.totalPecentage <= 100:
                  finalCriteria.grade = "A+";
                  break;
                case finalResData.totalPecentage >= 80 &&
                  finalResData.totalPecentage < 90:
                  finalCriteria.grade = "A";
                  break;
                case finalResData.totalPecentage >= 70 &&
                  finalResData.totalPecentage < 80:
                  finalCriteria.grade = "B+";
                  break;
                case finalResData.totalPecentage >= 65 &&
                  finalResData.totalPecentage < 70:
                  finalCriteria.grade = "B";
                  break;
                case finalResData.totalPecentage >= 60 &&
                  finalResData.totalPecentage < 65:
                  finalCriteria.grade = "C";
                  break;
                case finalResData.totalPecentage >= 55 &&
                  finalResData.totalPecentage < 60:
                  finalCriteria.grade = "D";
                  break;
                case finalResData.totalPecentage >= 50 &&
                  finalResData.totalPecentage < 55:
                  finalCriteria.grade = "E";
                  break;
                case finalResData.totalPecentage >= 40 &&
                  finalResData.totalPecentage < 50:
                  finalCriteria.grade = "F*";
                  break;
                case finalResData.totalPecentage < 40:
                  finalCriteria.grade = "F";
                  break;
              }
              finalCriteria.save();
              return finalCriteria;
            });
            Promise.all(allResults).then((newFinalCriteriaData) =>
              res.json(newFinalCriteriaData)
            );
          });
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getFailStudents: async (req, res) => {
    try {
      const finalResult = await FinalCriteria.find({
        section: req.body.section,
        grade: "F",
      });
      const studentData = finalResult.map(async (stdData) => {
        const std = await Student.findOne({
          admissionNo: stdData.admissionNo,
          section: req.body.section,
          inActive: { $ne: true },
        });
        if (std !== null) {
          return {
            student: std,
            grade: stdData.grade,
            percentage: stdData.percentage,
          };
        }
      });
      Promise.all(studentData).then((data) => {
        const failStdData = data.filter((newData) => {
          if (newData !== undefined) {
            return newData;
          }
        });
        res.json(failStdData);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  finalCriteriaForAnnual: (req, res) => {
    try {
      Result.aggregate([
        {
          $match: {
            session: ObjectId(req.body.session),
          },
        },
        {
          $group: {
            _id: {
              admissionNo: "$admissionNo",
              section: "$section",
              session: "$session",
              school: "$school",
              name: "$studentName",
            },
            totalPecentage: {
              $push: {
                term: "$term",
                obtainMarks: "$totalObtainmarks",
                totalMarks: "$grandTotal",
              },
            },
          },
        },
        {
          $unwind: "$totalPecentage",
        },
        {
          $sort: { "totalPecentage.term": 1 },
        },
        {
          $group: {
            _id: "$_id",
            totalPecentage: { $push: "$totalPecentage" },
          },
        },
        {
          $project: {
            _id: 1,
            totalPecentage: 1,
          },
        },
      ]).exec((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          const ResultData = data.map((itemData, index) => {
            let obtOfAllTerms = 0;
            let totalOfAllTerms = 0;
            const manageData = itemData.totalPecentage.map(
              (resultdata, index) => {
                obtOfAllTerms = obtOfAllTerms + resultdata.obtainMarks;
                totalOfAllTerms = totalOfAllTerms + resultdata.totalMarks;
                if (index == itemData.totalPecentage.length - 1) {
                  const percentage = Math.round(
                    obtOfAllTerms * (100 / totalOfAllTerms)
                  );
                  return {
                    stdData: itemData._id,
                    totalPecentage: percentage,
                  };
                }
              }
            );
            const filteration = manageData.filter((dataFilter) => {
              if (dataFilter !== undefined) {
                return dataFilter;
              }
            });
            return filteration;
          });

          Promise.all(ResultData).then((outputData) => {
            // res.json(result);
            const allResults = outputData.map((finalResData) => {
              const finalCriteria = new FinalCriteria({
                school: finalResData[0].stdData.school,
                session: finalResData[0].stdData.session,
                section: finalResData[0].stdData.section,
                studentName: finalResData[0].stdData.name,
                admissionNo: finalResData[0].stdData.admissionNo,
                percentage: finalResData[0].totalPecentage,
              });
              switch (true) {
                case finalResData[0].totalPecentage >= 90 &&
                  finalResData[0].totalPecentage <= 100:
                  finalCriteria.grade = "A+";
                  break;
                case finalResData[0].totalPecentage >= 80 &&
                  finalResData[0].totalPecentage < 90:
                  finalCriteria.grade = "A";
                  break;
                case finalResData[0].totalPecentage >= 70 &&
                  finalResData[0].totalPecentage < 80:
                  finalCriteria.grade = "B+";
                  break;
                case finalResData[0].totalPecentage >= 65 &&
                  finalResData[0].totalPecentage < 70:
                  finalCriteria.grade = "B";
                  break;
                case finalResData[0].totalPecentage >= 60 &&
                  finalResData[0].totalPecentage < 65:
                  finalCriteria.grade = "C";
                  break;
                case finalResData[0].totalPecentage >= 55 &&
                  finalResData[0].totalPecentage < 60:
                  finalCriteria.grade = "D";
                  break;
                case finalResData[0].totalPecentage >= 50 &&
                  finalResData[0].totalPecentage < 55:
                  finalCriteria.grade = "E";
                  break;
                case finalResData[0].totalPecentage >= 40 &&
                  finalResData[0].totalPecentage < 50:
                  finalCriteria.grade = "F*";
                  break;
                case finalResData[0].totalPecentage < 40:
                  finalCriteria.grade = "F";
                  break;
              }
              finalCriteria.save();
              console.log({
                grade: finalCriteria.grade,
                regNum: finalCriteria.admissionNo,
                total: finalCriteria.percentage,
              });
              return finalCriteria;
            });
            Promise.all(allResults).then((newFinalCriteriaData) =>
              res.json(newFinalCriteriaData)
            );
          });
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
