import { Router } from "express";
import mockingController from "../controllers/mocks.controller.js";

const router = Router();

router.get("/mockingpets", mockingController.mockingPets);
router.get("/mockingusers", mockingController.mockingUsers);
router.post("/generateData", mockingController.generateDataMock);
router.post("/deleteData", mockingController.deleteAllData);


export default router