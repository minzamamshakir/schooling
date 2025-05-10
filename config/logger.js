const { createLogger, format, transports } = require("winston");
let dev = process.env.NODE_ENV !== "production" ? "Console" : "File";
const logger = createLogger({
  transports: [
    new transports[dev]({
      filename: "info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports[dev]({
      filename: "error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});
module.exports = logger;
