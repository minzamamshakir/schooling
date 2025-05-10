const { StudentsFee } = require("../modals/accounts/fee");
const Result = require("../modals/exams/result");
const Transaction = require("../modals/accounts/transaction");
const { ObjectId } = require("mongoose").Types;

exports.aggregate = {
  getTotalFeeDataOfClassesByMonth: (req, res) => {
    try {
      StudentsFee.aggregate([
        {
          $facet: {
            paid: [
              {
                $match: {
                  chargedMonth: req.body.month,
                  session: ObjectId(req.body.session),
                  paid: true,
                },
              },
              {
                $lookup: {
                  from: "students",
                  localField: "student",
                  foreignField: "_id",
                  as: "data",
                },
              },
              { $unwind: "$data" },
              {
                $group: {
                  _id: "$data.class",
                  sum: { $sum: "$due" },
                },
              },
              {
                $lookup: {
                  from: "classes",
                  localField: "_id",
                  foreignField: "_id",
                  as: "classData",
                },
              },
              { $unwind: "$classData" },
              {
                $addFields: {
                  name: "$classData.name",
                  school: "$classData.school",
                  sum: "$sum",
                },
              },
              {
                $project: {
                  _id: 1,
                  sum: 1,
                  name: 1,
                  school: 1,
                },
              },
              { $sort: { _id: 1 } },
            ],
            unPaid: [
              {
                $match: {
                  chargedMonth: req.body.month,
                  session: ObjectId(req.body.session),
                  paid: false,
                },
              },
              {
                $lookup: {
                  from: "students",
                  localField: "student",
                  foreignField: "_id",
                  as: "data",
                },
              },
              { $unwind: "$data" },
              {
                $group: {
                  _id: "$data.class",
                  sum: { $sum: "$due" },
                  count: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  from: "classes",
                  localField: "_id",
                  foreignField: "_id",
                  as: "classData",
                },
              },
              { $unwind: "$classData" },
              {
                $addFields: {
                  name: "$classData.name",
                  school: "$classData.school",
                  sum: "$sum",
                  count: "$count",
                },
              },
              {
                $project: {
                  _id: 1,
                  sum: { $ifNull: ["$sum", "0"] },
                  name: 1,
                  school: 1,
                  count: 1,
                },
              },
              { $sort: { _id: 1 } },
            ],
            total: [
              {
                $match: {
                  chargedMonth: req.body.month,
                  session: ObjectId(req.body.session),
                },
              },
              {
                $lookup: {
                  from: "students",
                  localField: "student",
                  foreignField: "_id",
                  as: "data",
                },
              },
              { $unwind: "$data" },
              {
                $group: {
                  _id: "$data.class",
                  sum: { $sum: "$due" },
                },
              },
              {
                $lookup: {
                  from: "classes",
                  localField: "_id",
                  foreignField: "_id",
                  as: "classData",
                },
              },
              { $unwind: "$classData" },
              {
                $addFields: {
                  name: "$classData.name",
                  school: "$classData.school",
                  sum: "$sum",
                },
              },
              {
                $project: {
                  _id: 1,
                  sum: 1,
                  name: 1,
                  school: 1,
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ])
        // .limit(2)
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(data);
            return;
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getSchoolFeeByMonth: (req, res) => {
    try {
      StudentsFee.aggregate([
        {
          $match: { chargedMonth: "nov" },
        },
        {
          $group: {
            _id: "Total",
            sum: { $sum: "$due" },
          },
        },
      ]).exec((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(data);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getSchoolFeeAllMonth: (req, res) => {
    try {
      StudentsFee.aggregate([
        {
          $facet: {
            total: [
              {
                $match: { session: ObjectId(req.body.session) },
              },
              {
                $group: {
                  _id: {
                    month: "$chargedMonth",
                  },
                  sum: { $sum: "$due" },
                },
              },
              {
                $addFields: {
                  month: "$_id.month",
                  sum: "$sum",
                },
              },
              {
                $project: {
                  month: 1,
                  sum: 1,
                  _id: 0,
                },
              },
              { $sort: { month: -1 } },
            ],
            paid: [
              {
                $match: { session: ObjectId(req.body.session), paid: true },
              },
              {
                $group: {
                  _id: {
                    month: "$chargedMonth",
                  },
                  sum: { $sum: "$due" },
                },
              },
              {
                $addFields: {
                  month: "$_id.month",
                  sum: "$sum",
                },
              },
              {
                $project: {
                  month: 1,
                  sum: 1,
                  _id: 0,
                },
              },
              { $sort: { month: -1 } },
            ],
            unPaid: [
              {
                $match: { session: ObjectId(req.body.session), paid: false },
              },
              {
                $group: {
                  _id: {
                    month: "$chargedMonth",
                  },
                  sum: { $sum: "$due" },
                },
              },
              {
                $addFields: {
                  month: "$_id.month",
                  sum: "$sum",
                },
              },
              {
                $project: {
                  month: 1,
                  sum: 1,
                  _id: 0,
                },
              },
              { $sort: { month: -1 } },
            ],
          },
        },
      ]).exec((err, data) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(data);
          return;
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },

  // getFeeDataOfClassesByMonth: (req, res) => {
  //   try {
  //     const sort = { id: 1 };
  //     StudentsFee.aggregate([
  //       {
  //         $match: {
  //           chargedMonth: req.body.month,
  //           session: ObjectId(req.body.session),
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "students",
  //           localField: "student",
  //           foreignField: "_id",
  //           as: "data",
  //         },
  //       },
  //       { $unwind: "$data" },
  //       { $addFields: { filter: { $toString: "$paid" } } },
  //       {
  //         $group: {
  //           _id: { filter: "$filter", class: "$data.class" },
  //           sum: { $sum: "$due" },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "classes",
  //           localField: "_id.class",
  //           foreignField: "_id",
  //           as: "classData",
  //         },
  //       },
  //       { $unwind: "$classData" },
  //       {
  //         $addFields: {
  //           className: "$classData.name",
  //           id: "$_id.class",
  //           filter: "$_id.filter",
  //         },
  //       },
  //       {
  //         $project: {
  //           className: 1,
  //           id: 1,
  //           filter: 1,
  //           sum: 1,
  //           _id: 0,
  //         },
  //       },
  //     ])
  //       .sort(sort)
  //       // .limit(2)
  //       .exec((err, data) => {
  //         if (err) {
  //           res.status(400).json(err);
  //           return;
  //         } else {
  //           res.json(data);
  //           return;
  //         }
  //       });
  //   } catch (err) {
  //     res.status(500).json(err);
  //     return;
  //   }
  // },
  getDataForResult: (req, res) => {
    try {
      Result.aggregate([
        {
          $facet: {
            total: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                },
              },
              {
                $count: "total",
              },
            ],
            pass: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                  $and: [{ grade: { $ne: "F" } }, { grade: { $ne: "F*" } }],
                },
              },
              {
                $count: "pass",
              },
            ],
            fail: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                  grade: "F",
                },
              },
              {
                $count: "fail",
              },
            ],
            failButPromote: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                  grade: "F*",
                },
              },
              {
                $count: "promote",
              },
            ],
          },
        },
      ])
        // .limit(2)
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(data);
            return;
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getResultDataOfClasses: (req, res) => {
    try {
      Result.aggregate([
        {
          $facet: {
            total: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                },
              },
              {
                $lookup: {
                  from: "sections",
                  localField: "section",
                  foreignField: "_id",
                  as: "data",
                },
              },
              { $unwind: "$data" },
              {
                $group: {
                  _id: "$data.class",
                  count: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  from: "classes",
                  localField: "_id",
                  foreignField: "_id",
                  as: "classData",
                },
              },
              { $unwind: "$classData" },
              {
                $addFields: {
                  name: "$classData.name",
                  school: "$classData.school",
                },
              },
              {
                $project: {
                  _id: 1,
                  count: 1,
                  name: 1,
                  school: 1,
                },
              },
              { $sort: { _id: 1 } },
            ],
            pass: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                  $and: [{ grade: { $ne: "F" } }, { grade: { $ne: "F*" } }],
                },
              },
              {
                $lookup: {
                  from: "sections",
                  localField: "section",
                  foreignField: "_id",
                  as: "data",
                },
              },
              { $unwind: "$data" },
              {
                $group: {
                  _id: "$data.class",
                  count: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  from: "classes",
                  localField: "_id",
                  foreignField: "_id",
                  as: "classData",
                },
              },
              { $unwind: "$classData" },
              {
                $addFields: {
                  name: "$classData.name",
                  school: "$classData.school",
                },
              },
              {
                $project: {
                  _id: 1,
                  count: 1,
                  name: 1,
                  school: 1,
                },
              },
              { $sort: { _id: 1 } },
            ],
            fail: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                  grade: "F",
                },
              },
              {
                $lookup: {
                  from: "sections",
                  localField: "section",
                  foreignField: "_id",
                  as: "data",
                },
              },
              { $unwind: "$data" },
              {
                $group: {
                  _id: "$data.class",
                  count: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  from: "classes",
                  localField: "_id",
                  foreignField: "_id",
                  as: "classData",
                },
              },
              { $unwind: "$classData" },
              {
                $addFields: {
                  name: "$classData.name",
                  school: "$classData.school",
                },
              },
              {
                $project: {
                  _id: 1,
                  count: 1,
                  name: 1,
                  school: 1,
                },
              },
              { $sort: { _id: 1 } },
            ],
            failButPromote: [
              {
                $match: {
                  session: ObjectId(req.body.session),
                  term: req.body.examTerm,
                  grade: "F*",
                },
              },
              {
                $lookup: {
                  from: "sections",
                  localField: "section",
                  foreignField: "_id",
                  as: "data",
                },
              },
              { $unwind: "$data" },
              {
                $group: {
                  _id: "$data.class",
                  count: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  from: "classes",
                  localField: "_id",
                  foreignField: "_id",
                  as: "classData",
                },
              },
              { $unwind: "$classData" },
              {
                $addFields: {
                  name: "$classData.name",
                  school: "$classData.school",
                },
              },
              {
                $project: {
                  _id: 1,
                  count: 1,
                  name: 1,
                  school: 1,
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ])
        // .limit(2)
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(data);
            return;
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  aggregateOfTransaction: (req, res) => {
    try {
      Transaction.aggregate([
        {
          $match: {
            session: ObjectId(req.body.session),
          },
        },
        {
          $lookup: {
            from: "inTermsOf",
            localField: "inTermsOf",
            foreignField: "_id",
            as: "data",
          },
        },
        { $unwind: "$data" },
        {
          $addFields: {
            inTermsOf: "$data.name",
          },
        },
        {
          $project: {
            _id: 1,
            inTermsOf: 1,
            month: { $month: "$createdAt" },
          },
        },
        { $sort: { createdAt: 1 } },
      ])
        // .limit(2)
        .exec((err, data) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(data);
            return;
          }
        });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
};
