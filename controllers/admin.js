const User = require("../modals/user");
const Admin = require("../modals/admin");
exports.admin = {
  getUserById: (req, res, next, id) => {
    try {
      User.findById(id)
        .populate({ path: "permissions" })
        .exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "No user found in Db",
            });
          }
          req.profile = user;
          req.teacherId = user.informativeModel;
          req.permissions = user.permissions;
          next();
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getSingleAdmin: async (req, res) => {
    const admin = await Admin.findOne(req.profile.informativeModel);
    res.json(admin);
  },
  updateAdmin: (req, res) => {
    try {
      Admin.findOneAndUpdate(
        { _id: req.profile.informativeModel },
        {
          $set: req.body,
        },
        {
          new: true,
          userFindAndModify: false,
        },
        (err, admin) => {
          if (err) return res.status(400).json(err);
          return res.json(admin);
        }
      );
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
