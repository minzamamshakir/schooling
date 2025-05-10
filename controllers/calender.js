const { Day, Month, Calender } = require("../modals/calender/calender");
const Current = require("../modals/current");
const Attendance = require("../modals/attendance");
const logger = require("../config/logger");
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
diff = (from, to) => {
  const arr1 = [];
  const arr2 = [];
  const datFrom = new Date(from);
  const datTo = new Date(to);
  const dayFrom = datFrom.getDate();
  const dayTo = datTo.getDate();
  const fromYear = datFrom.getFullYear();
  const toYear = datTo.getFullYear();
  const diffYear = 12 * (toYear - fromYear) + datTo.getMonth();

  for (let i = datFrom.getMonth(); i <= diffYear; i++) {
    arr1.push(i % 12);
    arr2.push(Math.floor(fromYear + i / 12));
  }

  return [arr1, arr2, dayFrom, dayTo];
};
const getAllDaysInMonth = (year, month, day) => {
  const date = new Date(year, month, day);

  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};
const genrateCalender = (from, to) => {
  const data = diff(from, to);
  const month = data[0];
  const year = data[1];
  const fromDate = data[2];
  const toDate = data[3];
  const obj = {};
  for (let i = 0; i < month.length; i++) {
    obj[`${monthNames[month[i]]}${year[i]}`] = getAllDaysInMonth(
      year[i],
      month[i],
      i === 0 ? fromDate : 1
    );
  }
  obj[Object.keys(obj)[Object.keys(obj).length - 1]] = obj[
    Object.keys(obj)[Object.keys(obj).length - 1]
  ].slice(0, toDate + 1);
  return obj;
};
exports.calender = {
  create: (req, res) => {
    try {
      const obj = genrateCalender(req.body.from, req.body.to);

      const calender = new Calender();
      const months = Object.keys(obj);
      const monthArr = months.map((month) => {
        const newDate = new Date(month);
        const monthObj = new Month({
          name: month,
          days: [
            ...obj[month].map((day) => {
              const obj = new Day({ date: day });
              return obj;
            }),
          ],
        });
        return monthObj;
      });
      calender.year = [...monthArr];
      calender.name = `${new Date(req.body.from).getFullYear()}-${new Date(
        req.body.to
      ).getFullYear()}`;
      calender.save((err, calender) => {
        if (err) return res.status(400).json(err);
        res.json(calender);
      });
    } catch (err) {
      logger.error(err);
    }
  },
  all: (req, res) => {
    Calender.find().exec((err, calender) => {
      if (err) res.status(404).json(err);
      res.json(calender);
    });
  },
};

let nowDate;
Current.find().exec((err, current) => {
  if (err) {
    logger.error(err);
  }
  if (current.length) nowDate = current[0];
  else {
    const obj = new Current({
      day: new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Karachi",
      }),
      month: new Date().getMonth(),
    });
    obj.save((err, current) => {
      if (err) return;
      logger.info(current);
      nowDate = current;
    });
  }
});
nowDate &&
  setInterval(async () => {
    const date = new Date().toLocaleDateString("en-US", {
      timeZone: "Asia/Karachi",
    });

    if (new Date(nowDate.day) !== date) {
      Current.findOneAndUpdate(
        { _id: nowDate._id },
        {
          $set: { day: date },
        },
        (err, date) => {
          if (err) return;
          logger.info(date);
          nowDate = date;
        }
      );
      logger.info("call meow", nowDate);
    }
    if (nowDate.month !== date.getMonth()) {
      Current.findOneAndUpdate(
        { _id: nowDate._id },
        {
          $set: { month: date.getMonth() },
        },
        (err, date) => {
          if (err) return;
         logger.info(date);
          nowDay = date;
        }
      );
    }
  }, 1200);
