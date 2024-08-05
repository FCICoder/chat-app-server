import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";
import fs from "fs";

// Ensure the /tmp/uploads/files directory exists
const uploadDir = '/tmp/uploads/files';
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to use /tmp/uploads/files
const upload = multer({ dest: uploadDir });

const messagesRoute = Router();

messagesRoute.post('/get-messages', veriifyToken, getMessages);
messagesRoute.post('/upload-file', veriifyToken, upload.single('file'), uploadFile);

export default messagesRoute;