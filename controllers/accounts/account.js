const Account = require("../../modals/accounts/account");

exports.account = {
  checkAccountMWare: (req, res, next) => {
    try {
      const data = {};
      if (req.body.month.length) {
        req.body.month.map((mon) => {
          Account.findOne({ month: mon }).exec((err, account) => {
            if (account) data[mon] = account._id;
            else {
              data[mon] = "notFound";
            }
          });
        });
        req.accounts = data;
        next();
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  create: (req, res) => {
    const account = new Account(req.body);
    account.createdBy = req.profile._id;
    account.save((err, account) => {
      if (err) return res.satus(400).json(err);
      return res.json(account);
    });
  },
  createAccountMWare: (req, res, next) => {
    if (typeof req.account === typeof undefined) {
      try {
        const account = new Account(req.body);
        account.createdBy = req.profile._id;
        account.save((err, account) => {
          if (err) return res.satus(400).json(err);
          else {
            req.account = account;
            next();
          }
        });
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      next();
    }
  },
};
