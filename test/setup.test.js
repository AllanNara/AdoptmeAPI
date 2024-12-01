import mongoose from "mongoose";
import server from "../server.js";
import logger from "../src/utils/winston.js";

mongoose.connection.on("connected", () => {
  logger.info("Global: Connected to testing");
});
mongoose.connection.on("disconnected", () => {
  logger.info("Global: Disconnected to testing");
});

before(async () => {
  logger.info("Server running for tests");
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  server.close();
});
