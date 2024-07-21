import { Router } from "express";
import { getUserInfo, login, signUp , updateProfile , addProfileImage ,removeProfileImage } from "../controllers/AuthController.js";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const upload = multer({dest:'uploads/profiles/'})
const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login);
authRoute.get("/user-info", veriifyToken, getUserInfo);
authRoute.post("/update-profile", veriifyToken, updateProfile);
authRoute.post("/add-profile-image", veriifyToken,upload.single('profile-image'), addProfileImage);
authRoute.delete('/remove-profile-image', veriifyToken , removeProfileImage);

export default authRoute;
