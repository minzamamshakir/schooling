const backup = require("@evops/mongodb-backup");

exports.takeBackup = (req, res) => {
  backup({
    uri: process.env.DATABASE,
    root: `./backup/02-05-2023`,
    dbName: "ghazaliansDB",
    Option: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    callback: (err, data) => {
      console.log(err, data);
    },
  });
  res.send("ok");
};
