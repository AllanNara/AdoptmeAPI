import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import uploader from "../utils/uploader.js";
import { documentUserFields } from "../utils/index.js";

const router = Router();

router.get("/", usersController.getAllUsers);
router.get("/:uid", usersController.getUser);
router.put("/:uid", usersController.updateUser);
router.delete("/:uid", usersController.deleteUser);

const fields = documentUserFields.map(doc => {
    return {
        name: doc,
        maxCount: 1
    }
})

router.post(
  "/:uid/documents",
  uploader.fields(fields),
  usersController.uploadDocuments
);

export default router;
