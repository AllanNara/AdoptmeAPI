import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo, resourceNotFoundErrorInfo } from "../services/errors/info.js";
import EErrors from "../services/errors/enums.js";

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      CustomError.createError({
        name: "User creation error",
        cause: generateUserErrorInfo(req.body),
        message: "Error Trying to create User",
        code: EErrors.INVALID_TYPES_ERROR
      });
    }
    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      CustomError.createError({
        name: "User creation error",
        cause: `User with email ${email} already exists`,
        message: "Error Trying to create User",
        code: EErrors.CONFLICT
      });
    }
    const hashedPassword = await createHash(password);
    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };
    let result = await usersService.create(user);
    res.send({ status: "success", payload: result._id });
  } catch (error) {
    next(error)
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      CustomError.createError({
        name: "User login error",
        cause: "Missing email or password",
        message: "Error Trying to login User",
        code: EErrors.INVALID_TYPES_ERROR
      });
    }
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      CustomError.createError({
        name: "User login error",
        cause: resourceNotFoundErrorInfo("User"),
        message: "Error Trying to login User",
        code: EErrors.RESOURCE_NOT_FOUND
      });
    }
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      CustomError.createError({
        name: "User login error",
        cause: "Incorrect password",
        message: "Error Trying to login User",
        code: EErrors.BAD_REQUEST
      });
    }
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Logged in" });
  } catch (error) {
    next(error)  
  }
};

const logout = (req, res) => {
  res.clearCookie("coderCookie").send({ status: "success", message: "Logged out" });
}

const current = async (req, res, next) => {
  try {
    const cookie = req.cookies["coderCookie"];
    if(!cookie) {
      CustomError.createError({
        name: "Get current user error",
        cause: "Missing cookie",
        message: "Error trying to get current User",
        code: EErrors.UNAUTHORIZED
      })
    }
    const user = jwt.verify(cookie, "tokenSecretJWT");
    if (user) return res.send({ status: "success", payload: user });
  } catch (error) {
    next(error)  
  }
};

const unprotectedLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      CustomError.createError({
        name: "User login error",
        cause: "Missing email or password",
        message: "Error Trying to login User",
        code: EErrors.INVALID_TYPES_ERROR
      });
    }
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      CustomError.createError({
        name: "User login error",
        cause: resourceNotFoundErrorInfo("User"),
        message: "Error Trying to login User",
        code: EErrors.RESOURCE_NOT_FOUND
      });
    }
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      CustomError.createError({
        name: "User login error",
        cause: "Incorrect password",
        message: "Error Trying to login User",
        code: EErrors.BAD_REQUEST
      });
    }
    const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Unprotected Logged in" });
  } catch (error) {
    next(error)  
  }
};

const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies["unprotectedCookie"];
  const user = jwt.verify(cookie, "tokenSecretJWT");
  if (user) return res.send({ status: "success", payload: user });
};
export default {
  current,
  login,
  logout,
  register,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
