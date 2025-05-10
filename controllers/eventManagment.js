const DateOfEvent = require("../modals/eventManagment/eventManagment");
const Event = require("../modals/eventManagment/event");

exports.eventManagement = {
  create: async (req, res) => {
    try {
      const nEvent = new Event({
        eventName: req.body.eventName,
        eventDescription: req.body.eventDescription,
        school: req.school._id,
      });
      nEvent.save((err, event) => {
        if (err) return res.status(400).json(err);
        else {
          const nDate = new DateOfEvent({
            startDate: req.body.startDate,
            tillDate: req.body.tillDate,
            key: event._id,
            school: req.school._id,
          });
          nDate.save((err, date) => {
            if (err) return res.json(err);
            else return res.json(date);
          });
        }
      });
    } catch (err) {
      return conosle.log(err);
    }
  },
  get: (req, res) => {
    try {
      DateOfEvent.find().exec((err, nEvent) => {
        if (err) return res.status(400).json(err);
        return res.json(nEvent);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getEventOfSchool: (req, res) => {
    try {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      DateOfEvent.find({
        school: req && req.school && req.school._id,
        startDate: {
          $gte: new Date(),
        },
      })
        .populate("key")
        .exec((err, nEvent) => {
          if (err) return res.status(400).json(err);
          return res.json(nEvent);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getAllSchoolDates: (req, res) => {
    try {
      DateOfEvent.find({
        school: req && req.school && req.school._id,
        startDate: {
          $gte: new Date(),
        },
      })
        .populate("key")
        .exec((err, dates) => {
          if (err) return res.status(400).json(err);
          else return res.json(dates);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getEventById: (req, res) => {
    try {
      Event.find({ _id: req.body.eventId }).exec((err, event) => {
        if (err) return res.status(400).json(err);
        else res.json(event);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateEvent: (req, res) => {
    try {
      Event.findOneAndUpdate(
        { _id: req.body.eventId },
        {
          $set: {
            eventDescription: req.body.eventDescription,
            eventName: req.body.eventName,
          },
        },
        { new: true, userFindAndModify: false },
        (err, event) => {
          if (err) res.status(400).json(err);
          else {
            DateOfEvent.findOneAndUpdate(
              { key: req.body.eventId },
              {
                $set: {
                  startDate: req.body.startDate,
                  tillDate: req.body.tillDate,
                },
              },
              { new: true, userFindAndModify: false },
              (err, DateEvent) => {
                if (err) res.status(400).json(err);
                res.json(DateEvent);
              }
            );
          }
        }
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
