const AddBonus = require("../modals/addBonus");
const Staff = require("../modals/staff");
exports.bonus = {
  addBonusToAllStaffsOfSchool: (req, res) => {
    try {
      const addBonus = new AddBonus(req.body);
      addBonus.school = req.school._id;
      addBonus.save((err, bonus) => {
        if (err) return res.status(400).json(err);
        else return res.json(bonus);
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  addSingleStaffBonus: async (req, res) => {
    try {
      const staff = await Staff.findOne({
        regNum: req.body.regNum,
        inActive: { $ne: true },
      }).select("regNum");
      if (staff !== null) {
        const addBonus = new AddBonus(req.body);
        addBonus.staffDetail = staff._id;
        addBonus.staff = staff.regNum;
        addBonus.save((err, charge) => {
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
  getBonus: (req, res) => {
    try {
      AddBonus.find(req.school._id)
        .populate("school", "name")
        .exec((err, charges) => {
          if (err) return res.status(400).json(err);
          else res.json(charges);
        });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
