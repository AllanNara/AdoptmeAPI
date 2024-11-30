// import displayRoutes from "express-routemap";
import mongoose from "mongoose";
import app from "./src/app.js";
import logger from "./src/utils/winston.js";
import config from "./config/index.js";

mongoose.connection.on("connected", () => {
  app.listen(config.PORT, () => {
    // displayRoutes(app);
    logger.info("Mongo Database connected");
    logger.info(`Listening on ${config.PORT}`)
    });
});

mongoose.connection.on("error", (error) => {
  logger.fatal(error);
});