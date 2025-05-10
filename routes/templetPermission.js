const router = require("express").Router();
const { templet } = require("../controllers/templetPermission");
const { permissions } = require("../controllers/permissions");
const { auth } = require("../controllers/auth");
const { admin } = require("../controllers/admin");
router.param("superId", admin.getUserById);

router.post("/templetPermission/create", templet.create);

router.put(
  "/:superId/updatePermission",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canUpdatePermission,
  permissions.updatePermissions
);

module.exports = router;
