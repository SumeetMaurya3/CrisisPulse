import express from "express";
const router = express.Router();

import { multerUpload } from "../Utils/Cloudinary.js";
import {
  Login,
  Signup,
  getUserInfo,
} from "../Controllers/Auth.controllers.js";
import GetUserInfo from "../Utils/GetUserInfo.js";

router.post("/signup", multerUpload.single("avatar"), Signup);

router.post("/login", Login);

router.get("/user/:id", getUserInfo);

export default router;
