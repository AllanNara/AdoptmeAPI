import winston from "winston";
import config from "../../config/index.js";

const customLevels = {
    levels: {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5
    },
    colors: {
      fatal: "red",
      error: "yellow",
      warning: "yellow",
      info: "green",
      http: "blue",
      debug: "white"
    }
};

winston.addColors(customLevels.colors);
const customLogger = winston.createLogger({
    levels: customLevels.levels,
})

if(config.NODE_ENV === "production") {
    customLogger.add(new winston.transports.Console({ level: "info" }));
    customLogger.add(new winston.transports.File({ filename: "logs/errors.log", level: "error" }));
    customLogger.format = winston.format.combine(
            winston.format.json(),
            winston.format.timestamp()
        )
} else {
    customLogger.add(new winston.transports.Console({ level: "debug" }));
    customLogger.format = winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp()
    )
}

export default customLogger

