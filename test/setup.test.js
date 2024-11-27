import mongoose from "mongoose";
import config from "../config/index.js";
import logger from "../src/utils/winston.js";

mongoose.set('strictQuery', false);
mongoose.connection.on("connected", () => { logger.info("Global: Mongo Database connected to testing") });
mongoose.connection.on("disconnected", () => { logger.info("Global: Mongo Database disconnected to testing") });
mongoose.connection.on("error", () => { logger.error("Global: Mongo Database error") });

before(async () => {
    await mongoose.connect(config.MONGO_URI);
});
  
after(async () => {
    await mongoose.connection.collections.pets.drop();
    await mongoose.connection.collections.users.drop();
    await mongoose.disconnect()
});