const smsHandler = require("../commonHandlers/sms");
const constant = require("../commonHandlers/constant");
exports.sms = {
  sendSmsToNumberCustom: (req, res) => {
    try {
      smsHandler(req.body.to, req.body.msg, constant.Custom).then(
        ({ data }) => {
          res.json(data);
        }
      );
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
  sendSmsToMultiCustom: (req, res) => {
    try {
      if (Array.isArray(req.body.to)) {
        const data = req.body.to.map((number) => {
          setTimeout(() => {
            return smsHandler(number, req.body.msg, constant.Custom);
          }, 100);
        });
        Promise.allSettled(data).then(({ data }) => res.json(data));
      }
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  },
};
