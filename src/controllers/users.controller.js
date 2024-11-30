import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
  resourceNotFoundErrorInfo,
  validateIdErrorInfo,
} from "../services/errors/info.js";
import { usersService } from "../services/index.js";
import mongoose from "mongoose";

const getAllUsers = async (req, res) => {
  const users = await usersService.getAll();
  res.send({ status: "success", payload: users });
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      CustomError.createError({
        name: "User ID error",
        cause: validateIdErrorInfo(userId),
        message: "Param UID is not valid",
        code: EErrors.INVALID_PARAM,
      });
    }
    const user = await usersService.getUserById(userId);
    if (!user) {
      CustomError.createError({
        name: "Resource not found",
        cause: resourceNotFoundErrorInfo("User"),
        message: "User not found",
        code: EErrors.RESOURCE_NOT_FOUND,
      });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      CustomError.createError({
        name: "User ID error",
        cause: validateIdErrorInfo(userId),
        message: "Param UID is not valid",
        code: EErrors.INVALID_PARAM,
      });
    }
    const user = await usersService.getUserById(userId);
    if (!user) {
      CustomError.createError({
        name: "Resource not found",
        cause: resourceNotFoundErrorInfo("User"),
        message: "User not found",
        code: EErrors.RESOURCE_NOT_FOUND,
      });
    }
    const result = await usersService.update(userId, updateBody);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      CustomError.createError({
        name: "User ID error",
        cause: validateIdErrorInfo(userId),
        message: "Param UID is not valid",
        code: EErrors.INVALID_PARAM,
      });
    }
    const result = await usersService.delete(userId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const uploadDocuments = async (req, res, next) => {
  const userId = req.params.uid;
  const files = req.files;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    CustomError.createError({
      name: "User ID error",
      cause: validateIdErrorInfo(userId),
      message: "Param UID is not valid",
      code: EErrors.INVALID_PARAM,
    });
  }
  if (!files) {
    CustomError.createError({
      name: "Files not exists",
      cause: "Missing files",
      message: "None file uploaded",
      code: EErrors.BAD_REQUEST,
    });
  }
  try {
    const uploaded = await usersService.uploadDocuments(userId, files);
    res.status(201).json({ status: "success", payload: uploaded });
  } catch (error) {
    next(error);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  uploadDocuments,
};
