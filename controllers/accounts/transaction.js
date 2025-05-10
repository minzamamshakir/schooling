const Transaction = require("../../modals/accounts/transaction");

exports.transaction = {
  create: (req, res) => {
    try {
      const trans = new Transaction(req.body);
      trans.session = req.body.session;
      trans.enteredBy = "Admin";
      trans.createdBy = req.profile._id;
      trans.save((err, obj) => {
        if (err) return res.status(400).json(err);
        else return res.json(obj);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      Transaction.find().exec((err, trans) => {
        if (err) return res.status(400).json(err);
        else return res.json(trans);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  incomeOfBalanceSheet: (req, res, next) => {
    try {
      Transaction.find({
        session: req.body.session,
      })
        .populate([
          {
            path: "inTermsOf",
            select: "name",
          },
        ])
        .sort([["createdAt", 1]])
        .exec((err, trans) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            res.json(trans);
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  expenseOfBalanceSheet: (req, res, next) => {
    try {
      Transaction.find({
        transactionType: "expense",
        session: req.body.session,
      })
        .populate([
          {
            path: "inTermsOf",
            select: "name",
          },
        ])
        .exec((err, trans) => {
          if (err) {
            return res.status(400).json(err);
          } else {
            res.json({
              income: req.income,
              expense: trans,
            });
          }
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateTransaction: (req, res) => {
    try {
      Transaction.find({}).exec((err, trans) => {
        if (err) {
          return res.status(400).json(err);
        } else {
          const updatedTrans = trans.map((data, index) => {
            Transaction.findOneAndUpdate(
              { _id: data._id },
              {
                $set: { session: req.body.session },
              },
              {
                new: true,
                userFindAndModify: false,
              },
              (err, transaction) => {
                if (err) return res.status(400).json(err);
                return transaction;
              }
            );
          });
          Promise.all(updatedTrans).then((data) => {
            res.json(data);
          });
        }
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
