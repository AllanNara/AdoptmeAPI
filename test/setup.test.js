import mongoose from "mongoose";
import config from "../config/index.js";
import app from "../src/app.js";
import logger from "../src/utils/winston.js";

mongoose.set('strictQuery', false);
mongoose.connection.on("connected", () => { logger.info("Global: Mongo Database connected to testing") });
mongoose.connection.on("disconnected", () => { logger.info("Global: Mongo Database disconnected to testing") });
mongoose.connection.on("error", () => { logger.error("Global: Mongo Database error") });

let server;
before(async () => {
    server = app.listen(config.PORT, () => {
        logger.info("Server running for tests");
    });
    await mongoose.connect(config.MONGO_URI);  
});
  
after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect()
    await server.close()
});