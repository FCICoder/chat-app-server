import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages } from "../controllers/MessagesController.js";

const messagesRoute = Router();

messagesRoute.post('/get-messages', veriifyToken , getMessages);

export default messagesRoute;