import express from "express";
import { login,signUp,logout } from "../controllers/auth.controllers.js";
let authRouter = express.Router();
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;