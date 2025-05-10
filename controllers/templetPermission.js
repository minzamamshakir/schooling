const TempletPermission = require("../modals/templetPermission");

exports.templet = {
  create: (req, res) => {
    try {
      const temp = new TempletPermission(req.body);
      temp.save((err, obj) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(obj);
        }
      });
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  getTemplets: (req, res) => {
    try {
      TempletPermission.find().exec((err, obj) => {
        if (err) {
          res.status(400).json(err);
          return;
        } else {
          res.json(obj);
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

};
