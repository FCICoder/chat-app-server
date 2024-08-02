import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";

const messagesRoute = Router();
const upload = multer({dest: "uploads/files"});

messagesRoute.post('/get-messages', veriifyToken , getMessages);
messagesRoute.post('/upload-file' , veriifyToken, upload.single('file') , uploadFile)

export default messagesRoute;