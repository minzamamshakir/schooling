const Session = require("../modals/session");
const Level = require("../modals/level");
const Gender = require("../modals/gender");
const { Class, Fee } = require("../modals/class");
const Register = require("../modals/register");
const Section = require("../modals/section");

exports.duplicate = {
  forLevel: async (req, res, next) => {
    try {
      const session = await Session.findOne({ _id: req.body.oldSession })
        .select("duration")
        .populate([
          {
            path: "level",
            select: "name",
          },
        ]);
      if (session !== null) {
        const levelData = session.level.map((dataOfLevels) => {
          const newLevel = new Level({
            session: req.body.newSession,
            name: dataOfLevels.name,
            school: req.body.school,
          });
          newLevel.save();
          Session.findByIdAndUpdate(
            { _id: req.body.newSession },
            { $push: { level: newLevel._id } },
            { new: true, userFindAndModify: false },
            (err, session) => {
              if (err) return res.status(400).json(err);
              console.log(session);
            }
          );
          return newLevel;
        });
        Promise.all(levelData).then((data) => {
          req.level = data;
          next();
        });
      } else {
        res.status(400).json("Level not Created");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  forGender: async (req, res, next) => {
    try {
      const level = await Level.find({ session: req.body.oldSession })
        .select("name")
        .populate([
          {
            path: "gender",
            select: "name",
          },
        ])
        .sort([["name", -1]]);
      const newlevels = await Level.find({
        session: req.body.newSession,
      })
        .select("name")
        .sort([["name", -1]]);
      if (level.length !== 0) {
        const allNewGenders = level.map((dataOfLevels, index) => {
          const genderData = dataOfLevels.gender.map((dataOfGenders) => {
            const newGender = new Gender({
              session: req.body.newSession,
              name: dataOfGenders.name,
              school: req.body.school,
              level: newlevels[index]._id,
            });
            newGender.save();
            Level.findByIdAndUpdate(
              { _id: newlevels[index]._id },
              { $push: { gender: newGender._id } },
              { new: true, userFindAndModify: false },
              (err, level) => {
                if (err) {
                  return res.status(400).json(err);
                } else {
                  Register.findOne({ gender: dataOfGenders._id }).exec(
                    (err, register) => {
                      if (err) {
                        res.status(400).json(err);
                      } else if (register !== null && register.prefix) {
                        Register.findByIdAndUpdate(
                          { _id: register._id },
                          {
                            $set: {
                              level: newlevels[index]._id,
                              gender: newGender._id,
                            },
                          },
                          { new: true, userFindAndModify: true },
                          (err, updatedRegister) => {
                            if (err) return res.status(400).json(err);
                            else {
                              console.log({
                                updatedRegister,
                                level: level && level._id,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
            return newGender;
          });
          return genderData;
        });
        Promise.all(allNewGenders).then((data) => {
          req.gender = data;
          next();
        });
      } else {
        res.status(400).json("genders not Created");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  forClass: async (req, res, next) => {
    try {
      const wait = (milliseconds) =>
        new Promise((res, rej) => {
          setTimeout(() => {
            res();
          }, milliseconds);
        });
      const gender = await Gender.find({ session: req.body.oldSession })
        .select("name")
        .populate([
          {
            path: "classes",
          },
        ])
        .sort([["createdAt", 1]]);
      const newGenders = await Gender.find({
        session: req.body.newSession,
      }).sort([["createdAt", 1]]);
      if (gender.length !== 0) {
        const allNewClasses = gender.map((dataOfGenders, index) => {
          const classData = dataOfGenders.classes.map((dataOfClasses) => {
            const fee = new Fee({
              fee: dataOfClasses.defaultFee.fee,
              regFee: dataOfClasses.defaultFee.regFee,
            });
            const newClass = new Class({
              session: req.body.newSession,
              name: dataOfClasses.name,
              school: req.body.school,
              courses: dataOfClasses.courses,
              level: newGenders[index].level,
              gender: newGenders[index]._id,
              defaultFee: fee,
            });
            newClass.save();
            Gender.findByIdAndUpdate(
              { _id: newGenders[index]._id },
              { $push: { classes: newClass._id } },
              { new: true, userFindAndModify: false },
              (err, gender) => {
                if (err) {
                  return res.status(400).json(err);
                } else {
                  return console.log(gender);
                }
              }
            );
            return newClass;
          });
          return classData;
        });
        Promise.all(allNewClasses).then(async (data) => {
          req.classes = data;
          await wait(5000);
          next();
        });
      } else {
        res.status(400).json("Classes not Created");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  forSection: async (req, res, next) => {
    try {
      const classes = await Class.find({ session: req.body.oldSession })
        .select("name")
        .populate([
          {
            path: "section",
          },
        ])
        .sort([["name", 1]]);
      Class.find({
        session: req.body.newSession,
      })
        .sort([["name", 1]])
        .exec((err, newClasses) => {
          if (err || !newClasses) {
            res.status(400).json(err);
          } else {
            if (classes.length !== 0) {
              const allNewSections = classes.map((dataOfClasses, index) => {
                const SectionData = dataOfClasses.section.map(
                  (dataOfSections) => {
                    const newSection = new Section({
                      session: req.body.newSession,
                      name: dataOfSections.name,
                      school: req.body.school,
                      level: newClasses[index].level,
                      gender: newClasses[index].gender,
                      class: newClasses[index]._id,
                      color: dataOfSections.color,
                      courses: dataOfSections.courses,
                    });
                    newSection.save((err, sections) => {
                      if (err) {
                        return res.status(400).json(err);
                      } else {
                        Class.findByIdAndUpdate(
                          { _id: newClasses[index]._id },
                          { $push: { section: sections._id } },
                          { new: true, userFindAndModify: false },
                          (err, gender) => {
                            if (err) {
                              return res.status(400).json(err);
                            } else {
                              return console.log(gender.name);
                            }
                          }
                        );
                      }
                    });
                    return newSection;
                  }
                );
                return SectionData;
              });
              Promise.all(allNewSections).then((data) => {
                res.json({
                  section: data,
                  level: req.level,
                  gender: req.gender,
                  classes: req.classes,
                });
              });
            } else {
              res.status(400).json("Sections not Created");
            }
          }
        });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
