import express from "express";
import { getCurrentUser, updateProfile } from "../controllers/user.controllers.js";

// Import with fallback checks for both default and named exports
import * as authMiddleware from "../middlewares/isAuth.js";
import * as multerMiddleware from "../middlewares/multer.js";

const isAuth = authMiddleware.default || authMiddleware.isAuth || authMiddleware;
const upload = multerMiddleware.default || multerMiddleware.upload || multerMiddleware;

const userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);

userRouter.put(
  "/updateProfile",
  isAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateProfile
);

export default userRouter;