import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel, getUserChannels } from "../controllers/ChannelController.js";

const channelRoute = Router();


channelRoute.post('/create-channel' , veriifyToken , createChannel);
channelRoute.get('/get-user-channel' , veriifyToken , getUserChannels);

export default channelRoute;