import { Router } from "express";
import { getUserInfo, login, signUp, updateProfile, addProfileImage, removeProfileImage, logout } from "../controllers/AuthController.js";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import fs from "fs";

// Ensure the /tmp/uploads/profiles directory exists
const uploadDir = '/tmp/uploads/profiles';
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to use /tmp/uploads/profiles
const upload = multer({ dest: uploadDir });

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login);    
authRoute.get("/user-info", veriifyToken, getUserInfo);
authRoute.post("/update-profile", veriifyToken, updateProfile);
authRoute.post("/add-profile-image", veriifyToken, upload.single('profile-image'), addProfileImage);
authRoute.delete('/remove-profile-image', veriifyToken, removeProfileImage);
authRoute.post('/logout', logout);

export default authRoute;
