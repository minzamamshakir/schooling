// const Staff = require("./modals/staff");
// const schedule = require("node-schedule");

// const days = [
//   "sunday",
//   "saturday",
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
// ];
// const { attendance } = require("./controllers/attendance");
// const staffJob = schedule.scheduleJob("0 0 * * *", () => {
//   try {
//     Staff.find({}, "_id machine_id school")
//       .populate("school")
//       .exec((err, staffs) => {
//         if (err) return console.log(err);
//         staffs.forEach((singleStaff) => {
//           if (
//             singleStaff &&
//             singleStaff.school &&
//             singleStaff.school.daysOf[days[new Date().getDay()]]
//           ) {
//             try {
//               attendance.createStaff(singleStaff);
//             } catch (err) {
//               console.log(err);
//             }
//           }
//           console.log(staffs);
//         });
//       });
//   } catch (err) {
//     console.log(err);
//   }
// });

// module.exports = staffJob;
