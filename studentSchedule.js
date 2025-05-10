// const Student = require("./modals/student");
// const { attendance } = require("./controllers/attendance");
// const days = [
//   "sunday",
//   "saturday",
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
// ];
// const CronJob = require("cron").CronJob;
// const logger = require("./config/logger");
// exports.job = new CronJob(
//   "23 0 * * *",
//   function () {
//     try {
//       Student.find({}, "_id machine_id school class section")
//         .populate("school")
//         .exec((err, students) => {
//           if (err) return logger.error(err);
//          logger.info(students);
//           students.forEach((student) => {
//             if (
//               student &&
//               student.school &&
//               student.school.daysOf[days[new Date().getDay()]]
//             ) {
//               try {
//                 attendance.create(student);
//               } catch (err) {
//                 logger.error(err);
//               }
//               logger.info(student);
//             }
//           });
//         });
//     } catch (err) {
//       logger.error(err);
//     }
//   },
//   null,
//   true,
//   "Asia/Karachi"
// );
// const { attendance } = require("./controllers/attendance");
// const studentJob = schedule.scheduleJob("0 * * * * *", () => {
//   try {
//     Student.find({}, "_id machine_id school class section")
//       .populate("school")
//       .exec((err, students) => {
//         if (err) return console.log(err);
//         console.log(students);
//         students.forEach((student) => {
//           if (
//             student &&
//             student.school &&
//             student.school.daysOf[days[new Date().getDay()]]
//           ) {
//             try {
//               attendance.create(student);
//             } catch (err) {
//               console.log(err);
//             }
//             console.log(student);
//           }
//         });
//       });
//   } catch (err) {
//     console.log(err);
//   }
// });

// module.exports = studentJob;
