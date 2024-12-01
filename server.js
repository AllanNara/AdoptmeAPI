// import displayRoutes from "express-routemap";
import mongoose from "mongoose";
import app from "./src/app.js";
import logger from "./src/utils/winston.js";
import config from "./config/index.js";

const server = app.listen(config.PORT, () => {
  logger.info(`Listening on ${config.PORT}`);
});

mongoose.connection.on("connected", () => {
  logger.info("Mongo Database connected");
});

mongoose.connection.on("error", (error) => {
  logger.fatal(error);
});

export default server;
