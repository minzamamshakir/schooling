const Admin = require("../modals/admin");
const Staff = require("../modals/staff");
const Permissions = require("../modals/permissions");
const User = require("../modals/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
const Register = require("../modals/register");
const logger = require("../config/logger");
exports.auth = {
  createAdmin: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        params: errors.array()[0].param,
        error: errors.array()[0].msg,
      });
    }

    const admin = new Admin(req.body);
    admin.save((err, admin) => {
      if (err) {
        logger.error(req.body, err);
        return res.status(400).json({
          error: "Not Able to save the user in DB",
        });
      } else {
        req.admin = admin._id;
        next();
      }
    });
  },

  signin: (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors);
      return res.status(422).json({
        params: errors.array()[0].param,
        error: errors.array()[0].msg,
      });
    }
    User.findOne({ email })
      .populate([
        { path: "permissions" },
        {
          path: "informativeModel",
          strictPopulate: false,
          populate: {
            path: "school",
            select: "name",
            strictPopulate: false,
          },
          select: "pic childs inchargeOf inActive section role",
        },
      ])
      .exec(async (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User Email Does Not Exist",
          });
        }
        if (req.body.password !== user.password) {
          return res.status(401).json({
            error: "email and password do not match",
          });
        }
        if (user.informativeModel.inActive == true) {
          return res.status(400).json({
            error: "Sorry You are inActive by Admin",
          });
        }
        // create Token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "2h",
        });
        // put Token in cookie
        res.cookie("token", token);
        // send response to front end
        const {
          _id,
          firstName,
          lastName,
          email,
          role,
          permissions,
          informativeModel,
        } = user;
        // const id = Buffer.from(_id);
        // console.log(id.toString());
        // const userId = id.toString()
        // const permission = await Permissions.findOne({
        //   permissionsOf: userId,
        // });
        return res.json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
            permissions,
            informativeModel,
          },
        });
      });
    return;
  },

  signout: (req, res) => {
    res.clearCookie("token");

    res.json({
      message: "User Signout",
    });
  },

  // protected routes
  isSignedIn: expressjwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
  }),

  // custom middlewares

  isAuthenticated: (req, res, next) => {
    let checker =
      req.profile && req.auth && req.profile._id.equals(req.auth._id);
    //   !req.profile.block;
    // if (req.profile.block) {
    //   return res
    //     .status(400)
    //     .json({ error: "account was blocked", block: true });
    // }
    if (!checker) {
      return res.status(403).json({
        error: "Access Denied form is Authenticated",
      });
    }
    next();
  },
  // role checks

  isSuperAdmin: (req, res, next) => {
    if (req.profile.role > 0) {
      return res.status(403).json({
        error: "Acess denied from 1",
      });
    }
    next();
  },
  isAdmin: (req, res, next) => {
    if (req.profile.role > 1) {
      return res.status(403).json({
        error: "Acess denied from 2",
      });
    }
    next();
  },
};
