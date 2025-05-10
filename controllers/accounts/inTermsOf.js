const InTermsOf = require("../../modals/accounts/intermsOf");
exports.inTermsOf = {
  create: (req, res) => {
    try {
      const obj = new InTermsOf(req.body);
      obj.enteredBy = "Admin";
      obj.createdBy = req.profile._id;
      obj.save((err, obj) => {
        if (err) return res.status(400).json(err);
        else {
          return res.json(obj);
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createStudentFee: (req, res, next) => {
    try {
      const obj = new InTermsOf({ name: "studentFee", typeOfAmount: "income" });
      obj.enteredBy = "Admin";
      obj.createdBy = req.profile._id;
      obj.save((err, obj) => {
        if (err) {
          req.interm = err;
          res.status(400).json(err);
          return;
        } else {
          req.interm = obj;
          next();
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  createStaffSalary: (req, res, next) => {
    try {
      const obj = new InTermsOf({ name: "salary", typeOfAmount: "expense" });
      obj.enteredBy = "Admin";
      obj.createdBy = req.profile._id;
      obj.save((err, obj) => {
        if (err) {
          req.interm = err;
          res.status(400).json(err);
          return;
        } else {
          req.interm = obj;
          next();
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },

  all: (req, res) => {
    try {
      InTermsOf.find().exec((err, obj) => {
        if (err) return res.status(400).json(err);
        else return res.json(obj);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  income: (req, res) => {
    try {
      InTermsOf.find({ typeOfAmount: "income" }).exec((err, obj) => {
        if (err) return res.status(400).json(err);
        else return res.json(obj);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  expense: (req, res) => {
    try {
      InTermsOf.find({ typeOfAmount: "expense" }).exec((err, obj) => {
        if (err) return res.status(400).json(err);
        else return res.json(obj);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  studentCharges: (req, res) => {
    try {
      InTermsOf.find({ typeOfAmount: "studentCharges" }).exec((err, obj) => {
        if (err) return res.status(400).json(err);
        else return res.json(obj);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
