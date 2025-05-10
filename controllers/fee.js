const Fee = require("../modals/fee");
const Class = require("../modals/class");
const { validationResult } = require("express-validator");
exports.fee = {
  create: (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) return res.status(400).json(err);
      const fee = new Fee(req.body);
      fee.createdBy = req.profile._id;
      fee.save((err, fee) => {
        if (err) return res.status(400).json(err);
        Class.findOneAndUpdate(
          { _id: req.body.class },
          {
            $set: { defaultFee: fee._id },
          },
          { new: true, userFindAndModify: false },
          (err, classes) => {
            if (err) return res.status(400).json(err);
            return res.json(classes);
          }
        );
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Fee.find()
        .populate("class", "name")
        .exec((err, fee) => {
          if (err) return res.status(400).json(err);
          return res.json(fee);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  findOne: (req, res) => {
    try {
      Fee.find({
        $and: [
          ({ school: req.body.school },
          { session: req.body.session },
          { class: req.body.class }),
        ],
      }).exec((err, fee) => {
        if (err) return res.status(400).json(err);
        res.json(fee);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
