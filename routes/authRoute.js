import { Router } from "express";
import { getUserInfo, login, signUp } from "../controllers/AuthController.js";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";

const authRoute = Router();

authRoute.post("/signup", signUp );
authRoute.post('/login',login)
authRoute.get('/user-info',veriifyToken,getUserInfo)


export default authRoute;