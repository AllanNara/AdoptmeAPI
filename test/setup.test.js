import mongoose from "mongoose";
import config from "../config/index.js";

mongoose.set('strictQuery', false);
mongoose.connection.on("connected", () => { console.log("Global: Mongo Database connected to testing") });
mongoose.connection.on("disconnected", () => { console.log("Global: Mongo Database disconnected to testing") });
mongoose.connection.on("error", () => { console.log("Global: Mongo Database error") });

before(async () => {
    await mongoose.connect(config.MONGO_URI);
});
  
after(async () => {
    await mongoose.disconnect()
});