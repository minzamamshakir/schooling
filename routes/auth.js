const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
const { permissions } = require("../controllers/permissions");
const { user } = require("../controllers/user");
// params to get id of the admin
router.param("superId", admin.getUserById);
router.post(
  "/superAdmin/create",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  // we can check user is signed in
  auth.createAdmin,
  permissions.createStepForSuperAdmin,
  user.createStepForSuperAdmin
);
router.post(
  "/:superId/admin/create",
  [
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 3 char").isLength({
      min: 3,
    }),
  ],
  // we can check user is signed in
  auth.isSignedIn,
  auth.isAuthenticated,
  auth.isSuperAdmin,
  auth.createAdmin,
  permissions.createStep,
  user.createStep
);
router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password  field is required").isLength({
      min: 1,
    }),
  ],
  auth.signin
);
// router.post("/authenticate", authenticateUser);
router.get(
  "/:superId/singleAdmin",
  auth.isSignedIn,
  auth.isAuthenticated,
  // auth.isSuperAdmin,
  admin.getSingleAdmin
);
router.put(
  "/:superId/updateAdmin",
  auth.isSignedIn,
  auth.isAuthenticated,
  // auth.isSuperAdmin,
  admin.updateAdmin
);
router.post(
  "/:superId/updateUserForAdmin",
  auth.isSignedIn,
  auth.isAuthenticated,
  user.updateUserForAdmin
);
router.get("/signout", auth.signout);

module.exports = router;
