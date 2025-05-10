const router = require("express").Router();
const { test } = require("../controllers/test");
router.post("/getData", test.addAttendes);
router.post("/attend/create", test.create);

module.exports = router;
