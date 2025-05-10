const router = require("express").Router();
const { register } = require("../controllers/register");
const { student } = require("../controllers/student");
const { admin } = require("../controllers/admin");
// getting auth controllers
const { auth } = require("../controllers/auth");
router.param("Id", admin.getUserById);
router.post("/newRegisterNo", register.newNum);
router.post("/guardianNo", register.guardNum);
router.post("/staffNo", register.staffNum);
router.get(
  "/:Id/certNo",
  auth.isSignedIn,
  auth.isAuthenticated,
  register.getCertNum
);
router.put(
  "/:Id/:id/certNo/update",
  auth.isSignedIn,
  auth.isAuthenticated,
  register.updateCertNum,
  student.updateStdCertNo
);
router.post("/searchUser", register.checkRegister, register.findUser);

module.exports = router;
