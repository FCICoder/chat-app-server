import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel } from "../controllers/ChannelController.js";

const channelRoute = Router();


channelRoute.post('/create-channel' , veriifyToken , createChannel);

export default channelRoute;