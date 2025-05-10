const AddCharges = require("../modals/addCharges");
const Student = require("../modals/student");
exports.charges = {
  create: (req, res) => {
    try {
      const addCharge = new AddCharges(req.body);
      addCharge.save((err, charge) => {
        if (err) return res.status(400).json(err);
        else return res.json(charge);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  addSchool: (req, res) => {
    try {
      const addCharge = new AddCharges(req.body);
      addCharge.school = req.school._id;
      addCharge.save((err, charge) => {
        if (err) return res.status(400).json(err);
        else return res.json(charge);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  addStudentCharges: async (req, res) => {
    try {
      const student = await Student.findOne({
        admissionNo: req.body.student,
        inActive: { $ne: true },
      })
        .populate([
          {
            path: "class",
            select: "name",
          },
          { path: "section", select: "name" },
        ])
        .select("admissionNo");
      if (student !== null) {
        const addCharge = new AddCharges(req.body);
        addCharge.studentDetail = student;
        addCharge.save((err, charge) => {
          if (err) {
            res.status(400).json(err);
            return;
          } else {
            res.json(charge);
            return;
          }
        });
      } else {
        res.status(400).json("Invalid RegNo.");
      }
    } catch (err) {
      res.stauts(500).json(err);
      return;
    }
  },

  chargeSchool: (req, res) => {
    try {
      const addCharge = new AddCharges(req.body);
      addCharge.save((err, charge) => {
        if (err) return res.status(400).json(err);
        else return res.json(charge);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getCharges: (req, res) => {
    try {
      AddCharges.find()
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "section",
            select: "name",
          },
        ])
        .exec((err, charges) => {
          if (err) return res.status(400).json(err);
          else res.json(charges);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  all: (req, res) => {
    try {
      AddCharges.find()
        .populate([
          {
            path: "class",
            select: "name",
          },
          {
            path: "section",
            populate: [
              {
                path: "class",
                select: "name",
              },
              {
                path: "school",
                select: "name",
              },
            ],
            select: "name",
          },
          {
            path: "school",
            select: "name",
          },
          {
            path: "studentDetail",
            populate: [
              {
                path: "class",
                select: "name",
              },
              {
                path: "section",
                select: "name",
              },
              {
                path: "school",
                select: "name",
              },
            ],
          },
        ])
        .exec((err, data) => {
          if (err) res.status(400).json(err);
          else res.json(data);
        });
    } catch (error) {
      return res.status(500).json(err);
    }
  },
};
