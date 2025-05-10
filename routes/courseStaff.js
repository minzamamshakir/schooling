const router = require("express").Router();
const { course } = require("../controllers/courses");
const { auth } = require("../controllers/auth");
const { permissions } = require("../controllers/permissions");
const { admin } = require("../controllers/admin");
// const { staff } = require("../controllers/staff");
router.param("staffId", admin.getUserById);
// router.param("staffId", permissions.getPermissionsById);
router.param("courseId", course.getCourseById);
router.post(
  "/:staffId/course/create",
  auth.isSignedIn,
  auth.isAuthenticated,
  permissions.canCreateCourses,
  course.create
);
router.post(
  "/:staffId/course/byClassAndSection",
  auth.isSignedIn,
  auth.isAuthenticated,
  course.getCoursesBySectionAndClass
);
router.post(
  "/:staffId/course/byClass",
  auth.isSignedIn,
  auth.isAuthenticated,
  course.getCoursesByClass
);
router.post(
  "/:staffId/course/bySection",
  auth.isSignedIn,
  auth.isAuthenticated,
  course.getCoursesBySection
);
router.get("/:staffId/course", course.all);
router.get("/:staffId/course/compulsory", course.compulsory);
router.get("/:staffId/course/optional", course.optional);
router.post("/:staffId/course/getCourseByType", course.getCourseByType);
router.get("/:staffId/course/:courseId", course.getSingleCourse);
router.put("/:staffId/course/:courseId/update", course.updateCourse);

module.exports = router;
