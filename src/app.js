import cookieParser from "cookie-parser";
import displayRoutes from "express-routemap";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import compression from "compression";
import config from "../config/index.js";
import adoptionsRouter from "./routes/adoption.router.js";
import petsRouter from "./routes/pets.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import mocksRouter from "./routes/mocks.router.js";
import __dirname from "./utils/index.js";
import errorHandle from "./middlewares/errorHandle.js";
import logger from "./utils/winston.js";

const app = express();
const specs = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Adoptme Documentation",
      description: "API de prueba para clase de Swagger",
    }
  },
  apis: [path.join(__dirname, "../docs/**/*.yaml")]
});

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGO_URI);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use((req, res, next) => {
  logger.http(req.method + " " + req.url);
  next();
});

// LOGGER TEST
app.get("/loggerTest", (req, res) => {
  logger.fatal("Logger testing")
  logger.error("Logger testing")
  logger.warning("Logger testing")
  logger.info("Logger testing")
  logger.http("Logger testing")
  logger.debug("Logger testing")
  res.send({ message: "API up and running with loggers" });
});

app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(specs))
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);
app.use(errorHandle);

mongoose.connection.on("connected", () => {
  app.listen(config.PORT, () => {
    displayRoutes(app);
    logger.info("Mongo Database connected");
    logger.info(`Listening on ${config.PORT}`)
    });
});

mongoose.connection.on("error", (error) => {
  logger.fatal(error);
});

